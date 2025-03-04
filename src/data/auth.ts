import { supabase } from "./supabase";

async function login() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) throw new Error(error.message, { cause: error.cause });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
  }
}

async function logout() {
  await supabase.auth.signOut();
}

export { login, logout };
