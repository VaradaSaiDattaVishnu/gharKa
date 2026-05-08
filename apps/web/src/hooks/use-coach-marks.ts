"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gharka-coach-marks";

function getShownMarks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveShownMarks(marks: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...marks]));
}

export function useCoachMarks() {
  const [shownMarks, setShownMarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    setShownMarks(getShownMarks());
  }, []);

  const shouldShow = useCallback(
    (markId: string) => !shownMarks.has(markId),
    [shownMarks]
  );

  const dismiss = useCallback(
    (markId: string) => {
      const updated = new Set(shownMarks);
      updated.add(markId);
      setShownMarks(updated);
      saveShownMarks(updated);
    },
    [shownMarks]
  );

  const resetAll = useCallback(() => {
    setShownMarks(new Set());
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { shouldShow, dismiss, resetAll };
}
