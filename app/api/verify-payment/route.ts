import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const spamQueue = new Map<string, number>()
const COOLDOWN_MS = 30000

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lastRequest = spamQueue.get(session.user.id) || 0
  if (Date.now() - lastRequest < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastRequest)) / 1000)
    return NextResponse.json(
      { error: `Slow down! Please wait ${remaining}s before uploading again.` },
      { status: 429 }
    )
  }

  let image: string | undefined
  let amount: string | undefined

  try {
    const body = await req.json()
    image = body.image
    amount = body.amount
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!image || !amount) {
    return NextResponse.json({ error: "Missing image or amount" }, { status: 400 })
  }

  const base64Data = image.includes(",") ? image.split(",")[1] : image
  if (!base64Data) {
    return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Falling back to mock verification.")
    return NextResponse.json({
      success: true,
      confidence: 0.99,
      text: "Mock verification active (No Gemini Key)",
      transactionId: "TXN-MOCK-" + Math.random().toString(36).toUpperCase().substring(2, 8),
    })
  }

  try {
    spamQueue.set(session.user.id, Date.now())

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this payment screenshot. The user claims to have paid ${amount}. Does the screenshot show a successful payment of exactly this amount to VexaNode? Return ONLY a raw JSON object with no markdown, no backticks, no explanation. Format: { "isPayment": boolean, "detectedAmount": number, "isVexaNode": boolean, "transactionId": string, "confidence": number }`,
                },
                {
                  inline_data: { mime_type: "image/png", data: base64Data },
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await geminiRes.json()

    if (!geminiRes.ok || data.error) {
      console.error("Gemini API error:", JSON.stringify(data))
      return NextResponse.json(
        { error: `Gemini API error: ${data.error?.message || "Unknown error"}` },
        { status: 502 }
      )
    }

    const resultText: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!resultText) {
      console.error("Gemini returned no text. Full response:", JSON.stringify(data))
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      )
    }

    const jsonString = resultText.replace(/```json|```/g, "").trim()

    let result: {
      isPayment: boolean
      detectedAmount: number
      isVexaNode: boolean
      transactionId: string
      confidence: number
    }

    try {
      result = JSON.parse(jsonString)
    } catch {
      console.error("Failed to parse Gemini JSON. Raw text:", resultText)
      return NextResponse.json(
        { error: "AI response was not valid JSON" },
        { status: 502 }
      )
    }

    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ""))
    const success = result.isPayment && result.detectedAmount >= parsedAmount

    return NextResponse.json({
      success,
      confidence: result.confidence,
      transactionId: result.transactionId,
      geminiResponse: result,
    })
  } catch (error) {
    console.error("Gemini Error:", error)
    return NextResponse.json({ error: "AI Verification failed" }, { status: 500 })
  }
}
