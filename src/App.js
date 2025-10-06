import React from "react";
import "./style.css";
import OfferGrid from "./ui/OfferGrid";
import OfferModal from "./ui/OfferModal";
import EmailModal from "./ui/EmailModal";
import BrowseHeader from "./ui/BrowseHeader";
import CategoriesSection from "./ui/CategoriesSection";
import SpeedrunSection from "./ui/SpeedrunSection";

async function fetchOffersWithFallback() {
  const speedrunIds = new Set([
    50021443, 50021447, 50021428, 50021437, 50021438, 50021435, 50021429,
  ]);

  try {
    const res = await fetch("https://api.tech-week.com/get_proven/");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    // API shape already matches example. Normalize just in case
    return (data.offers || []).map((o) => {
      const vendor = o.vendor || {};
      // Add A16z Speedrun Portfolio service to specific offers
      if (speedrunIds.has(o.vendor_id)) {
        const services = vendor.services || [];
        return {
          ...o,
          vendor: {
            ...vendor,
            services: [...services, { name: "A16z Speedrun Portfolio" }],
          },
        };
      }
      return { ...o, vendor };
    });
  } catch (err) {
    try {
      const local = await fetch("/apiresponse.json");
      const data = await local.json();
      return (data.offers || []).map((o) => {
        const vendor = o.vendor || {};
        // Add A16z Speedrun Portfolio service to specific offers
        if (speedrunIds.has(o.id)) {
          const services = vendor.services || [];
          return {
            ...o,
            vendor: {
              ...vendor,
              services: [...services, { name: "A16z Speedrun Portfolio" }],
            },
          };
        }
        return { ...o, vendor };
      });
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
  const [selectedCategories, setSelectedCategories] = React.useState(new Set());
  const [activeOffer, setActiveOffer] = React.useState(null);
  const [hasOfferEmail, setHasOfferEmail] = React.useState(false);
  const [emailModalOpen, setEmailModalOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const searchInputRef = React.useRef(null);
  const resultsRef = React.useRef(null);
  const hasUserInteracted = React.useRef(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to scroll to results
  const scrollToResults = React.useCallback(() => {
    if (resultsRef.current && !isLoading) {
      const element = resultsRef.current;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - (isMobile ? 84 : 50); // Account for sticky header + some padding

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [isLoading]);

  // Scroll to results whenever search or filters change (only after user interaction)
  React.useEffect(() => {
    if (hasUserInteracted.current) {
      scrollToResults();
    }
  }, [search, selectedCategories, scrollToResults]);

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

  const categories = React.useMemo(() => {
    const names = new Set();
    for (const offer of offers) {
      const arr = offer.vendor?.services || [];
      for (const s of arr) {
        if (s?.name) names.add(s.name);
      }
    }
    return Array.from(names).sort();
  }, [offers]);

  // Calculate offer counts for each category based on search query
  const categoryCounts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const counts = new Map();

    // Initialize all categories with 0
    categories.forEach((name) => counts.set(name, 0));

    // Count matching offers for each category
    for (const offer of offers) {
      let matchesSearch = true;
      if (query) {
        const text = `${offer.name || ""} ${(offer.description || "").replace(
          /<[^>]*>/g,
          " "
        )}`.toLowerCase();
        matchesSearch = text.includes(query);
      }

      if (matchesSearch) {
        const vendorCategories = (offer.vendor?.services || []).map(
          (s) => s?.name
        );
        vendorCategories.forEach((name) => {
          if (name && counts.has(name)) {
            counts.set(name, counts.get(name) + 1);
          }
        });
      }
    }

    return counts;
  }, [offers, search, categories]);

  const filteredOffers = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const hasCategoryFilter = selectedCategories.size > 0;
    return offers.filter((o) => {
      let ok = true;
      if (hasCategoryFilter) {
        const vendorCategories = (o.vendor?.services || []).map((s) => s?.name);
        ok = vendorCategories.some((n) => selectedCategories.has(n));
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
  }, [offers, search, selectedCategories]);

  const toggleCategory = React.useCallback((name) => {
    hasUserInteracted.current = true;
    setSelectedCategories((prev) => {
      // Single select: if already selected, deselect it, otherwise select only this one
      if (prev.has(name)) {
        return new Set(); // Deselect
      } else {
        return new Set([name]); // Select only this one
      }
    });
  }, []);

  const handleSearchChange = React.useCallback((value) => {
    hasUserInteracted.current = true;
    setSearch(value);
  }, []);

  const handleFilterToggle = React.useCallback(() => {
    hasUserInteracted.current = true;
    // Small delay to allow the filter drawer to render before scrolling
    setTimeout(() => {
      scrollToResults();
    }, 100);
  }, [scrollToResults]);

  const clearFilters = React.useCallback(() => {
    setSelectedCategories(new Set());
    setSearch("");
  }, []);

  return (
    <div className="tailwind">
      <div className="flex w-full justify-center text-white bg-black min-h-screen border-[1px] border-white max-w-[87.5rem] mx-auto">
        <div
          className={`max-w-[1400px] w-full ${
            isMobile ? "px-3 py-4 pt-0" : "px-6 pb-8"
          }`}
        >
          <BrowseHeader
            search={search}
            setSearch={handleSearchChange}
            searchInputRef={searchInputRef}
            isMobile={isMobile}
            categories={categories}
            categoryCounts={categoryCounts}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            onFilterToggle={handleFilterToggle}
          />
          <div className="">
            <SpeedrunSection
              offers={offers}
              onRedeem={handleRedeem}
              isMobile={isMobile}
            />
            <div ref={resultsRef}>
              <CategoriesSection
                categories={categories}
                categoryCounts={categoryCounts}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                isMobile={isMobile}
              />
            </div>

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
  );
};

export default App;
