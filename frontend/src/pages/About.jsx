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
          <div>
            <h3 className="text-xl font-semibold">Travel Together</h3>
            <p className="mt-3 text-slate-600">
              Discover people who are planning similar trips and
              connect with them instantly.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Real Connections</h3>
            <p className="mt-3 text-slate-600">
              Chat in real time, discuss plans, and build trust
              before starting your journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Safe & Simple</h3>
            <p className="mt-3 text-slate-600">
              Verified users, secure login, and a clean experience
              designed for peace of mind.
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
              <span className="text-3xl">🧭</span>
              <h4 className="mt-4 font-semibold text-lg">
                Explore Trips
              </h4>
              <p className="mt-2 text-slate-600">
                Browse trips shared by other travelers from
                different locations.
              </p>
            </div>

            <div>
              <span className="text-3xl">💬</span>
              <h4 className="mt-4 font-semibold text-lg">
                Start a Conversation
              </h4>
              <p className="mt-2 text-slate-600">
                Chat instantly and get notified when someone
                connects with you.
              </p>
            </div>

            <div>
              <span className="text-3xl">✈️</span>
              <h4 className="mt-4 font-semibold text-lg">
                Plan & Go
              </h4>
              <p className="mt-2 text-slate-600">
                Finalize plans together and travel with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Built for modern travelers
          </h2>
          <p className="mt-6 text-slate-300 max-w-2xl mx-auto">
            Buddy Finder is designed with real-time communication,
            privacy, and smooth performance — so you can focus on
            the journey, not the logistics.
          </p>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="py-12 text-center text-sm text-slate-500">
        <p>
          Buddy Finder · A full-stack travel companion platform
        </p>
        <p className="mt-1">
          Crafted with ❤️ by Arpit Mishra
        </p>
      </section>

    </div>
  );
};

export default About;
