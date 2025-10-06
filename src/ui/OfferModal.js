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
  const descriptionHtml = offer.description;
  const redeemHtml = offer.redeem_steps;
  const [agree, setAgree] = React.useState(false);
  const [agreeError, setAgreeError] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSteps, setShowSteps] = React.useState(false);
  const [tocOpen, setTocOpen] = React.useState(false);

  const termsText = (offer.terms_and_conditions_text || "").trim();
  const termsLink = (offer.terms_and_conditions || "").trim();
  const hasTermsText = termsText.length > 0;
  const hasTermsLink = termsLink.length > 0;
  const hasTerms = hasTermsText || hasTermsLink;

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
        vendor_name: vendor.name,
        offer_name: offer.name,
        time_created: new Date().toISOString(),
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

      // Track successful redeem in GA4
      if (typeof window !== "undefined" && window.gtag) {
        const eventData = {
          event_category: "conversion",
          event_label: `${vendor.name || "Unknown"} - ${offer.name}`,
          offer_id: offer.id,
          vendor_name: vendor.name || "Unknown",
          offer_name: offer.name,
          value: 1,
        };
        window.gtag("event", "redeem_success_secondary_click", eventData);
        // console.log(
        //   "✅ GA4 Event Tracked: redeem_success_secondary_click",
        //   eventData
        // );
      } // else {
      // console.log("⚠️ GA4 not available (gtag not found)");
      // }

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
                  <Section
                    title="Steps to Redeem"
                    className="flex flex-col gap-4"
                  >
                    {redeemHtml ? (
                      <div
                        className={`prose prose-invert max-w-none tw-steps`}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(redeemHtml),
                        }}
                      />
                    ) : (
                      <p className="text-white/70">
                        This offer did not provide steps to redeem.
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
                    className="tw-filter-checkbox h-4 w-4 self-center"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label
                    htmlFor="wish-checkbox"
                    className="text-white/80 translate-y-[0.2rem]"
                  >
                    {hasTerms ? (
                      <div className="translate-x-[-0.25rem]">
                        I wish to redeem the offer and I agree to the{" "}
                        {hasTermsLink ? (
                          <a
                            href={termsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white"
                          >
                            Terms and Conditions
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="underline hover:text-white"
                            onClick={() => setTocOpen(true)}
                          >
                            Terms and Conditions
                          </button>
                        )}
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
          <div className="relative w-[min(900px,95vw)] text-white bg-black">
            <div className="border border-white p-[4px] bg-black">
              <div className="border border-white max-h-[80vh] overflow-y-auto bg-black">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 mb-4 bg-black border-b-2 border-white p-4">
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
                  className="prose prose-invert max-w-none px-4 pb-4"
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
