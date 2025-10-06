import React from "react";
import CategoryCard from "./CategoryCard";

export default function BrowseHeader({
  search,
  setSearch,
  searchInputRef,
  isMobile,
  categories,
  categoryCounts,
  selectedCategories,
  toggleCategory,
  onFilterToggle,
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const headerRef = React.useRef(null);

  // Lock body scroll when filters open
  React.useEffect(() => {
    if (filtersOpen && isMobile) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock body scroll
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen, isMobile]);

  const handleFilterToggle = () => {
    const newState = !filtersOpen;
    setFiltersOpen(newState);
    // Notify parent to scroll to results
    if (newState && onFilterToggle) {
      onFilterToggle();
    }
  };

  const handleCategoryClick = (name) => {
    toggleCategory(name);
    // Auto-dismiss filters after selection
    setFiltersOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {isMobile && filtersOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-10"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      <div
        ref={headerRef}
        className={`sticky top-0 z-20 bg-black ${isMobile ? "pb-4" : "pb-6"}`}
      >
        <div
          className={`${isMobile ? "pt-4" : "pt-6"} flex items-center ${
            isMobile ? "justify-between" : "justify-between"
          } gap-3`}
        >
          {!isMobile && (
            <div className="text-white text-[1.75rem] font-[700] uppercase">
              Browse Offers
            </div>
          )}
          <div
            className={`flex items-center ${
              isMobile ? "w-full" : "flex-1 max-w-[26rem]"
            }`}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Offers..."
              className="flex-1 appearance-none text-[0.875rem] font-500 leading-[1.25] tracking-[-0.02188rem] text-white placeholder-white/60 border-[1px] border-[#979797] bg-[#2d2d2d] px-4 py-2 focus:outline-none focus:border-white transition-colors"
              ref={searchInputRef}
            />
            {isMobile && (
              <button
                onClick={handleFilterToggle}
                className="flex appearance-none items-center justify-center gap-2 px-3 py-2 bg-white text-black text-[0.75rem] font-[700] uppercase tracking-wide whitespace-nowrap flex-shrink-0 border-solid border-[1px] border-white"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="flex-shrink-0"
                >
                  <rect
                    y="0.5"
                    width="16"
                    height="16"
                    fill="url(#pattern0_1202_135543)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_1202_135543"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        xlinkHref="#image0_1202_135543"
                        transform="scale(0.01)"
                      />
                    </pattern>
                    <image
                      id="image0_1202_135543"
                      width="100"
                      height="100"
                      preserveAspectRatio="none"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADMklEQVR4nO2cQYjMURzHP3ZQaJISNcqJA3HYPUi2Ngcue1hu7k6U7G6UcHk3q5zMiVxcnKRk5SBXDoTDJEVRxEVtUqvZMHr1V5us3n935v1/7/2/n3q37f//vf+nmfnM7PwHhBBCCCGEEEIIIYTIn7XAEeCcFovXBLAmtoydwGugp8W/1itgR8xHhmQQJCXKI+Wogc32Eln+6WvgXDCw0V4i63wMIc7ARnuJLH+tJAQ7S0KwtUwImQee1WTNpyCkQ33oSIgtkhDyGWiSP81ir+aF+PUAWE2+NIC7Vl7UTwYWxnXypR14DU7EGGYv8CtwoEnyYzJw7z+BPbGGuhE41I9Yn+dEYqLYU8je/TWKxjrgSeBgvtX3kT7DwLfAPfv3KBtiD7gZeBs44CdgO+nSAj4E7vUdsLWqQXcBc4GD+mbfSJp5+zJwj1+L19hKOQh0AwdOLYcbgXnr1wJwGCMcDxw6tRxul9iXfztgisslhk8hh6dK7GcGg6wCbpVodP+vYKuMl8jb28AQRvE5/DjxHB4ukbdPq8jbOuVwK5W8rUMON1PL25xzuJFq3uaaw+2U83aQOTxVwXzTqedtTjk8nkve5pDDIyXzdj2Z4XP4jZEcbuWatynmcDP3vE0phxt1ydtUcrhd4rxRvqBgiZnIOTxd4nyXqCExc3i8rnlrMYdH6p63lnK4pbxdHrtL5PDzwJsp/d+8CDzmXDGDWMShIjVDLuCpgOOdDjzWQnFusYIcvh9wLP8eRnkbKYc7fbh3I5tPbwfNEDAbQchsnfO2iru0Ohbu3cgFJyG2cBJiCychtnASYgsnIbZwEmILJyG2cBJiCychtnASYgsnIbZwEmILJyG2cBJiCychtnASYgsnIbZwEmILJyFpCflYfCvxf0hI5B/a7ALXgG1LHENCKvo58+4SYiSkj5wpIeTP+g5cXfRUJiF9ZGwZQv4W815C+svDFUgJWRJSkk3AHQmxxyhwT0LyF+Oq3lAujPZJjIQYE+Oq3kDOifxoGUIuVj147oyVFHOs6oHrwliAGH97de3vR7ci5gtwoOrh6sx+4ApwEzgLbKl6ICGEEEIIIYTAEL8BOfiXXcVozjAAAAAASUVORK5CYII="
                    />
                  </defs>
                </svg>
                FILTERS
              </button>
            )}
          </div>
        </div>

        {/* Mobile filters dropdown */}
        {isMobile && filtersOpen && (
          <div className="pt-4 pb-2 relative z-30">
            <div className="text-white text-[1rem] font-[700] uppercase pb-3">
              Filter by Category
            </div>
            <div className="flex flex-col gap-3">
              {categories.map((name) => {
                const count = categoryCounts.get(name) || 0;
                return (
                  <CategoryCard
                    key={name}
                    name={name}
                    count={count}
                    isSelected={selectedCategories.has(name)}
                    onClick={() => handleCategoryClick(name)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
