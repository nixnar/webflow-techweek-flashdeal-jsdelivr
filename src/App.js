import React from "react";
import "./style.css";
import OfferGrid from "./ui/OfferGrid";
import OfferModal from "./ui/OfferModal";
import EmailModal from "./ui/EmailModal";

async function fetchOffersWithFallback() {
  try {
    const res = await fetch("https://api.tech-week.com/get_proven/");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    // API shape already matches example. Normalize just in case
    return (data.offers || []).map((o) => ({ ...o, vendor: o.vendor || {} }));
  } catch (err) {
    try {
      const local = await fetch("/apiresponse.json");
      const data = await local.json();
      return (data.offers || []).map((o) => ({ ...o, vendor: o.vendor || {} }));
    } catch (e) {
      console.error("Failed to load offers", err, e);
      return [];
    }
  }
}

const App = () => {
  const [offers, setOffers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedServices, setSelectedServices] = React.useState(new Set());
  const [activeOffer, setActiveOffer] = React.useState(null);
  const [hasOfferEmail, setHasOfferEmail] = React.useState(false);
  const [emailModalOpen, setEmailModalOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await fetchOffersWithFallback();
      if (!cancelled) {
        setOffers(list);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem("offerEmail");
      setHasOfferEmail(Boolean(stored));
    } catch {}
  }, []);

  // Lock page scroll when any modal is open
  const isAnyModalOpen = Boolean(activeOffer) || emailModalOpen;
  React.useEffect(() => {
    if (!isAnyModalOpen) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [isAnyModalOpen]);

  const handleRedeem = React.useCallback(
    (offer) => {
      // Placeholder: integrate Webflow modal or external click handler
      const combined = `${offer.id}-${offer.vendor?.name || "Vendor"}-${
        offer.name
      }`;
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "click", {
          event_category: "button",
          event_label: "redeem_offer_click",
          event_value: combined,
          redeem_offer_click: combined,
        });
      }
      if (!hasOfferEmail) {
        setActiveOffer(offer);
        setEmailModalOpen(true);
        return;
      }
      setActiveOffer(offer);
    },
    [hasOfferEmail]
  );

  const services = React.useMemo(() => {
    const names = new Set();
    for (const offer of offers) {
      const arr = offer.vendor?.services || [];
      for (const s of arr) {
        if (s?.name) names.add(s.name);
      }
    }
    return Array.from(names).sort();
  }, [offers]);

  const filteredOffers = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const hasServiceFilter = selectedServices.size > 0;
    return offers.filter((o) => {
      let ok = true;
      if (hasServiceFilter) {
        const vendorServices = (o.vendor?.services || []).map((s) => s?.name);
        ok = vendorServices.some((n) => selectedServices.has(n));
      }
      if (!ok) return false;
      if (query) {
        const text = `${o.name || ""} ${(o.description || "").replace(
          /<[^>]*>/g,
          " "
        )}`.toLowerCase();
        return text.includes(query);
      }
      return true;
    });
  }, [offers, search, selectedServices]);

  const toggleService = React.useCallback((name) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  return (
    <div className="tailwind">
      <div className="flex w-full justify-center text-white select-none">
        <div className="max-w-[1400px] grow flex flex-col gap-4">
          <div className="border-[1px] border-white p-[4px] bg-black h-fit">
            <div className={`flex w-full p-4 sticky top-0 bg-black`}>
              <div
                className={`w-full flex flex-col ${
                  isMobile ? "gap-2" : "gap-4"
                }`}
              >
                <p className="text-[2rem] font-[700] uppercase leading-none">
                  FILTERS
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search offers…"
                    className={`w-full bg-black text-white placeholder-white/40 border border-white ${
                      isMobile ? "px-3 py-1" : "px-6 py-3"
                    } focus:outline-none`}
                  />
                </div>
                <div
                  className={`flex flex-wrap items-center pt-1 ${
                    isMobile ? "gap-x-3 gap-y-1" : "gap-x-6 gap-y-2"
                  }`}
                >
                  {services.map((name) => (
                    <label
                      key={name}
                      className={`flex items-center gap-2 ${
                        isMobile && "gap-1"
                      } cursor-pointer text-white font-[600]`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.has(name)}
                        onChange={() => toggleService(name)}
                        className="accent-white h-4 w-4"
                      />
                      <span
                        className={`text-[0.95rem] ${
                          isMobile ? "text-[0.75rem]" : ""
                        }`}
                      >
                        {name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 pt-0">
              {isLoading ? (
                <p className="text-center py-12">Loading offers…</p>
              ) : filteredOffers.length > 0 ? (
                <OfferGrid
                  offers={filteredOffers}
                  onRedeem={handleRedeem}
                  isMobile={isMobile}
                />
              ) : (
                <div className="py-24 flex justify-center">
                  <p className="text-white/70 text-[1.1rem]">
                    No result fit the search filter
                  </p>
                </div>
              )}
            </div>
          </div>
          <OfferModal
            offer={activeOffer}
            open={!!activeOffer && !emailModalOpen}
            onClose={() => setActiveOffer(null)}
            onRequireEmail={() => setEmailModalOpen(true)}
            isMobile={isMobile}
          />
          <EmailModal
            open={emailModalOpen}
            onClose={() => {
              setEmailModalOpen(false);
              setActiveOffer(null);
            }}
            onSubmit={(email) => {
              try {
                window.localStorage.setItem("offerEmail", email);
              } catch {}
              setHasOfferEmail(true);
              setEmailModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
