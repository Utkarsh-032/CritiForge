import { GraduationCap } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ErrorMessage from "../components/reports/ErrorMessage";
import LoadingState from "../components/reports/LoadingState";
import MentorReport from "../components/reports/MentorReport";
import PageHeader from "../components/reports/PageHeader";
import EmptyState from "../components/reports/EmptyState";
import { askMentor } from "../services/api";
import { saveReviewHistory } from "../services/reviewHistory";

export default function Mentor() {
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [retryable, setRetryable] = useState(false);

  async function submitMentor() {
    if (!question.trim()) { setError("Add a topic or question for your mentor session."); setRetryable(false); return; }
    if (question.trim().length > 3000) { setError("Question must not exceed 3000 characters."); setRetryable(false); return; }
    if (context.trim().length > 15000) { setError("Context must not exceed 15000 characters."); setRetryable(false); return; }

    setError("");
    setRetryable(false);
    setLoading(true);
    setAnswer(null);

    try {
      const { data } = await askMentor(question, context);
      saveReviewHistory({ type: "mentor", title: data.topic || "AI Mentor Session", summary: data.summary || "Mentor guidance completed.", route: "/ai-mentor", metadata: { topic: data.topic || "" } });
      setAnswer(data);
    } catch (requestError) {
      const status = requestError.response?.status;
      setError(requestError.response?.data?.error || "We could not prepare your mentor guidance. Confirm the backend is running and retry.");
      setRetryable([429, 502, 503].includes(status));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) { event.preventDefault(); submitMentor(); }

  return <DashboardLayout title="AI Mentor"><div className="space-y-8"><PageHeader eyebrow="Guided learning" title="Build understanding, not just answers" description="Frame a topic or engineering decision and receive a structured AI explanation." />
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6"><label htmlFor="topic" className="text-sm font-semibold text-white">What would you like to understand?</label><input id="topic" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="For example: How should I organize React component state?" className="mt-3 w-full rounded-xl border border-white/10 bg-[#0F172A]/80 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15" /><p className="mt-2 text-right text-xs text-slate-500">{question.trim().length}/3000 characters</p><label htmlFor="context" className="mt-5 block text-sm font-semibold text-white">Code or context <span className="font-normal text-slate-500">(optional)</span></label><textarea id="context" value={context} onChange={(event) => setContext(event.target.value)} placeholder="Share code, constraints, or the decision you are weighing..." className="mt-3 min-h-48 w-full resize-y rounded-2xl border border-white/10 bg-[#0F172A]/80 p-4 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15" /><p className="mt-2 text-right text-xs text-slate-500">{context.trim().length}/15000 characters</p><button disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white transition hover:from-violet-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"><GraduationCap size={18} />{loading ? "Preparing…" : "Ask Mentor"}</button></form>
    <ErrorMessage message={error} />{retryable && <button type="button" onClick={submitMentor} disabled={loading} className="rounded-xl border border-violet-400/30 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-400/10 disabled:cursor-not-allowed disabled:opacity-60">Retry mentor guidance</button>}{loading && <LoadingState label="Preparing mentor guidance" />}{!loading && !answer && !error && <EmptyState title="Ask, understand, build with confidence" description="Use AI Mentor for debugging, architecture choices, best practices, and clear concept explanations." hint="Try: How should I organize React form state?" />}{answer && <MentorReport answer={answer} />}</div></DashboardLayout>;
}
