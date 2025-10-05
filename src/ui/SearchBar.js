import React from "react";

export default function SearchBar({
  search,
  setSearch,
  isMobile,
  searchInputRef,
}) {
  return isMobile ? (
    <div className="flex-1 relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search offers…"
        className="w-full bg-black text-white placeholder-white/40  px-3 py-[6px] pr-10 focus:outline-none appearance-none"
        ref={searchInputRef}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors"
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  ) : (
    <div className={`flex items-center gap-3 px-4 pt-4 relative`}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search offers…"
        className="w-full bg-black text-white placeholder-white/40 border border-white/30 focus:border-white px-3 py-1 pr-10 focus:outline-none appearance-none"
        ref={searchInputRef}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 text-white hover:text-white/70 transition-colors"
          aria-label="Clear search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
