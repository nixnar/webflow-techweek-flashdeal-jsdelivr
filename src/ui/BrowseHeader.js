import React from "react";
import SearchBar from "./SearchBar";

export default function BrowseHeader({ search, setSearch, searchInputRef }) {
  return (
    <div className="flex items-center justify-between gap-6 mb-6">
      <div className="text-white text-[1.75rem] font-[700] uppercase">
        Browse Offers
      </div>
      <div className="flex-1 max-w-[26rem] relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Offers..."
          className="w-full bg-transparent text-white placeholder-white/60 border-[1px] border-white bg-[#2d2d2d] px-4 py-3 pr-12 focus:outline-none focus:border-white transition-colors"
          ref={searchInputRef}
        />
      </div>
    </div>
  );
}
