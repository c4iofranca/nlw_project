import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";

import Head from "next/head";
import { GetServerSideProps } from "next";

import styles from "../styles/pages/Home.module.css";
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from "../contexts/ChallengesContext";
import {
  checkIfUserExists,
  createUserInitialStatistics,
  loginWithGithub,
  logout,
  supabase,
} from "../data/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        return;
      }

      const userExists = await checkIfUserExists(data.user.id);

      if (!userExists) {
        await createUserInitialStatistics(data.user.id);
      }

      setUser(data.user);
    };

    fetchUser();
  }, []);

  return (
    <ChallengesProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>

        {user ? (
          <button
            onClick={() => {
              logout();
              setUser(null);
            }}
          >
            Logout
          </button>
        ) : (
          <button onClick={() => loginWithGithub()}>Login</button>
        )}

        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              {user && user.user_metadata && (
                <Profile
                  image={user?.user_metadata?.avatar_url}
                  name={user?.user_metadata?.full_name}
                />
              )}

              <CompletedChallenges />
              <Countdown />
            </div>

            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
    },
  };
};
