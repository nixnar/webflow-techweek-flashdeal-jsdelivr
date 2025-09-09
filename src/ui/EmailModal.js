import React from "react";

export default function EmailModal({ open, onClose, onSubmit }) {
  if (!open) return null;
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  function submit(e) {
    e?.preventDefault?.();
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    onSubmit?.(email.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 p-4 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[min(560px,95vw)] text-white">
        <div className="border border-white p-[4px] bg-black">
          <div className="border border-white p-5">
            <h3 className="text-[1.5rem] font-[800] mb-3">Enter your email</h3>
            <p className="text-white/70 text-[0.95rem] mb-4">
              We'll save it for future redemptions.
            </p>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-black text-white placeholder-white/40 border border-white px-4 py-3 focus:outline-none"
              />
              {error ? (
                <p className="text-red-500 text-[0.95rem]">{error}</p>
              ) : null}
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="border border-white px-4 py-3 font-[800] uppercase bg-white text-black hover:bg-[#00e1ff] transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="border border-white px-4 py-3 font-[800] uppercase bg-black text-white transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
