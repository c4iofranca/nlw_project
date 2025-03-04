import { createClient } from "@supabase/supabase-js";
import { Statistics } from "../types/Statistics";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

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

async function getUserStatistics(id: string): Promise<Statistics> {
  const { data, error } = await supabase
    .from("statistics")
    .select()
    .eq("id", id)
    .single();

  return data;
}

async function updateUserStatistics(statistics: Statistics) {
  const userId = statistics.id;

  if (!userId) return;

  const { challengesCompleted, experience, level } = statistics;

  const { data, error } = await supabase
    .from("statistics")
    .update({ level, experience, challengesCompleted })
    .eq("id", userId)
    .select();

  return data;
}

async function getRanking() {
  const { data, error } = await supabase.from("user_info").select()

  console.log(data)

  return data;
}

export {
  getUser,
  supabase,
  createUserInitialStatistics,
  checkIfUserExists,
  getUserStatistics,
  updateUserStatistics,
  getRanking
};
