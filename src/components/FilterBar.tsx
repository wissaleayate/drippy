import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState, Category } from '../types';
import { ALL_BRANDS, ALL_SIZES } from '../data/product';

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
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if any secondary filters are active
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
    <div className="w-full max-w-5xl mx-auto mb-10 px-4" id="filter-bar-container">
      {/* Search Input and Filter Toggle Icon Row */}
      <div className="relative flex flex-col md:flex-row gap-4 items-stretch mb-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-ash group-focus-within:text-volt transition-colors">
            <Search className="w-5 h-5 stroke-[1.8]" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products by title, description or details..."
            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 focus:border-volt/50 focus:ring-4 focus:ring-volt/10 outline-none text-sm transition-all placeholder:text-ash/50 text-bone font-medium"
            id="product-search-input"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute inset-y-0 right-4 flex items-center text-ash hover:text-bone"
              id="clear-search-btn"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle and Sort Trigger Row */}
        <div className="flex gap-3">
          {/* Collapsible Filters Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all text-sm font-semibold select-none cursor-pointer ${
              isExpanded || isFiltered
                ? 'bg-volt/10 border-volt/35 text-volt hover:bg-volt/20'
                : 'bg-white/[0.02] border-white/5 text-bone hover:bg-white/[0.04] hover:border-white/10'
            }`}
            id="filter-toggle-btn"
          >
            <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            <span>Filters</span>
            {isFiltered && (
              <span className="flex h-2 w-2 rounded-full bg-volt animate-pulse" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-3.5 pr-10 text-sm font-semibold text-bone hover:border-white/10 focus:border-volt/50 focus:ring-4 focus:ring-volt/10 outline-none transition-all cursor-pointer w-full"
              id="product-sort-select"
            >
              <option value="featured" className="bg-zinc text-bone">Sort: Featured</option>
              <option value="price-low-to-high" className="bg-zinc text-bone">Price: Low to High</option>
              <option value="price-high-to-low" className="bg-zinc text-bone">Price: High to Low</option>
              <option value="rating" className="bg-zinc text-bone">Top Rated</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ash">
              <ChevronDown className="w-4 h-4" />
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
            className="overflow-hidden mb-6"
            id="collapsible-filter-panel"
          >
            <div className="p-6 bg-zinc border border-white/10 rounded-3xl shadow-lg mt-2 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand Filter */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">Brand</span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleBrandChange('All')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      filters.brand === 'All'
                        ? 'bg-volt border-volt text-ink font-bold shadow-xs'
                        : 'bg-white/[0.02] border-white/5 text-bone hover:border-white/10 hover:bg-white/[0.05]'
                    }`}
                    id="brand-filter-all"
                  >
                    All Brands
                  </button>
                  {ALL_BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBrandChange(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        filters.brand === b
                          ? 'bg-volt border-volt text-ink font-bold shadow-xs'
                          : 'bg-white/[0.02] border-white/5 text-bone hover:border-white/10 hover:bg-white/[0.05]'
                      }`}
                      id={`brand-filter-${b.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">Max Price</span>
                  <span className="text-sm font-bold text-volt bg-volt/10 px-2 py-0.5 rounded-lg font-mono">
                    ${filters.maxPrice}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <input
                    type="range"
                    min="10"
                    max="250"
                    step="5"
                    value={filters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-volt"
                    id="price-range-slider"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-ash px-1 font-mono">
                    <span>Min: $10</span>
                    <span>Max: $250+</span>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-ash uppercase tracking-wider font-mono">Size</span>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`h-9 min-w-[36px] px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        filters.size === size
                          ? 'bg-volt border-volt text-ink hover:bg-bone'
                          : 'bg-white/[0.02] border-white/5 text-bone hover:border-white/10 hover:bg-white/[0.05]'
                      }`}
                      id={`size-filter-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary Drawer */}
            {isFiltered && (
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-semibold text-ash">Active filters:</span>
                  {filters.department && filters.department !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-volt/10 text-volt border border-volt/20">
                      Dept: {filters.department.charAt(0).toUpperCase() + filters.department.slice(1)}
                      <X
                        className="w-3 h-3 cursor-pointer text-volt/70 hover:text-volt"
                        onClick={() => setFilters((prev) => ({ ...prev, department: 'all' }))}
                      />
                    </span>
                  )}
                  {filters.brand !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-bone border border-white/5">
                      Brand: {filters.brand}
                      <X
                        className="w-3 h-3 cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleBrandChange('All')}
                      />
                    </span>
                  )}
                  {filters.maxPrice < 250 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-bone border border-white/5">
                      Under ${filters.maxPrice}
                      <X
                        className="w-3 h-3 cursor-pointer text-ash hover:text-bone"
                        onClick={() => setFilters((prev) => ({ ...prev, maxPrice: 250 }))}
                      />
                    </span>
                  )}
                  {filters.size !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-bone border border-white/5">
                      Size: {filters.size}
                      <X
                        className="w-3 h-3 cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleSizeChange(filters.size)}
                      />
                    </span>
                  )}
                  {filters.sortBy !== 'featured' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-bone border border-white/5">
                      Sorted
                      <X
                        className="w-3 h-3 cursor-pointer text-ash hover:text-bone"
                        onClick={() => handleSortChange('featured')}
                      />
                    </span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-450 hover:underline cursor-pointer"
                  id="reset-all-filters-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs font-bold text-ash tracking-wider uppercase px-2 mb-2">
        <span>Category: {selectedCategory === 'all' ? 'All Products' : selectedCategory}</span>
        <span>Showing {totalResults} {totalResults === 1 ? 'Product' : 'Products'}</span>
      </div>
    </div>
  );
}
