import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import styles from "../styles/components/CompletedChallenges.module.css";
import { UserContext } from "../contexts/UserContext";

export function CompletedChallenges() {
  const { user } = useContext(UserContext);
  const { challengesCompleted } = useContext(ChallengesContext);

  if (!user) return;

  return (
    <div className={styles.completedChallengesContainer}>
      <span>Desafios completos</span>
      <span>{challengesCompleted}</span>
    </div>
  );
}
