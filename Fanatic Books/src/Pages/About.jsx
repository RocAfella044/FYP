import React from 'react';

const teamMembers = [
  {
    name: 'Emily Johnson',
    role: 'Founder & CEO',
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'David Lee',
    role: 'Head Librarian',
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Sarah Martinez',
    role: 'Customer Experience',
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Michael Chen',
    role: 'Tech Lead',
    image: 'https://via.placeholder.com/200',
  },
];

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-white text-gray-100">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to Fanatic Books
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          A place where book lovers unite! Explore, discover, and immerse
          yourself in a world of stories.
        </p>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>
              To create a personalized and immersive book-buying experience that
              caters to every reader's unique tastes.
            </p>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              To be the ultimate destination for book enthusiasts worldwide,
              fostering a passionate reading community.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-purple-200 text-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Fanatic Books?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                Curated Collections
              </h3>
              <p>Hand-picked selections to match every reader's taste.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                Fast & Free Delivery
              </h3>
              <p>
                Enjoy quick and hassle-free shipping for your favorite books.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                Community & Engagement
              </h3>
              <p>Join book clubs, events, and connect with fellow readers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Meet the Founder</h2>
          <div className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden w-80 mx-auto">
            <img
              src="./images/mandeep dai.JPG"
              alt="Mandip Thapa"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">Mandip Thapa</h3>
              <p>Founder & CEO</p>
              <p className="text-gray-600 mt-2">
                Passionate about books from a young age, Mandip founded Fanatic
                Books to share his love for reading with the world. His vision
                is to build a bookstore that’s more than just a marketplace—it’s
                a home for every book lover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join the Fanatic Books Community
        </h2>
        <p className="mb-6">
          Discover your next favorite book and become part of our passionate
          reader family.
        </p>
        <a
          href="/shop"
          className="bg-white text-purple-700 px-6 py-2 font-bold rounded-full hover:bg-purple-300"
        >
          Explore Books
        </a>
      </section>
    </div>
  );
}

export default About;
