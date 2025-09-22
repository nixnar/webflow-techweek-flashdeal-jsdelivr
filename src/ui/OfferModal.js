import React from "react";
import { sanitizeHtml, splitDescription } from "../utils/format";

// Simple modal without email requirement or side effects
export default function OfferModal({
  offer,
  open,
  onClose,
  onRequireEmail,
  isMobile,
}) {
  if (!open || !offer) return null;

  const vendor = offer.vendor || {};
  const { descriptionHtml, redeemHtml } = splitDescription(
    offer.description || ""
  );
  const [agree, setAgree] = React.useState(false);
  const [agreeError, setAgreeError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSteps, setShowSteps] = React.useState(false);
  const [tocOpen, setTocOpen] = React.useState(false);

  const termsText = (offer.terms_and_conditions_text || "").trim();
  const hasTerms = termsText.length > 0;

  React.useEffect(() => {
    if (!open) {
      setShowSteps(false);
      setAgree(false);
      setAgreeError("");
      setSubmitError("");
      setIsSubmitting(false);
      setTocOpen(false);
    }
  }, [open]);

  async function handleRedeemClick() {
    if (!agree) {
      setAgreeError("Please check the box to continue.");
      return;
    }
    setAgreeError("");
    setSubmitError("");

    try {
      const email = (() => {
        try {
          return window.localStorage.getItem("offerEmail") || "";
        } catch {
          return "";
        }
      })();

      if (!email) {
        onRequireEmail?.();
        return;
      }

      setIsSubmitting(true);

      const payload = {
        email,
        vendor_id: offer.vendor_id,
        offer_id: offer.id,
      };

      const res = await fetch("https://api.tech-week.com/redeem_offer/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "";
        try {
          message = await res.text();
        } catch {}
        throw new Error(message || "Failed to redeem offer");
      }

      setShowSteps(true);
    } catch (err) {
      setSubmitError("Unable to redeem right now. Please try again.");
      // Optional: console for diagnostics
      // eslint-disable-next-line no-console
      console.error("redeem_offer failed", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 p-4 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-[min(1100px,95vw)] text-white`}>
        <div className="border border-white p-[4px] bg-black">
          <div
            className={`border border-white p-4 flex flex-col max-h-[85vh] ${
              isMobile ? "max-h-[80vh]" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4 flex-none">
              <div className="flex items-center gap-4">
                {/*<div className="w-[108px] h-[108px] max-h-[108px] bg-white p-3 flex items-center justify-center overflow-hidden">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                </div>*/}
                <div>
                  <h2 className="text-[2rem] font-[800] leading-tight">
                    {vendor.name || offer.name}
                  </h2>
                  {vendor.name ? (
                    <p className="text-white/60 text-[0.95rem]">{offer.name}</p>
                  ) : null}
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={onClose}
                className="text-white hover:text-white/70 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-2">
              {showSteps ? (
                <div>
                  <Section title="Steps to Redeem">
                    {redeemHtml ? (
                      <div
                        className="prose prose-invert max-w-none tw-steps"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(redeemHtml),
                        }}
                      />
                    ) : (
                      <p className="text-white/70">
                        Follow the partner link to redeem this offer.
                      </p>
                    )}
                  </Section>
                </div>
              ) : (
                <div className="flex gap-8">
                  <div>
                    <Section title="About this offer">
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(descriptionHtml),
                        }}
                      />
                    </Section>
                  </div>
                </div>
              )}
            </div>

            {!showSteps ? (
              <div className="flex-none mt-[0.75rem]">
                <div className="flex items-center gap-3">
                  <input
                    id="wish-checkbox"
                    type="checkbox"
                    className="accent-white h-4 w-4 self-center"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label
                    htmlFor="wish-checkbox"
                    className="text-white/80 translate-y-[0.2rem]"
                  >
                    {hasTerms ? (
                      <div className="translate-x-[-0.25rem]" o>
                        I wish to redeem the offer and I agree to the{" "}
                        <button
                          type="button"
                          className="underline hover:text-white"
                          onClick={() => setTocOpen(true)}
                        >
                          Terms and Conditions
                        </button>
                      </div>
                    ) : (
                      "I wish to redeem the offer"
                    )}
                  </label>
                </div>
                {agreeError ? (
                  <p className="text-red-500 text-[0.95rem] mt-2">
                    {agreeError}
                  </p>
                ) : null}
                {submitError ? (
                  <p className="text-red-500 text-[0.95rem] mt-2">
                    {submitError}
                  </p>
                ) : null}
                <div className="mt-4">
                  <button
                    className="self-start text-[1rem] whitespace-nowrap border tracking-[0.05rem] border-white px-3 py-[10px] uppercase font-[600] leading-[1.25] bg-white text-black hover:bg-[#00e1ff] transition-colors"
                    onClick={handleRedeemClick}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Redeeming…" : "Redeem Now"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {tocOpen ? (
        <div
          className="fixed inset-0 p-4 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setTocOpen(false)}
          />
          <div className="relative w-[min(900px,95vw)] text-white">
            <div className="border border-white p-[4px] bg-black">
              <div className="border border-white p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-[1.5rem] font-[800]">
                    Terms and Conditions
                  </h3>
                  <button
                    aria-label="Close Terms"
                    onClick={() => setTocOpen(false)}
                    className="text-white hover:text-white/70 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(termsText) }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      {/*className="border border-white p-[4px] bg-black"*/}
      <div>
        {/*className="border border-white p-4"*/}
        <h3 className="text-[1.25rem] font-[800] mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}
