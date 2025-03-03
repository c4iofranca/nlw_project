import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

async function loginWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
    },
  });
}

async function logout() {
  const { error } = await supabase.auth.signOut();
}

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

}

async function checkIfUserExists(id: string) {
  const { data: statistics, error } = await supabase
    .from("statistics")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return statistics !== null;
}

async function createUserInitialStatistics(id: string) {
  const { data, error } = await supabase
    .from("statistics")
    .insert([{ id }])
    .select()
    .single();

  return data;
}

export {
  loginWithGithub,
  logout,
  getUser,
  supabase,
  createUserInitialStatistics,
  checkIfUserExists,
};
