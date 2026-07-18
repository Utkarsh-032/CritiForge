import { Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ErrorMessage from "../components/reports/ErrorMessage";
import LoadingState from "../components/reports/LoadingState";
import PageHeader from "../components/reports/PageHeader";
import WebsiteReviewReport from "../components/reports/WebsiteReviewReport";
import { reviewWebsite } from "../services/api";

const loadingMessages = ["Preparing website analysis", "Collecting page evidence", "Waiting for the visual review", "Building the report"];

export default function WebsiteReview() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => { if (!loading) return undefined; const interval = setInterval(() => setLoadingMessageIndex((index) => (index + 1) % loadingMessages.length), 2200); return () => clearInterval(interval); }, [loading]);

  async function submitWebsiteReview() {
    if (!url.trim()) { setError("Enter a website URL, including http:// or https://."); return; }
    try { const parsed = new URL(url); if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid"); } catch { setError("Enter a valid website URL, including http:// or https://."); return; }
    setError(""); setLoadingMessageIndex(0); setLoading(true); setReport(null);
    try { const { data } = await reviewWebsite(url); setReport(data); }
    catch (requestError) { setError(requestError.response?.data?.error || "We could not create the website review. Confirm the backend is running and retry."); }
    finally { setLoading(false); }
  }

  function handleSubmit(event) { event.preventDefault(); submitWebsiteReview(); }

  return <DashboardLayout title="Website Review"><div className="space-y-8"><PageHeader eyebrow="Website intelligence" title="Review a website with clarity" description="Get an evidence-based AI assessment for visual design, accessibility, UX, and Performance Readiness." />
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6"><label htmlFor="website-url" className="text-sm font-semibold text-white">Website URL</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Globe2 className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyan-300" /><input id="website-url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="w-full rounded-xl border border-white/10 bg-[#0F172A]/80 py-3.5 pl-12 pr-4 text-white outline-none transition focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15" /></div><button disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white transition hover:from-violet-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Analyzing…" : "Analyze Website"}</button></div></form>
    <ErrorMessage message={error} />{loading && <LoadingState label={loadingMessages[loadingMessageIndex]} />}{report && <WebsiteReviewReport report={report} />}</div></DashboardLayout>;
}
