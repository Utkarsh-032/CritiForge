export default function ErrorMessage({ message }) {
  if (!message) return null;
  return <div role="alert" className="rounded-2xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">{message}</div>;
}
