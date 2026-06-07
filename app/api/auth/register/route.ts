import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    if (!supabaseUrl || !supabaseSecret) {
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      )
    }

    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseSecret, {
      auth: { persistSession: false }
    })

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      return NextResponse.json(
        { error: "Database check failed" },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to create user: " + insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
