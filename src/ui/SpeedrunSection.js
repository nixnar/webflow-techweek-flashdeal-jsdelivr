import React from "react";
import OfferCard from "./OfferCard";

export default function SpeedrunSection({ offers, onRedeem, isMobile }) {
  const scrollContainerRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Filter only A16z Speedrun Portfolio offers
  const speedrunOffers = React.useMemo(() => {
    return offers.filter((o) =>
      (o.vendor?.services || []).some(
        (s) => s?.name === "A16z Speedrun Portfolio"
      )
    );
  }, [offers]);

  // Card width + gap (22.5rem = 360px, gap = 16px = 1rem)
  const scrollDistance = isMobile ? 331 : 376; // 280px + 16px : 360px + 16px

  // Check scroll position and update arrow states
  const updateScrollButtons = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [speedrunOffers, updateScrollButtons]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    updateScrollButtons();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    updateScrollButtons();
  };

  const scrollToLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -scrollDistance,
      behavior: "smooth",
    });
  };

  const scrollToRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: scrollDistance,
      behavior: "smooth",
    });
  };

  if (speedrunOffers.length === 0) return null;

  return (
    <div className="w-full pb-8 pt-4">
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="text-[#ffebff] text-[1.375rem] font-[700] uppercase leading-[1]"
            style={{ textShadow: "0 0 12px #BA36BC" }}
          >
            A16z Speedrun Portfolio
          </div>
          {!isMobile && (
            <div className="text-[1.125rem] font-[700] opacity-70 py-[0.31rem] pl-2 pr-[0.56rem] bg-[#1a1916] border-[1px] border-[#606060]">
              {speedrunOffers.length}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={scrollToLeft}
            disabled={!canScrollLeft}
            className={`w-10 h-10 flex items-center justify-center border transition-colors bg-black ${
              canScrollLeft
                ? "border-white/30 hover:border-white cursor-pointer"
                : "border-white/10 cursor-not-allowed opacity-30"
            }`}
            aria-label="Scroll left"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={scrollToRight}
            disabled={!canScrollRight}
            className={`w-10 h-10 flex items-center justify-center border transition-colors bg-black ${
              canScrollRight
                ? "border-white/30 hover:border-white cursor-pointer"
                : "border-white/10 cursor-not-allowed opacity-30"
            }`}
            aria-label="Scroll right"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`flex gap-4 overflow-x-auto scrollbar-hide ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {speedrunOffers.map((offer) => (
          <div
            key={offer.id}
            className="flex-shrink-0"
            style={{ width: isMobile ? "19.75rem" : "22.5rem" }}
          >
            <OfferCard offer={offer} onRedeem={onRedeem} isMobile={isMobile} />
          </div>
        ))}
      </div>
    </div>
  );
}
