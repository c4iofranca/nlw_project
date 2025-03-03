import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { loginWithGithub, logout } from "../data/supabase";
import styles from "../styles/components/AuthButton.module.css";

export function AuthButton() {
  const { clearUser, user } = useContext(UserContext);

  function onLogout() {
    logout();
    clearUser();
  }

  if (!user)
    return (
      <button className={`${styles.button} ${styles.login}`} onClick={() => loginWithGithub()}>
        Login
      </button>
    );

  return <button className={`${styles.button} ${styles.logout}`} onClick={() => onLogout()}>Logout</button>;
}
