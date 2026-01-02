import React from "react";

const About = () => {
  return (
    <div className="bg-white text-slate-800">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Find the right travel buddy.
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Buddy Finder helps travelers connect, plan trips together,
          and explore destinations with people who share the same vibe.
        </p>
      </section>

      {/* WHY SECTION */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Traveler avatar"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Travel Together</h3>
            <p className="mt-3 text-slate-600">
              Discover people planning similar trips and connect instantly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Traveler avatar"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Real Connections</h3>
            <p className="mt-3 text-slate-600">
              Chat in real time, discuss plans, and build trust beforehand.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Traveler avatar"
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Safe & Simple</h3>
            <p className="mt-3 text-slate-600">
              Verified users and secure login for peace of mind.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            How Buddy Finder works
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-12 text-center">

            <div>
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
                alt="Explore trips"
                className="rounded-xl h-40 w-full object-cover mb-4"
              />
              <h4 className="font-semibold text-lg">Explore Trips</h4>
              <p className="mt-2 text-slate-600">
                Browse trips shared by travelers worldwide.
              </p>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt="Chat"
                className="rounded-xl h-40 w-full object-cover mb-4"
              />
              <h4 className="font-semibold text-lg">Start a Conversation</h4>
              <p className="mt-2 text-slate-600">
                Chat instantly and get notified in real time.
              </p>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1"
                alt="Travel"
                className="rounded-xl h-40 w-full object-cover mb-4"
              />
              <h4 className="font-semibold text-lg">Plan & Go</h4>
              <p className="mt-2 text-slate-600">
                Finalize plans and travel confidently together.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Trusted by travelers worldwide
          </h2>

          <div className="mt-8 flex justify-center gap-4">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-12 h-12 rounded-full" />
            <img src="https://randomuser.me/api/portraits/women/21.jpg" className="w-12 h-12 rounded-full" />
            <img src="https://randomuser.me/api/portraits/men/45.jpg" className="w-12 h-12 rounded-full" />
            <img src="https://randomuser.me/api/portraits/women/56.jpg" className="w-12 h-12 rounded-full" />
          </div>

          <p className="mt-6 text-slate-300 max-w-2xl mx-auto">
            Real people. Real trips. Real connections.
          </p>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="py-12 text-center text-sm text-slate-500">
        <p>Buddy Finder · A full-stack travel companion platform</p>
        <p className="mt-1">Crafted with ❤️ by Arpit Mishra</p>
      </section>

    </div>
  );
};

export default About;
