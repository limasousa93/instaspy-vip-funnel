"use client";

import { useEffect, useRef, useState } from "react";

const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
const FIXED_COUNT = 13;
const ERASE_FLOOR = 3;
const TYPE_INTERVAL_MS = 60;
const ERASE_INTERVAL_MS = 60;
const PAUSE_AFTER_TYPE_MS = 200;
const PAUSE_AFTER_ERASE_MS = 200;

const STATUS_MESSAGES = [
  "localizando senha...",
  "analisando combinações...",
  "iniciando protocolo MATRIX...",
  "senha recuperada com sucesso.",
];
const STATUS_MESSAGE_DURATION_MS = 5000;

function randChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

export function useLoginMatrixAnimation() {
  const [pwdText, setPwdText] = useState("*".repeat(ERASE_FLOOR));
  const [statusIndex, setStatusIndex] = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const stopPwdRef = useRef(false);

  useEffect(() => {
    const timeouts: number[] = [];
    function schedule(fn: () => void, delay: number) {
      const id = window.setTimeout(fn, delay);
      timeouts.push(id);
    }

    function runCycle() {
      if (stopPwdRef.current) return;
      const randomSuffix = Array.from({ length: 4 }, randChar).join("");
      const target = "*".repeat(FIXED_COUNT) + randomSuffix;

      function typeStep(current: string) {
        if (stopPwdRef.current) return;
        if (current.length >= target.length) {
          schedule(() => eraseStep(current), PAUSE_AFTER_TYPE_MS);
          return;
        }
        const next = target.slice(0, current.length + 1);
        setPwdText(next);
        schedule(() => typeStep(next), TYPE_INTERVAL_MS);
      }

      function eraseStep(current: string) {
        if (stopPwdRef.current) return;
        if (current.length <= ERASE_FLOOR) {
          schedule(runCycle, PAUSE_AFTER_ERASE_MS);
          return;
        }
        const next = current.slice(0, -1);
        setPwdText(next);
        schedule(() => eraseStep(next), ERASE_INTERVAL_MS);
      }

      typeStep("*".repeat(ERASE_FLOOR));
    }

    runCycle();

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    const timeouts: number[] = [];
    function showNext(index: number) {
      setStatusIndex(index);
      if (index === STATUS_MESSAGES.length - 1) {
        const id = window.setTimeout(() => {
          setStatusVisible(false);
          stopPwdRef.current = true;
          setBannerVisible(true);
          setButtonEnabled(true);
        }, STATUS_MESSAGE_DURATION_MS);
        timeouts.push(id);
        return;
      }
      const id = window.setTimeout(() => showNext(index + 1), STATUS_MESSAGE_DURATION_MS);
      timeouts.push(id);
    }
    showNext(0);

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return {
    pwdText,
    statusText: STATUS_MESSAGES[statusIndex],
    statusVisible,
    bannerVisible,
    buttonEnabled,
  };
}
