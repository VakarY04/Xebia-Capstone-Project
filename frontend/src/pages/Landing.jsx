import { Link } from "react-router-dom";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const features = [
  {
    icon: "🧠",
    title: "AI-Generated Plans",
    desc: "A full 7-day workout and meal plan built around your goals, experience level, and schedule — not a generic template.",
    img: "/images/pushups-duo.jpg",
  },
  {
    icon: "🩹",
    title: "Injury-Aware Training",
    desc: "Tell us about any pain or conditions once, and every exercise the AI suggests works around it.",
    img: "/images/dumbbell-overhead.jpg",
  },
  {
    icon: "🍽️",
    title: "Meals That Match Your Goal",
    desc: "Calories and protein tuned for fat loss, muscle gain, or general fitness — every single day.",
    img: "/images/healthy-bowl.jpg",
  },
  {
    icon: "📊",
    title: "Real Progress Stats",
    desc: "Log your workouts and weight, and watch adherence, trends, and muscle focus turn into real charts.",
    img: "/images/boxing-wrap.jpg",
  },
  {
    icon: "🔄",
    title: "Adapts With You",
    desc: "Update your details any time and regenerate a fresh plan that reflects where you are now.",
    img: "/images/bicep-curl.jpg",
  },
  {
    icon: "🏠",
    title: "Gym or Home",
    desc: "Whether you've got a full rack or just floor space, your plan is built for the equipment you actually have.",
    img: "/images/fitness-still-life.jpg",
  },
];

const Landing = () => {
  return (
    <div className="bg-dark min-h-screen">
      {/* Fixed top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            AI <span className="text-primary">Fit</span>
          </h1>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("home")}
              className="text-slate-300 hover:text-primary transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-slate-300 hover:text-primary transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-slate-300 hover:text-primary transition-colors text-sm font-medium"
            >
              About Us
            </button>
          </div>

          <Link to="/login" className="btn-primary px-5 py-2 rounded-full text-sm">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero - the "HOME." shot, as requested */}
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.55), rgba(18,18,18,0.88)), url('/images/home-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-4xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight animate-fadeInUp">
          Your Personal <span className="text-primary">AI Coach</span> for
          Fitness & Nutrition
        </h2>
        <p
          className="text-slate-300 mt-6 max-w-xl text-lg italic animate-fadeInUp"
          style={{ animationDelay: "0.15s" }}
        >
          "The only bad workout is the one that didn't happen."
        </p>

        <Link
          to="/signup"
          className="btn-primary mt-10 px-8 py-3 rounded-full text-lg animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          Start Your Journey →
        </Link>

        <p
          className="text-slate-500 text-sm mt-14 animate-fadeIn"
          style={{ animationDelay: "0.6s" }}
        >
          ↓ scroll to explore
        </p>
      </section>

      {/* Workout motivation banner */}
      <section
        className="py-20 px-6 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.55), rgba(18,18,18,0.75)), url('/images/stronger-than-excuses.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-primary text-xs font-semibold uppercase tracking-wide mb-3">
            🏋️ Workout Motivation
          </p>
          <p className="text-white text-2xl md:text-3xl font-bold italic leading-snug">
            "Discipline is choosing between what you want now and what you
            want most."
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">
            Features
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Everything you need, built by AI
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="interactive-card bg-dark-card border border-white/10 rounded-2xl overflow-hidden"
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(18,18,18,0.3), rgba(18,18,18,0.85)), url('${f.img}')`,
                }}
              />
              <div className="p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h4 className="text-white font-semibold text-lg mb-2">
                  {f.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nutrition motivation banner */}
      <section
        className="py-20 px-6 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.6), rgba(18,18,18,0.8)), url('/images/healthy-bowl.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-accent text-xs font-semibold uppercase tracking-wide mb-3">
            🍽️ Nutrition Motivation
          </p>
          <p className="text-white text-2xl md:text-3xl font-bold italic leading-snug">
            "Every meal is a chance to nourish the body you're building."
          </p>
        </div>
      </section>

      {/* Mid quote banner */}
      <section
        className="py-24 px-6 relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.35), rgba(18,18,18,0.75)), url('/images/worry-less-run-more.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-lg mx-auto text-center">
          <p className="text-white text-xl md:text-2xl font-semibold italic">
            Keep moving. Your future self is already proud of you.
          </p>
        </div>
      </section>

      {/* About Us */}
      <section
        id="about"
        className="py-24 px-6 relative border-t border-white/5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.88), rgba(18,18,18,0.92)), url('/images/dont-give-up.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">
            About Us
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why AI Fit exists
          </h3>
          <p className="text-slate-300 leading-relaxed mb-4">
            Generic workout plans and cookie-cutter meal templates don't
            account for your injuries, your schedule, or how your goals
            change over time. AI Fit was built to fix that — a coach that
            actually reads your profile and builds a plan around{" "}
            <em>you</em>, not the other way around.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Tell us who you are once. Update it whenever life changes. Get a
            fresh 7-day plan every time, backed by real progress tracking so
            you can see what's actually working.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24 px-6 relative text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18,18,18,0.75), rgba(18,18,18,0.9)), url('/images/be-fit-food.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Be Fit?
        </h3>
        <Link
          to="/signup"
          className="btn-primary inline-block px-8 py-3 rounded-full text-lg"
        >
          Get Started Free →
        </Link>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5">
        AI <span className="text-primary">Fit</span> — built for your goals.
      </footer>
    </div>
  );
};

export default Landing;
