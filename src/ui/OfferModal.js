import React from "react";
import { sanitizeHtml, splitDescription } from "../utils/format";

// Simple modal without email requirement or side effects
export default function OfferModal({ offer, open, onClose }) {
  if (!open || !offer) return null;

  const vendor = offer.vendor || {};
  const { descriptionHtml, redeemHtml } = splitDescription(offer.description || "");
  const [agree, setAgree] = React.useState(false);
  const [agreeError, setAgreeError] = React.useState("");

  function handleRedeemClick() {
    if (!agree) {
      setAgreeError("Please check the box to continue.");
      return;
    }
    setAgreeError("");
    if (offer.getproven_link && typeof window !== "undefined") {
      window.open(offer.getproven_link, "_blank", "noopener");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-[min(1100px,95vw)] max-h-[90vh] overflow-auto text-white">
        <div className="border border-white p-[4px] bg-black">
          <div className="border border-white p-6">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-[108px] h-[108px] bg-white p-3 flex items-center justify-center overflow-hidden">
                  {vendor.logo ? (
                    <img src={vendor.logo} alt={vendor.name} className="max-h-full max-w-full object-contain" />
                  ) : null}
                </div>
                <div>
                  <h2 className="text-[2rem] font-[800] leading-tight">{vendor.name || offer.name}</h2>
                  {vendor.name ? (
                    <p className="text-white/60 text-[0.95rem]">{offer.name}</p>
                  ) : null}
                </div>
              </div>
              <button aria-label="Close" onClick={onClose} className="text-white hover:text-white/70 text-2xl">✕</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Section title="About this offer">
                  <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml) }} />
                </Section>
              </div>
              <div>
                <Section title="Steps to Redeem">
                  {redeemHtml ? (
                    <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(redeemHtml) }} />
                  ) : (
                    <p className="text-white/70">Follow the partner link to redeem this offer.</p>
                  )}
                </Section>
                <div className="mt-6 flex items-center gap-3">
                  <input id="wish-checkbox" type="checkbox" className="accent-white h-4 w-4" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <label htmlFor="wish-checkbox" className="text-white/80">I wish to redeem the offer</label>
                </div>
                {agreeError ? (<p className="text-red-500 text-[0.95rem] mt-2">{agreeError}</p>) : null}
                <div className="mt-4">
                  <button
                    className="inline-block border border-white px-5 py-3 font-[800] uppercase bg-white text-black hover:bg-black hover:text-white transition-colors"
                    onClick={handleRedeemClick}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-white p-[4px] bg-black">
      <div className="border border-white p-4">
        <h3 className="text-[1.25rem] font-[800] mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}


