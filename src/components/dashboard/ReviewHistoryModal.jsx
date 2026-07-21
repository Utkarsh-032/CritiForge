import { Bot, Code2, Globe2, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import CodeReviewReport from "../reports/CodeReviewReport";
import MentorReport from "../reports/MentorReport";
import WebsiteReviewReport from "../reports/WebsiteReviewReport";

const typeDetails = {
  website: { label: "Website Review", icon: Globe2, inputLabel: "Reviewed URL" },
  code: { label: "Code Review", icon: Code2, inputLabel: "Original input" },
  mentor: { label: "AI Mentor", icon: Bot, inputLabel: "Question" },
};

function formattedDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function SavedInput({ review }) {
  const input = review.input || {};
  if (review.type === "website") return <p className="break-all text-sm leading-6 text-slate-200">{input.reviewedUrl || review.inputSummary || "URL unavailable"}</p>;
  if (review.type === "code") return <><p className="text-sm text-slate-300">Language: <span className="font-medium capitalize text-white">{input.language || "Unavailable"}</span></p>{input.codePreview && <pre className="mt-3 max-w-full overflow-x-auto rounded-xl bg-slate-950/80 p-4 text-xs leading-6 text-cyan-100"><code>{input.codePreview}</code></pre>}</>;
  return <><p className="break-words text-sm leading-6 text-slate-200">{input.question || review.inputSummary || "Question unavailable"}</p>{input.contextPreview && <div className="mt-3 border-t border-white/10 pt-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Context preview</p><pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{input.contextPreview}</pre></div>}</>;
}

function SavedReport({ review }) {
  if (review.type === "website") return <WebsiteReviewReport report={review.report} />;
  if (review.type === "code") return <CodeReviewReport report={review.report} />;
  return <MentorReport answer={review.report} />;
}

export default function ReviewHistoryModal({ review, onClose, onDelete }) {
  const dialogRef = useRef(null);
  const details = typeDetails[review.type] || typeDetails.website;
  const Icon = details.icon;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="saved-review-title" tabIndex={-1} className="flex h-[96dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0A0A10] shadow-2xl outline-none sm:h-auto sm:max-h-[90vh] sm:max-w-6xl sm:rounded-[28px] focus-visible:ring-2 focus-visible:ring-violet-400">
        <header className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#0D0D12]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 gap-3">
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-400/15 text-violet-200 ring-1 ring-violet-400/25"><Icon size={20} /></span>
            <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">{details.label}</p><h2 id="saved-review-title" className="mt-1 break-words text-lg font-semibold text-white sm:text-xl">{review.title}</h2><p className="mt-1 text-xs text-slate-400">{formattedDate(review.createdAt)}</p></div>
          </div>
          <div className="flex shrink-0 items-center gap-3">{Number.isFinite(review.score) && <span className="hidden rounded-full bg-cyan-400/10 px-3 py-1.5 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/20 sm:inline-flex">{review.score}/100</span>}<button type="button" onClick={onClose} aria-label="Close review details" className="grid size-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"><X size={20} /></button></div>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          {Number.isFinite(review.score) && <p className="mb-4 text-sm font-semibold text-cyan-200 sm:hidden">Score: {review.score}/100</p>}
          {review.report ? <div className="min-w-0 space-y-5"><section className="min-w-0 rounded-2xl border border-white/10 bg-[#121218] p-4"><h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{details.inputLabel}</h3><div className="mt-3"><SavedInput review={review} /></div></section><SavedReport review={review} /></div> : <section className="mx-auto max-w-2xl rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5 sm:p-6"><h3 className="font-semibold text-amber-100">Saved report unavailable</h3><p className="mt-2 text-sm leading-6 text-slate-300">This older history item does not contain a saved report. New reviews will be available to reopen from history.</p></section>}
        </div>

        <footer className="sticky bottom-0 flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-white/10 bg-[#0D0D12]/95 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button type="button" onClick={onDelete} className="mr-auto inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"><Trash2 size={16} />Delete from History</button>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Close</button>
          <Link to={review.route} className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300">Start a New Review</Link>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
