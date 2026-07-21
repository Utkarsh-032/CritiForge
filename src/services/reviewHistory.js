const KEY = "critiforge.reviewHistory.v1";
export const REVIEW_HISTORY_EVENT = "critiforge:review-history-change";
const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
export const getReviewHistory = () => read();
const notify = () => window.dispatchEvent(new Event(REVIEW_HISTORY_EVENT));
export const subscribeToReviewHistory = (listener) => {
  const onStorage = (event) => { if (event.key === KEY) listener(); };
  window.addEventListener(REVIEW_HISTORY_EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(REVIEW_HISTORY_EVENT, listener); window.removeEventListener("storage", onStorage); };
};
export const saveReviewHistory = (entry) => { try { const next = [{ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), ...entry }, ...read()].slice(0, 20); localStorage.setItem(KEY, JSON.stringify(next)); notify(); return next; } catch { return []; } };
export const clearReviewHistory = () => { try { localStorage.removeItem(KEY); notify(); return true; } catch { return false; } };
