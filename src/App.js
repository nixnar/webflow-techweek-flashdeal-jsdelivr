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
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState(false);
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-open filters on desktop, collapse on mobile
  React.useEffect(() => {
    setFiltersOpen(!isMobile);
  }, [isMobile]);

  // When triggering search mode, ensure filters are open on mobile and focus input
  React.useEffect(() => {
    if (!searchMode) return;
    if (isMobile) setFiltersOpen(true);
    try {
      searchInputRef.current?.focus();
    } catch {}
    setSearchMode(false);
  }, [searchMode, isMobile]);

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
      <div className="flex w-full justify-center text-white">
        <div className="max-w-[1400px] grow flex flex-col gap-4">
          <div className="border-[1px] border-white p-[4px] bg-black h-fit">
            <div className={`flex w-full p-4 sticky top-0 bg-black`}>
              <div
                className={`w-full flex flex-col ${
                  isMobile ? "gap-2" : "gap-4"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[2rem] font-[700] uppercase leading-none">
                    OFFERS
                  </p>
                  {isMobile ? (
                    <button
                      onClick={() => {
                        setSearchMode(false);
                        setFiltersOpen((v) => !v);
                      }}
                      className="uppercase font-medium text-[0.875rem] flex items-center gap-[0.375rem] py-[0.375rem] px-[0.5rem] bg-white text-black"
                      aria-label="Toggle filters"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.625 1.75V3.47949C2.625 3.91016 2.83691 4.31348 3.19238 4.55957L6.125 6.78125V12.25L7.875 10.5V6.78125L10.8076 4.55957C11.1631 4.31348 11.375 3.91016 11.375 3.47949V1.75H2.625ZM3.5 2.625H10.5V3.47949C10.5 3.62305 10.4282 3.75635 10.3086 3.83838L10.3018 3.8418L7.29053 6.125H6.70947L3.69824 3.8418L3.69141 3.83838C3.57178 3.75635 3.5 3.62305 3.5 3.47949V2.625Z"
                          fill="black"
                        />
                      </svg>
                      <p>FILTERS</p>
                    </button>
                  ) : null}
                </div>

                {!isMobile || filtersOpen ? (
                  <>
                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search offers…"
                        className={`w-full bg-black text-white placeholder-white/40 border border-white ${
                          isMobile ? "px-3 py-1" : "px-6 py-3"
                        } focus:outline-none`}
                        ref={searchInputRef}
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
                            className="tw-filter-checkbox h-4 w-4"
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
                  </>
                ) : isMobile ? (
                  <div className="text-white/60 text-[0.9rem]">
                    {selectedServices.size > 0
                      ? `${selectedServices.size} selected`
                      : ""}
                  </div>
                ) : null}
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
