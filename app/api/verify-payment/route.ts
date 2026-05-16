import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// Simple in-memory spam queue (Rate limiter)
const spamQueue = new Map<string, number>()
const COOLDOWN_MS = 30000 // 30 seconds between requests

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Spam Check
  const lastRequest = spamQueue.get(session.user.id) || 0
  if (Date.now() - lastRequest < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastRequest)) / 1000)
    return NextResponse.json({ error: `Slow down! Please wait ${remaining}s before uploading again.` }, { status: 429 })
  }

  const { image, amount } = await req.json()
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    // Fallback if no key is provided yet
    console.warn("GEMINI_API_KEY is missing. Falling back to mock verification.")
    return NextResponse.json({ 
      success: true, 
      confidence: 0.99,
      text: "Mock verification active (No Gemini Key)",
      transactionId: "TXN-MOCK-" + Math.random().toString(36).toUpperCase().substring(2, 8)
    })
  }

  try {
    // Update queue
    spamQueue.set(session.user.id, Date.now())

    // Call Gemini 2.0 Flash API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: `Analyze this payment screenshot. The user claims to have paid ${amount}. Does the screenshot show a successful payment of exactly this amount to VexaNode? Return JSON format: { "isPayment": boolean, "detectedAmount": number, "isVexaNode": boolean, "transactionId": string, "confidence": number }` },
            { inline_data: { mime_type: "image/png", data: image.split(',')[1] } }
          ]
        }]
      })
    })

    const data = await response.json()
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    // Parse JSON from Gemini response (Gemini sometimes wraps in markdown ```json)
    const jsonString = resultText.replace(/```json|```/g, '').trim()
    const result = JSON.parse(jsonString)

    return NextResponse.json({
      success: result.isPayment && result.detectedAmount >= parseFloat(amount.replace(/[^0-9.]/g, '')),
      confidence: result.confidence,
      transactionId: result.transactionId,
      geminiResponse: result
    })

  } catch (error) {
    console.error("Gemini Error:", error)
    return NextResponse.json({ error: "AI Verification failed" }, { status: 500 })
  }
}
