import { useEffect, useRef, useState } from 'react';

// Sample image data - replace with your actual images
const images = [
  {
    id: 1,
    src: '/images/lop.webp ',
    alt: 'Image 1',
  },
  {
    id: 2,

    src: '/images/download.jpeg ',
    alt: 'Image 2',
  },
  {
    id: 3,
    src: '/images/side.jpeg ',
    alt: 'Image 3',
  },
  {
    id: 4,
    src: '/images/lake.jpeg ',
    alt: 'Image 4',
  },
  {
    id: 5,
    src: '/images/dow.jpeg ',
    alt: 'Image 5',
  },
  {
    id: 6,

    src: '/images/gwin.jpeg  ',
    alt: 'Image 6',
  },
  {
    id: 7,
    src: '/images/jok.jpeg ',
    alt: 'Image 7',
  },
  {
    id: 8,
    src: '/images/mgk.jpeg ',
    alt: 'Image 8',
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const totalSlides = Math.ceil(images.length / 4);

  // Auto-advance the slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Update slider position when currentIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: currentIndex * slideWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <section className="w-full py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Image Slider Container */}
        <div className="relative overflow-hidden mx-auto max-w-7xl">
          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex overflow-x-hidden snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="flex-shrink-0 w-full snap-center grid grid-cols-2 md:grid-cols-4 gap-4 px-4"
              >
                {images
                  .slice(slideIndex * 4, slideIndex * 4 + 4)
                  .map((image) => (
                    <div
                      key={image.id}
                      className="relative overflow-hidden rounded-lg shadow-xl transition-all duration-300"
                    >
                      <div className="relative">
                        <img
                          src={image.src || '/placeholder.svg'}
                          alt={image.alt}
                          className="object-cover aspect-square hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-white' : 'bg-white/40'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
