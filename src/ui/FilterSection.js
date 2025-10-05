import React from "react";
import SearchBar from "./SearchBar";

export default function FilterSection({
  search,
  setSearch,
  services,
  serviceCounts,
  selectedServices,
  toggleService,
  filtersOpen,
  setFiltersOpen,
  isMobile,
  setSearchMode,
  searchInputRef,
  clearFilters,
}) {
  return (
    <div
      className={`flex w-full ${
        isMobile ? "pt-2" : ""
      } sticky top-0 bg-black z-10`}
    >
      <div
        className={`w-full flex flex-col ${
          isMobile ? "gap-2" : "gap-2 border-[1px] border-white/30 mx-4 mt-4"
        }`}
      >
        {isMobile ? (
          <div className="flex items-center gap-2 border-[1px] mx-2 border-white/30 p-1 z-[9999] bg-black">
            <SearchBar
              search={search}
              setSearch={setSearch}
              isMobile={isMobile}
              searchInputRef={searchInputRef}
            />
            <button
              onClick={() => {
                setSearchMode(false);
                setFiltersOpen((v) => !v);
              }}
              className="uppercase font-medium text-[0.875rem] flex items-center gap-[0.375rem] py-[0.375rem] px-[0.5rem] bg-white text-black whitespace-nowrap"
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
          </div>
        ) : (
          <SearchBar
            search={search}
            setSearch={setSearch}
            isMobile={isMobile}
            searchInputRef={searchInputRef}
          />
        )}

        {!isMobile || filtersOpen ? (
          <div
            className={`flex flex-wrap items-center px-4 pt-1 pb-2 border-b-[1px] border-white ${
              isMobile ? "gap-x-3 gap-y-1" : "gap-x-6 gap-y-2 border-white/30"
            }`}
          >
            {services.map((name) => {
              const count = serviceCounts.get(name) || 0;
              return (
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
                    {name} ({count})
                  </span>
                </label>
              );
            })}
          </div>
        ) : isMobile ? (
          <div className="flex items-center gap-3 text-[0.9rem]">
            {selectedServices.size > 0 && (
              <div className="pb-2">
                <span className="text-white/60">
                  {selectedServices.size} filter(s) selected
                </span>
                <button
                  onClick={clearFilters}
                  className="text-white underline hover:text-white/70 transition-colors ml-2"
                >
                  clear
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
