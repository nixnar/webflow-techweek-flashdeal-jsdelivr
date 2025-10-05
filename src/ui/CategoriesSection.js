import React from "react";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection({
  categories,
  categoryCounts,
  selectedCategories,
  toggleCategory,
}) {
  return (
    <div className="pb-6">
      <div className="text-white text-[1.375rem] font-[700] uppercase pb-6">
        Explore Curated Categories
      </div>
      <div className="flex gap-4 flex-wrap lg:flex-nowrap">
        {categories.map((name) => {
          const count = categoryCounts.get(name) || 0;
          return (
            <CategoryCard
              key={name}
              name={name}
              count={count}
              isSelected={selectedCategories.has(name)}
              onClick={() => toggleCategory(name)}
            />
          );
        })}
      </div>
    </div>
  );
}
