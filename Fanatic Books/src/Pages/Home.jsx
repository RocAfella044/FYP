'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Bookcard from '../Components/Bookcard';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Library,
  X,
} from 'lucide-react';
import HeroSection from '../Components/Hero';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Reveal animation for sections as they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    // Fetch books data
    axios
      .get('http://localhost:8000/api/books/')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => console.error('Error fetching books:', error));

    // Fetch genres data
    axios
      .get('http://localhost:8000/api/genres/')
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => console.error('Error fetching genres:', error));

    return () => observer.disconnect();
  }, []);

  // Filter books by selected genre
  useEffect(() => {
    if (selectedGenre) {
      const filtered = books.filter(
        (book) => book.book_genre === selectedGenre
      );
      setFilteredBooks(filtered);
    }
  }, [selectedGenre, books]);

  const scrollSlider = (sliderId, direction) => {
    const container = document.getElementById(sliderId);
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Generate a color based on genre name
  const getGenreColor = (genreName) => {
    // Simple hash function to generate consistent colors based on genre name
    const hash = genreName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = [
      ['from-teal-600 to-blue-600', 'text-teal-200'],
      ['from-amber-600 to-orange-600', 'text-amber-200'],
      ['from-purple-600 to-pink-600', 'text-purple-200'],
      ['from-blue-600 to-indigo-600', 'text-blue-200'],
      ['from-green-600 to-teal-600', 'text-green-200'],
      ['from-red-600 to-pink-600', 'text-red-200'],
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  // Handle selecting a genre
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    document
      .getElementById('genre-books')
      .scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-200">
      {/* Hero Section with parallax effect */}
      <div className="relative overflow-hidden">
        <HeroSection />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950 pointer-events-none"></div>
      </div>

      {/* Our Best Picks Section */}
      <section
        id="best-picks"
        className="py-20 relative opacity-0 transition-opacity duration-700"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-950/80 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300"></div>
            <Sparkles className="text-purple-300 animate-pulse" size={24} />
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Our Best Picks
            </h2>
            <Sparkles className="text-purple-300 animate-pulse" size={24} />
            <div className="h-px w-12 bg-gradient-to-r from-purple-300 to-transparent"></div>
          </div>

          <div className="relative">
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                bg-gradient-to-r from-purple-600/80 to-indigo-600/80 backdrop-blur-md 
                text-white rounded-full p-3.5 
                shadow-[0_0_15px_rgba(168,85,247,0.5)] 
                focus:outline-none focus:ring-2 focus:ring-purple-400 
                transition-all duration-300 group hover:scale-110"
              onClick={() => scrollSlider('book-slider', 'left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-md 
                text-white rounded-full p-3.5 
                shadow-[0_0_15px_rgba(168,85,247,0.5)] 
                focus:outline-none focus:ring-2 focus:ring-purple-400 
                transition-all duration-300 group hover:scale-110"
              onClick={() => scrollSlider('book-slider', 'right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
            </button>

            <div
              id="book-slider"
              className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory gap-8 py-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex-shrink-0 w-8" />
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.id}
                    className="flex-shrink-0 snap-start transform hover:scale-105 transition-transform duration-300"
                    style={{ width: '280px' }}
                  >
                    <Bookcard book={book} type={'book'} />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full min-h-[300px]">
                  <div className="text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <BookOpen className="mx-auto h-12 w-12 text-purple-300 mb-4 opacity-70" />
                    <p className="text-purple-200 italic">
                      No books available at the moment.
                    </p>
                    <p className="text-purple-300/70 text-sm mt-2">
                      Check back soon for our curated selection.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex-shrink-0 w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Discover Section - Using backend data */}
      <section
        id="discover"
        className="py-20 relative opacity-0 transition-opacity duration-700"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-800/50 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/80 to-transparent pointer-events-none"></div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300"></div>
            <Library className="text-teal-300 animate-pulse" size={24} />
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200">
              Discover Your Next Read
            </h2>
            <Library className="text-teal-300 animate-pulse" size={24} />
            <div className="h-px w-12 bg-gradient-to-r from-purple-300 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {genres.length > 0
              ? genres.map((genre, index) => {
                  const [bgColor, textColor] = getGenreColor(genre);
                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl h-64 cursor-pointer"
                      onClick={() => handleGenreSelect(genre)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-60 group-hover:opacity-70 transition-opacity duration-500`}
                      ></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <Library className="text-white/30 h-32 w-32" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                          {genre}
                        </h3>
                        <p className="text-white/80 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          Explore our collection of {genre.toLowerCase()} books.
                        </p>

                        <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-200">
                          Browse {genre}
                        </button>
                      </div>
                    </div>
                  );
                })
              : // Loading state when no genres are available yet
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-xl h-64 bg-white/5 animate-pulse flex items-center justify-center"
                  >
                    <Library className="text-purple-300/30 h-16 w-16" />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Genre specific books section - shows up after selecting a genre */}
      {selectedGenre && (
        <section id="genre-books" className="py-20 relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-800/50 -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/80 to-transparent pointer-events-none"></div>

          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300"></div>
                <BookOpen className="text-purple-300" size={24} />
                <h2 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  {selectedGenre} Books
                </h2>
              </div>
              <button
                onClick={() => setSelectedGenre(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all duration-300"
              >
                <X size={16} />
                <span>Clear</span>
              </button>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <Bookcard book={book} type={'book'} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full min-h-[300px]">
                <div className="text-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <BookOpen className="mx-auto h-12 w-12 text-purple-300 mb-4 opacity-70" />
                  <p className="text-purple-200 italic">
                    No books available in the {selectedGenre} category.
                  </p>
                  <p className="text-purple-300/70 text-sm mt-2">
                    Try selecting a different genre or check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
