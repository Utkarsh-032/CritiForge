const KEY = "critiforge.reviewHistory.v1";
const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
export const getReviewHistory = () => read();
export const saveReviewHistory = (entry) => { try { const next = [{ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString(), ...entry }, ...read()].slice(0, 20); localStorage.setItem(KEY, JSON.stringify(next)); return next; } catch { return []; } };
export const clearReviewHistory = () => { try { localStorage.removeItem(KEY); return true; } catch { return false; } };
