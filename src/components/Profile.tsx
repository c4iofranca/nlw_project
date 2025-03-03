import { useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import styles from "../styles/components/Profile.module.css";
import { UserContext } from "../contexts/UserContext";

export function Profile() {
  const { user } = useContext(UserContext);
  const { level } = useContext(ChallengesContext);

  if (!user) return;

  const {
    user_metadata: { avatar_url, full_name },
  } = user;

  return (
    <div className={styles.profileContainer}>
      <img src={avatar_url} alt={full_name} />
      <div>
        <strong>{full_name}</strong>
        <p>
          <img src="icons/level.svg" alt="level" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
