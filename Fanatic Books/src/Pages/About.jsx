'use client';

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Book,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Truck,
  Users,
  Sparkles,
} from 'lucide-react';

const slides = [
  {
    id: 1,
    text: 'Discover a world of books curated just for you.',
    image: './images/eer.webp',
  },
  {
    id: 2,
    text: 'Join a passionate community of book lovers!',
    image: './images/ww.jpg',
  },
  {
    id: 3,
    text: 'Find second-hand books at amazing prices!',
    image: 'https://source.unsplash.com/1600x900/?library',
  },
];

const reasons = [
  {
    id: 1,
    title: 'Curated Selection',
    description:
      "We carefully handpick the best books to match every reader's taste.",
    icon: <BookOpen className="w-10 h-10" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Affordable for All',
    description: 'New, used, and rare books at unbeatable prices.',
    icon: <Book className="w-10 h-10" />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 3,
    title: 'Seamless Shopping Experience',
    description:
      'Fast delivery and a user-friendly interface make book shopping hassle-free.',
    icon: <Truck className="w-10 h-10" />,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 4,
    title: 'Community-Driven',
    description:
      'Join a thriving community of book lovers, share recommendations, and connect.', 
    icon: <Users className="w-10 h-10" />,
    color: 'from-emerald-500 to-green-500',
  },
];

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReason, setCurrentReason] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  const navigate = useNavigate();

  // Handle autoplay for sliders
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setCurrentReason((prev) => (prev + 1) % reasons.length);
      }, 5000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isAutoplay]);

  // Pause autoplay when user interacts with sliders
  const handleManualSlideChange = (index, type) => {
    if (type === 'slide') {
      setCurrentSlide(index);
    } else {
      setCurrentReason(index);
    }

    // Pause autoplay temporarily
    setIsAutoplay(false);
    if (autoplayRef.current) clearInterval(autoplayRef.current);

    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-purple-200 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-500 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <header className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-950 opacity-80 z-0"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center">
              <div className="mb-6 relative">
                <Heart className="text-purple-400 absolute -top-6 -left-6 w-8 h-8 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                  About Fanatic Books
                </h1>
                <Sparkles className="text-purple-400 absolute -bottom-6 -right-6 w-8 h-8 animate-pulse" />
              </div>
              <div className="h-1 w-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6"></div>
              <p className="mt-4 text-xl md:text-2xl max-w-2xl text-center text-purple-100">
                Welcome to Fanatic Books, your one-stop destination for book
                lovers where stories come alive and reading dreams are
                fulfilled.
              </p>
            </div>
          </div>
        </header>

        {/* Hero Slider Section */}
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10"></div>

          <div
            className="absolute inset-0 flex transition-transform duration-1000 ease-in-out z-0"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0 relative"
              >
                <img
                  src={slide.image || '/placeholder.svg'}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-10 md:p-16">
            <div className="container mx-auto">
              <div className="bg-black/60 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10 max-w-2xl mx-auto transform transition-all duration-1000 ease-in-out">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                  {slides[currentSlide].text}
                </h2>
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() =>
                      handleManualSlideChange(
                        (currentSlide - 1 + slides.length) % slides.length,
                        'slide'
                      )
                    }
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleManualSlideChange(index, 'slide')}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? 'bg-white scale-125'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      handleManualSlideChange(
                        (currentSlide + 1) % slides.length,
                        'slide'
                      )
                    }
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm p-10 rounded-2xl border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-center mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-300"></div>
                <Book className="mx-4 text-purple-300" size={28} />
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                  Our Mission
                </h2>
                <Book className="mx-4 text-purple-300" size={28} />
                <div className="h-px w-12 bg-gradient-to-r from-purple-300 to-transparent"></div>
              </div>

              <p className="text-xl leading-relaxed text-center text-purple-100">
                We aim to create the most personalized and engaging online
                bookstore experience. From bestsellers to rare second-hand
                books, we bring them all to your fingertips. Our passion for
                literature drives us to connect readers with stories that
                inspire, educate, and transform lives.
              </p>

              <div className="mt-10 flex justify-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 text-purple-200 text-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>Bringing books and readers together since 2020</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300 mb-6">
                Why Choose Fanatic Books?
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
            </div>

            <div className="relative">
              {/* Desktop view - show all cards */}
              <div className="hidden lg:grid grid-cols-4 gap-6">
                {reasons.map((reason) => (
                  <div
                    key={reason.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group h-full"
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {reason.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-purple-200">{reason.description}</p>
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet view - carousel */}
              <div className="lg:hidden">
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentReason * 100}%)`,
                    }}
                  >
                    {reasons.map((reason) => (
                      <div
                        key={reason.id}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-full">
                          <div
                            className={`w-16 h-16 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center mb-6 mx-auto`}
                          >
                            {reason.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4 text-center">
                            {reason.title}
                          </h3>
                          <p className="text-purple-200 text-center text-lg">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8 space-x-2">
                    {reasons.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleManualSlideChange(index, 'reason')}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentReason === index
                            ? 'bg-white scale-125'
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to reason ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <div className="md:flex">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-pink-600/40 mix-blend-overlay"></div>
                    <img
                      src="./images/mandeep dai.JPG"
                      alt="Mandeep Rajbhandari"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:w-3/5 p-8 md:p-10">
                    <div className="inline-flex items-center px-4 py-1 rounded-full bg-purple-500/20 text-purple-200 text-sm mb-6">
                      <Heart className="w-4 h-4 mr-2 text-pink-400" />
                      <span>The Visionary</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      Meet Our Founder
                    </h2>

                    <h3 className="text-2xl font-bold text-purple-200 mb-4">
                      Mandeep Rajbhandari
                    </h3>

                    <p className="text-lg leading-relaxed text-purple-100 mb-6">
                      A passionate book lover dedicated to bringing readers
                      closer to their favorite stories. With a vision to make
                      books more accessible and to build a thriving community of
                      book enthusiasts, he created Fanatic Books as a haven for
                      readers worldwide.
                    </p>

                    <p className="text-lg leading-relaxed text-purple-100">
                      His journey began with a simple love for reading that
                      evolved into a mission to revolutionize how people
                      discover, access, and share books.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 relative text-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Discover Your Next Favorite Book?
              </h2>
              <p className="text-xl text-purple-200 mb-10">
                Join thousands of readers who have found their literary
                treasures at Fanatic Books.
              </p>

              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={() => navigate('/shop')}
                  className="relative bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 text-white px-8 py-4 rounded-lg text-xl font-medium transition duration-300 shadow-lg"
                >
                  Explore Our Books
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

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

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
