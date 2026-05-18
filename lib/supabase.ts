import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = async () => {
  // Return a pure admin client that bypasses RLS since we verify auth with NextAuth instead of Supabase Auth
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
