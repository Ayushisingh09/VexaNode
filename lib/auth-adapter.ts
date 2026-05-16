import { createClient } from "@supabase/supabase-js";
import { type Adapter } from "next-auth/adapters";

export function isDate(value: any): value is Date {
    return value instanceof Date || Object.prototype.toString.call(value) === '[object Date]';
}

export function format(obj: any) {
    if (!obj) return obj;
    for (const [key, value] of Object.entries(obj)) {
        if (value === null) {
            delete obj[key];
        }
        if (isDate(value)) {
            obj[key] = new Date(value);
        }
    }
    return obj;
}

/**
 * Custom Supabase Adapter that uses the 'public' schema.
 */
export function CustomSupabaseAdapter(options: { url: string; secret: string }) {
    const { url, secret } = options;
    const supabase = createClient(url, secret, {
        db: { schema: "public" }, // Fixed: Force public schema
        global: { headers: { "X-Client-Info": "@auth/supabase-adapter-custom" } },
        auth: { persistSession: false },
    });

    return {
        async createUser(user: any) {
            const { data, error } = await supabase
                .from("users")
                .insert({
                    ...user,
                    emailVerified: user.emailVerified?.toISOString(),
                })
                .select()
                .single();
            if (error) throw error;
            return format(data);
        },
        async getUser(id: string) {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("id", id)
                .maybeSingle();
            if (error) throw error;
            if (!data) return null;
            return format(data);
        },
        async getUserByEmail(email: string) {
            const { data, error } = await supabase
                .from("users")
                .select()
                .eq("email", email)
                .maybeSingle();
            if (error) throw error;
            if (!data) return null;
            return format(data);
        },
        async getUserByAccount({ providerAccountId, provider }: any) {
            const { data, error } = await supabase
                .from("accounts")
                .select("users (*)")
                .match({ provider, providerAccountId })
                .maybeSingle();
            if (error) throw error;
            if (!data || !data.users) return null;
            return format(data.users);
        },
        async updateUser(user: any) {
            const { data, error } = await supabase
                .from("users")
                .update({
                    ...user,
                    emailVerified: user.emailVerified?.toISOString(),
                })
                .eq("id", user.id)
                .select()
                .single();
            if (error) throw error;
            return format(data);
        },
        async deleteUser(userId: string) {
            const { error } = await supabase.from("users").delete().eq("id", userId);
            if (error) throw error;
        },
        async linkAccount(account: any) {
            const { error } = await supabase.from("accounts").insert(account);
            if (error) throw error;
        },
        async unlinkAccount({ providerAccountId, provider }: any) {
            const { error } = await supabase
                .from("accounts")
                .delete()
                .match({ provider, providerAccountId });
            if (error) throw error;
        },
        async createSession({ sessionToken, userId, expires }: any) {
            const { data, error } = await supabase
                .from("sessions")
                .insert({ sessionToken, userId, expires: expires.toISOString() })
                .select()
                .single();
            if (error) throw error;
            return format(data);
        },
        async getSessionAndUser(sessionToken: string) {
            const { data, error } = await supabase
                .from("sessions")
                .select("*, users(*)")
                .eq("sessionToken", sessionToken)
                .maybeSingle();
            if (error) throw error;
            if (!data) return null;
            const { users: user, ...session } = data;
            return {
                user: format(user),
                session: format(session),
            };
        },
        async updateSession(session: any) {
            const { data, error } = await supabase
                .from("sessions")
                .update({
                    ...session,
                    expires: session.expires?.toISOString(),
                })
                .eq("sessionToken", session.sessionToken)
                .select()
                .single();
            if (error) throw error;
            return format(data);
        },
        async deleteSession(sessionToken: string) {
            const { error } = await supabase
                .from("sessions")
                .delete()
                .eq("sessionToken", sessionToken);
            if (error) throw error;
        },
        async createVerificationToken(token: any) {
            const { data, error } = await supabase
                .from("verification_tokens")
                .insert({
                    ...token,
                    expires: token.expires.toISOString(),
                })
                .select()
                .single();
            if (error) throw error;
            const { id, ...verificationToken } = data;
            return format(verificationToken);
        },
        async useVerificationToken({ identifier, token }: any) {
            const { data, error } = await supabase
                .from("verification_tokens")
                .delete()
                .match({ identifier, token })
                .select()
                .maybeSingle();
            if (error) throw error;
            if (!data) return null;
            const { id, ...verificationToken } = data;
            return format(verificationToken);
        },
    } as any;
}
