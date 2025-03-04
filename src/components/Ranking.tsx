import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getRanking } from "../data/supabase";
import { UserInfo } from "../types/UserInfo";
import styles from "../styles/components/Ranking.module.css";

export function Ranking() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState<UserInfo[]>([]);

  useEffect(() => {
    async function getRankingData() {
      const users = await getRanking();

      setUsers(users || []);
    }

    getRankingData();
  }, []);

  if (!user) return null;

  return (
    <ul className={styles.container}>
      {users.map((user) => (
        <div>
          <img src={user.userimage} alt={`${user.username}`} />
          <div>
            <strong>{user.username}</strong>
            <p>
              <img src="icons/level.svg" alt="level" width={14} height={16} />
              Level {user.level}
            </p>
          </div>
        </div>
      ))}
    </ul>
  );
}
