import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState, Category } from '../types';
import { ALL_BRANDS, ALL_SIZES } from '../data/product';
import { useLang } from '../context/LanguageContext';

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  selectedCategory: Category;
  setSelectedCategory?: (category: Category) => void;
  totalResults: number;
}

export default function FilterBar({
  filters,
  setFilters,
  selectedCategory,
  totalResults,
}: FilterBarProps) {
  const { t } = useLang();
  const [isExpanded, setIsExpanded] = useState(false);

  const isFiltered =
    filters.brand !== 'All' ||
    filters.maxPrice < 250 ||
    filters.size !== 'All' ||
    filters.sortBy !== 'featured' ||
    (!!filters.department && filters.department !== 'all');

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      brand: 'All',
      maxPrice: 250,
      size: 'All',
      sortBy: 'featured',
      department: 'all',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters((prev) => ({ ...prev, brand }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }));
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({ ...prev, size: prev.size === size ? 'All' : size }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-7 px-3 sm:px-4" id="filter-bar-container">
      {/* Search Input and Filter Toggle Icon Row */}
      <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch mb-3">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#8a7f72] group-focus-within:text-volt transition-colors">
            <Search className="w-4 h-4 stroke-[1.8]" />
          </div>
          <input
            type="search"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={t.fb_search_placeholder}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc border border-white/10 rounded-xl hover:border-white/20 focus:border-volt/50 focus:ring-4 focus:ring-volt/10 outline-none text-sm transition-all placeholder:text-ash text-bone font-medium"
            id="product-search-input"
            aria-label={t.fb_search_placeholder}
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-3.5 flex items-center text-[#8a7f72] hover:text-[#f0e6cc]"
              id="clear-search-btn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle and Sort Trigger Row */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition-all text-xs font-semibold select-none cursor-pointer ${
              isExpanded || isFiltered
                ? 'bg-volt/10 border-volt/35 text-volt hover:bg-volt/20'
                : 'bg-[#221407] border-white/10 text-[#f0e6cc] hover:bg-white/[0.06] hover:border-white/20'
            }`}
            id="filter-toggle-btn"
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            <span>{t.fb_filters}</span>
            {isFiltered && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-volt animate-pulse" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-zinc border border-white/10 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 pr-8 text-xs font-semibold text-bone hover:border-white/20 focus:border-volt/50 focus:ring-4 focus:ring-volt/10 outline-none transition-all cursor-pointer w-full"
                id="product-sort-select"
                aria-label="Sort products"
              >
                <option value="featured" className="bg-zinc text-bone">{t.fb_sort_featured}</option>
                <option value="price-low-to-high" className="bg-zinc text-bone">{t.fb_sort_price_asc}</option>
                <option value="price-high-to-low" className="bg-zinc text-bone">{t.fb_sort_price_desc}</option>
                <option value="rating" className="bg-zinc text-bone">{t.fb_sort_rating}</option>
              </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8a7f72]">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden mb-5"
            id="collapsible-filter-panel"
          >
            <div className="p-3 sm:p-5 bg-zinc border border-white/10 rounded-2xl shadow-lg mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Brand Filter */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">{t.fb_brand}</span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                <button
                  onClick={() => handleBrandChange('All')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    filters.brand === 'All'
                      ? 'bg-volt border-volt text-ink font-bold shadow-xs'
                      : 'bg-white/[0.04] border-white/10 text-bone hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                  id="brand-filter-all"
                >
                  {t.fb_all_brands}
                </button>
                {ALL_BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleBrandChange(b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      filters.brand === b
                        ? 'bg-volt border-volt text-ink font-bold shadow-xs'
                        : 'bg-white/[0.04] border-white/10 text-bone hover:border-white/20 hover:bg-white/[0.08]'
                    }`}
                    id={`brand-filter-${b.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">{t.fb_max_price}</span>
                  <span className="text-xs font-bold text-volt bg-volt/10 px-2 py-0.5 rounded-lg font-mono">
                    ${filters.maxPrice}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  <input
                    type="range"
                    min="10"
                    max="250"
                    step="5"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-volt"
                    id="price-range-slider"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#8a7f72] px-1 font-mono">
                    <span>Min: $10</span>
                    <span>Max: $250+</span>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">{t.fb_size}</span>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        filters.size === size
                          ? 'bg-volt border-volt text-ink hover:bg-bone'
                          : 'bg-white/[0.04] border-white/10 text-bone hover:border-white/20 hover:bg-white/[0.08]'
                      }`}
                      id={`size-filter-${size}`}
                      aria-pressed={filters.size === size}
                      aria-label={`Size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary Drawer */}
            {isFiltered && (
              <div className="flex flex-wrap items-center justify-between mt-3 px-2 gap-3">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-ash">{t.fb_active_filters}</span>
                  {filters.department && filters.department !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-volt/10 text-volt border border-volt/20">
                      {t.fb_dept} {filters.department.charAt(0).toUpperCase() + filters.department.slice(1)}
                      <button
                        className="cursor-pointer text-volt/70 hover:text-volt"
                        onClick={() => setFilters((prev) => ({ ...prev, department: 'all' }))}
                        aria-label="Remove department filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.brand !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-bone border border-white/10">
                      {t.fb_brand_label} {filters.brand}
                      <button
                        className="cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleBrandChange('All')}
                        aria-label="Remove brand filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.maxPrice < 250 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-bone border border-white/10">
                      {t.fb_under}{filters.maxPrice}
                      <button
                        className="cursor-pointer text-ash hover:text-bone"
                        onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 250 }))}
                        aria-label="Remove price filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.size !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-bone border border-white/10">
                      {t.fb_size_label} {filters.size}
                      <button
                        className="cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleSizeChange(filters.size)}
                        aria-label="Remove size filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.sortBy !== 'featured' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.06] text-bone border border-white/10">
                      {t.fb_sorted}
                      <button
                        className="cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleSortChange('featured')}
                        aria-label="Remove sort filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:underline cursor-pointer tap-target"
                  id="reset-all-filters-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.fb_reset}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs font-bold text-[#8a7f72] tracking-wider uppercase px-2 mb-1.5 flex-wrap gap-2">
        <span>{t.fb_category} {selectedCategory === 'all' ? t.fb_all_products : selectedCategory}</span>
        <span>{t.fb_showing} {totalResults} {totalResults === 1 ? t.fb_product : t.fb_products}</span>
      </div>
    </div>
  );
}
