"use client";

import { useSyncExternalStore } from "react";
import { parseReceipt, receiptStorageKey } from "./command";

const receiptEvent = "senialon-command-changed";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(receiptEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(receiptEvent, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(receiptStorageKey) ?? "";
  } catch {
    return "unavailable";
  }
}
export function useReceipt() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "loading");
  try {
    return {
      receipt: parseReceipt(raw === "" || raw === "loading" ? null : raw),
      ready: raw !== "loading",
      error: false,
    };
  } catch {
    return { receipt: null, ready: true, error: true };
  }
}
export function changedReceipt() {
  window.dispatchEvent(new Event(receiptEvent));
}
