import React from 'react';
import { Star } from 'lucide-react';

interface FilterPanelProps {
  genres: string[];
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  resetFilters: () => void;
}

const FilterPanel = ({
  genres,
  selectedGenre,
  setSelectedGenre,
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  resetFilters,
}: FilterPanelProps) => {
  // Format genre name for display
  const formatGenreName = (genre: string) => {
    return genre.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 w-full md:w-64 border border-purple-300/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-purple-200 hover:text-white transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Genre Filter */}
      <div className="mb-8">
        <h3 className="text-purple-100 font-medium mb-3">Genre</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 filter-scrollbar">
          {genres.map((genre, index) => (
            <button
              key={index}
              onClick={() => setSelectedGenre(genre)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedGenre === genre
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 text-purple-100 hover:bg-white/10'
              }`}
            >
              {formatGenreName(genre)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h3 className="text-purple-100 font-medium mb-3">Price Range</h3>
        <div className="px-1">
          <div className="flex justify-between text-sm text-purple-200 mb-1">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-purple-500 h-2 rounded-lg appearance-none cursor-pointer bg-white/20"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="text-purple-100 font-medium mb-3">Minimum Rating</h3>
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setRatingFilter(rating === ratingFilter ? 0 : rating)
              }
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={20}
                className={`${
                  rating <= ratingFilter
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-purple-300'
                } transition-colors`}
              />
            </button>
          ))}
          {ratingFilter > 0 && (
            <span className="text-sm text-purple-200 ml-2">
              {ratingFilter}+ Stars
            </span>
          )}
        </div>
        {ratingFilter > 0 && (
          <button
            onClick={() => setRatingFilter(0)}
            className="text-xs text-purple-300 hover:text-purple-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
