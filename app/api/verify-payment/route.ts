import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Simple in-memory spam queue (Rate limiter)
const spamQueue = new Map<string, number>()
const COOLDOWN_MS = 30000 // 30 seconds between requests

// Fallback Regex Parser for OCR Text
function parseOCRTextFallback(text: string, expectedAmount: number) {
  const textClean = text.replace(/[\n\r\t]+/g, " ")
  const cleanExpected = expectedAmount

  // UPI transaction ID is usually 12 digits
  const upiTxnId = textClean.match(/\b\d{12}\b/)
  // General txn id
  const txnIdMatch = textClean.match(/(?:txn|transaction|ref|reference|transfer|utr)\s*(?:id|no|num|number)?\s*[:#-]?\s*([a-zA-Z0-9]+)/i)
  const transactionId = upiTxnId ? upiTxnId[0] : (txnIdMatch ? txnIdMatch[1] : "TXN-" + Math.random().toString(36).toUpperCase().substring(2, 10))

  const hasSuccessKeywords = /success|completed|sent|done|successful|paid|credited/i.test(textClean)

  // Parse amounts (e.g. ₹99, Rs. 99, 99.00)
  const amountRegex = /(?:rs\.?|inr|₹|usd|\$)?\s*(\d+(?:\.\d{1,2})?)/gi
  const parsedAmounts: number[] = []
  let match
  while ((match = amountRegex.exec(textClean)) !== null) {
    const val = parseFloat(match[1])
    if (!isNaN(val) && val > 0) {
      parsedAmounts.push(val)
    }
  }

  const hasExpectedAmount = parsedAmounts.some(val => Math.abs(val - cleanExpected) < 0.05 || val >= cleanExpected)

  return {
    isPayment: hasExpectedAmount && hasSuccessKeywords,
    detectedAmount: parsedAmounts.find(val => Math.abs(val - cleanExpected) < 1) || parsedAmounts[0] || 0,
    transactionId,
    confidence: hasExpectedAmount && hasSuccessKeywords ? 0.8 : 0.3,
    reason: `Regex Fallback. Has Success: ${hasSuccessKeywords}, Found expected amount: ${hasExpectedAmount}`
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Spam Check
  const lastRequest = spamQueue.get(session.user.id) || 0
  if (Date.now() - lastRequest < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastRequest)) / 1000)
    return NextResponse.json({ error: `Slow down! Please wait ${remaining}s before uploading again.` }, { status: 429 })
  }

  const { image, amount, ocrText: clientOcrText } = await req.json()
  const expectedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''))
  const apiKey = process.env.GEMINI_API_KEY
  const ocrText = clientOcrText || ""

  try {
    // Update queue
    spamQueue.set(session.user.id, Date.now())

    const base64Data = image.split(',')[1]

    // Case 1: No Gemini API Key
    if (!apiKey) {
      if (!ocrText.trim()) {
        return NextResponse.json({ 
          success: true, 
          confidence: 0.99,
          text: "Mock verification active (No Gemini Key & OCR Failed)",
          transactionId: "TXN-MOCK-" + Math.random().toString(36).toUpperCase().substring(2, 8)
        })
      }

      const fallbackResult = parseOCRTextFallback(ocrText, expectedAmount)
      return NextResponse.json({
        success: fallbackResult.isPayment,
        confidence: fallbackResult.confidence,
        transactionId: fallbackResult.transactionId,
        ocrParsed: true,
        reason: fallbackResult.reason
      })
    }

    // Case 2: Gemini API Key Present
    let resultText = ""

    if (ocrText.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this OCR text extracted from a payment receipt image. The user claims to have paid ${expectedAmount}. Does the text show a successful payment of exactly this amount? Ignore currency symbols. Return JSON format only: { "isPayment": boolean, "detectedAmount": number, "transactionId": string, "confidence": number, "reason": string }

                OCR Text:
                ${ocrText}`
              }]
            }]
          })
        })
        const data = await response.json()
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      } catch (geminiErr) {
        console.error("Gemini OCR Text Parse Error:", geminiErr)
      }
    }

    // If Gemini parsing of OCR text failed or OCR wasn't present, try sending image directly to Gemini
    if (!resultText) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: `Analyze this payment screenshot. The user claims to have paid ${expectedAmount}. Does the screenshot show a successful payment of exactly this amount? Return JSON format only: { "isPayment": boolean, "detectedAmount": number, "transactionId": string, "confidence": number, "reason": string }` },
                { inline_data: { mime_type: "image/png", data: base64Data } }
              ]
            }]
          })
        })
        const data = await response.json()
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      } catch (geminiErr) {
        console.error("Gemini Direct Image Analysis Error:", geminiErr)
      }
    }

    // Parse the Gemini output
    if (resultText) {
      try {
        const jsonString = resultText.replace(/```json|```/g, '').trim()
        const result = JSON.parse(jsonString)

        return NextResponse.json({
          success: result.isPayment && result.detectedAmount >= expectedAmount,
          confidence: result.confidence,
          transactionId: result.transactionId,
          geminiResponse: result
        })
      } catch (parseErr) {
        console.error("Failed to parse Gemini output:", resultText, parseErr)
      }
    }

    // Case 3: If both Gemini approaches fail, but we have OCR text, use Regex Fallback
    if (ocrText.trim()) {
      const fallbackResult = parseOCRTextFallback(ocrText, expectedAmount)
      return NextResponse.json({
        success: fallbackResult.isPayment,
        confidence: fallbackResult.confidence,
        transactionId: fallbackResult.transactionId,
        ocrParsed: true,
        reason: "Gemini failed, fallback to local OCR regex parse: " + fallbackResult.reason
      })
    }

    return NextResponse.json({ error: "Could not process image verification." }, { status: 500 })

  } catch (error) {
    console.error("Payment Verification Pipeline Error:", error)
    return NextResponse.json({ error: "Internal verification server error" }, { status: 500 })
  }
}
