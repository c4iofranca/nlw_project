import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import challenges from "../../challenges.json";
import Cookies from "js-cookie";
import { LevelUpModal } from "../components/LevelUpModal";
import {
  getUser,
  getUserStatistics,
  updateUserStatistics,
} from "../data/supabase";
import { UserContext } from "./UserContext";

interface Challenge {
  type: "body" | "eye";
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  completedChallenge: () => void;
  resetChallenge: () => void;
  startNewChallenge: () => void;
  closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);
export function ChallengesProvider({
  children,
  ...rest
}: ChallengesProviderProps) {
  const { user } = useContext(UserContext);

  const [level, setLevel] = useState<number>(1);
  const [currentExperience, setCurrentExperience] = useState<number>(0);
  const [challengesCompleted, setChallengesCompleted] = useState<number>(0);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio("/notification.mp3").play();
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function resetStatistics() {
    setLevel(1);
    setCurrentExperience(0);
    setChallengesCompleted(0);
  }

  async function completedChallenge() {
    if (!activeChallenge) {
      return;
    }
    const { amount } = activeChallenge;
    let finalExperience = currentExperience + amount;
    let finalLevel = level;

    if (finalExperience > experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      setIsLevelUpModalOpen(true);
      finalLevel = level + 1;
    }

    const completed = challengesCompleted + 1;

    setCurrentExperience(finalExperience);
    setChallengesCompleted(completed);
    setLevel(finalLevel);
    setActiveChallenge(null);

    await updateUserStatistics({
      id: user.id,
      level: finalLevel,
      challengesCompleted: completed,
      experience: finalExperience,
    });
  }

  useEffect(() => {
    if (!user) {
      resetStatistics();
      return;
    }

    const fetchUserData = async () => {
      const statistics = await getUserStatistics(user.id);

      const { challengesCompleted, experience, level } = statistics;

      setLevel(level);
      setCurrentExperience(experience);
      setChallengesCompleted(challengesCompleted);
    };

    fetchUserData();
  }, [user]);

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        challengesCompleted,
        activeChallenge,
        experienceToNextLevel,
        completedChallenge,
        resetChallenge,
        startNewChallenge,
        closeLevelUpModal,
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  );
}
