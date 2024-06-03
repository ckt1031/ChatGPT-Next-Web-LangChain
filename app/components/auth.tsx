import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";
import { signIn } from "next-auth/react";

export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "";
    });
  }; // Reset access code to empty string

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>Authentication Required</div>
      <div className={styles["auth-tips"]}>
        Complete the authentication to continue
      </div>

      {accessStore.enableSSO && (
        <IconButton
          text="Login with SSO"
          type="primary"
          onClick={signIn}
          className={styles["login-box"]}
        />
      )}

      {accessStore.needCode && (
        <input
          className={styles["auth-input"]}
          type="password"
          placeholder={Locale.Auth.Input}
          value={accessStore.accessCode}
          onChange={(e) => {
            accessStore.update(
              (access) => (access.accessCode = e.currentTarget.value),
            );
          }}
        />
      )}

      <div className={styles["auth-actions"]}>
        {accessStore.needCode && (
          <IconButton
            text={Locale.Auth.Confirm}
            type="primary"
            onClick={goChat}
          />
        )}
        <IconButton
          text={Locale.Auth.Later}
          onClick={() => {
            resetAccessCode();
            goHome();
          }}
        />
      </div>
    </div>
  );
}
