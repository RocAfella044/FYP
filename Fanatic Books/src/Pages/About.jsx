import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    text: 'Discover a world of books curated just for you.',
    image: 'https://source.unsplash.com/1600x900/?bookshelf',
  },
  {
    id: 2,
    text: 'Join a passionate community of book lovers!',
    image: 'https://source.unsplash.com/1600x900/?reading',
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
  },
  {
    id: 2,
    title: 'Affordable for All',
    description: 'New, used, and rare books at unbeatable prices.',
  },
  {
    id: 3,
    title: 'Seamless Shopping Experience',
    description:
      'Fast delivery and a user-friendly interface make book shopping hassle-free.',
  },
  {
    id: 4,
    title: 'Community-Driven',
    description:
      'Join a thriving community of book lovers, share recommendations, and connect.',
  },
];

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentReason, setCurrentReason] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setCurrentReason((prev) => (prev + 1) % reasons.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-purple-900 to-white min-h-screen text-center text-white">
      <header className="py-12">
        <h1 className="text-4xl md:text-6xl font-bold">About Fanatic Books</h1>
        <p className="mt-4 text-lg md:text-xl">
          Welcome to Fanatic Books, your one-stop destination for book lovers.
        </p>
      </header>

      {/* Auto-Slider Section */}
      <div className="relative overflow-hidden h-64 flex justify-center items-center">
        <div
          className="absolute w-full h-full flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center text-xl relative"
            >
              <img
                src="./images/mandeep dai.JPG"
                alt="Slider"
                className="w-full h-64 object-cover opacity-70"
              />
              <div className="absolute bottom-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded">
                {slide.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-semibold">Our Mission</h2>
        <p className="mt-4 text-lg md:text-xl">
          We aim to create the most personalized and engaging online bookstore
          experience. From bestsellers to rare second-hand books, we bring them
          all to your fingertips.
        </p>
      </section>

      {/* Why Fanatic Books Slider */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-semibold">
          Why Fanatic Books?
        </h2>
        <div className="relative overflow-hidden h-64">
          <div
            className="absolute w-full h-full flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReason * 100}%)` }}
          >
            {reasons.map((reason) => (
              <div
                key={reason.id}
                className="w-full flex-shrink-0 flex flex-col items-center justify-center text-xl relative p-6 bg-purple-800 rounded-md shadow-lg"
              >
                <h3 className="text-2xl font-bold">{reason.title}</h3>
                <p className="mt-4 text-lg md:text-xl">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold">Meet Our Founder</h2>
        <div className="mt-8 flex flex-col items-center">
          <img
            src="./images/mandeep dai.JPG"
            alt="Mandeep Rajbhandari"
            className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg"
          />
          <h3 className="mt-4 text-2xl font-bold">Mandeep Rajbhandari</h3>
          <p className="mt-2 text-lg md:text-xl max-w-2xl">
            <strong>Mandeep Rajbhandari</strong>, a passionate book lover
            dedicated to bringing readers closer to their favorite stories. With
            a vision to make books more accessible and to build a thriving
            community of book enthusiasts, he created Fanatic Books as a haven
            for readers worldwide.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <button
          onClick={() => navigate('/shop')}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg text-xl hover:bg-purple-800 transition duration-300"
        >
          Explore Our Collection
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
