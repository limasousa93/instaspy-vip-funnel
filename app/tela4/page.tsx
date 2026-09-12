"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./tela4.module.css";
import { useLoginMatrixAnimation } from "./use-login-matrix-animation";
import { useLastSearchedProfile } from "@/lib/instagram/last-searched-profile";

const ENTER_TRANSITION_MS = 600;

function preventDefault(event: { preventDefault: () => void }) {
  event.preventDefault();
}

export default function Tela4Page() {
  const router = useRouter();
  const { pwdText, statusText, statusVisible, bannerVisible, buttonEnabled } = useLoginMatrixAnimation();
  const lastSearchedProfile = useLastSearchedProfile();
  const [isEntering, setIsEntering] = useState(false);

  function handleEnterClick() {
    if (!buttonEnabled || isEntering) return;
    setIsEntering(true);
    window.setTimeout(() => router.push("/feed"), ENTER_TRANSITION_MS);
  }

  return (
    <div className={styles.page}>
      <div
        className={`${styles.accessBanner} ${bannerVisible ? styles.accessBannerVisible : ""}`}
        id="accessBanner"
      >
        ACESSO AUTORIZADO
        <br />
        CLIQUE EM ENTRAR
      </div>

      <div className={styles.screen}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logoImg} src="/0204.png" alt="Instagram" />

        <div className={styles.field} id="userField">
          {lastSearchedProfile?.username ? `@${lastSearchedProfile.username}` : ""}
        </div>

        <div className={`${styles.field} ${styles.password}`}>
          <span id="pwdText">{pwdText}</span>
        </div>

        {statusVisible && (
          <div className={styles.statusMsg} id="statusMsg">
            {statusText}
          </div>
        )}

        <div
          className={`${styles.btnPrimary} ${buttonEnabled ? styles.clickable : styles.disabled} ${
            isEntering ? styles.entering : ""
          }`}
          id="enterBtn"
          onClick={handleEnterClick}
          role="button"
          tabIndex={buttonEnabled ? 0 : -1}
        >
          {isEntering ? <span className={styles.spinner} /> : "Entrar"}
        </div>

        <a href="#" className={styles.link} onClick={preventDefault}>
          Esqueceu a senha?
        </a>

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>OU</span>
          <div className={styles.dividerLine} />
        </div>

        <div className={styles.fbLogin}>
          <div className={styles.fbIcon}>
            <svg className={styles.fbIconSvg} viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
            </svg>
          </div>
          <a href="#" className={`${styles.link} ${styles.fbLoginLink}`} onClick={preventDefault}>
            Entrar com o Facebook
          </a>
        </div>

        <div className={styles.separator} />

        <div className={styles.signup}>
          Não tem uma conta?{" "}
          <a href="#" className={`${styles.link} ${styles.signupLink}`} onClick={preventDefault}>
            Cadastre-se.
          </a>
        </div>
      </div>
    </div>
  );
}
