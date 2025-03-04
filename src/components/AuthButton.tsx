import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/components/AuthButton.module.css";
import { login, logout } from "../data/auth";

export function AuthButton() {
  const { clearUser, user } = useContext(UserContext);

  function onLogout() {
    logout();
    clearUser();
  }

  if (!user)
    return (
      <button className={`${styles.button} ${styles.login}`} onClick={() => login()}>
        Login
      </button>
    );

  return <button className={`${styles.button} ${styles.logout}`} onClick={() => onLogout()}>Logout</button>;
}
