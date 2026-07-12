import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const features = [
  {
    icon: "AI",
    title: "AI-Generated Plans",
    desc: "A full workout and meal plan shaped around your goals, experience level, and real schedule.",
    img: "/images/pushups-duo.jpg",
  },
  {
    icon: "RX",
    title: "Injury-Aware Training",
    desc: "Tell us about pain or limitations once, and the generated plan will work around them.",
    img: "/images/dumbbell-overhead.jpg",
  },
  {
    icon: "MEAL",
    title: "Meals That Match Your Goal",
    desc: "Calories and macros adapt to fat loss, muscle gain, or general fitness without using a generic template.",
    img: "/images/healthy-bowl.jpg",
  },
  {
    icon: "DATA",
    title: "Real Progress Stats",
    desc: "Log workouts, water, weight, and meal adherence, then see those changes reflected in the charts.",
    img: "/images/boxing-wrap.jpg",
  },
  {
    icon: "SYNC",
    title: "Adapts With You",
    desc: "Update your details and weekly availability, then regenerate a plan that reflects your current life.",
    img: "/images/bicep-curl.jpg",
  },
  {
    icon: "HOME",
    title: "Gym or Home",
    desc: "Whether you train with full equipment or minimal space, the plan is built for your setup.",
    img: "/images/fitness-still-life.jpg",
  },
];

const heroParts = {
  before: "Your Personal ",
  highlight: "AI Coach",
  after: " for Fitness & Nutrition",
};

const fullHeroText = `${heroParts.before}${heroParts.highlight}${heroParts.after}`;
const beforeLength = heroParts.before.length;
const highlightLength = heroParts.highlight.length;

const Landing = () => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const finishedTyping = visibleChars === fullHeroText.length;
    const finishedDeleting = visibleChars === 0;

    const timeout = setTimeout(
      () => {
        if (!deleting && finishedTyping) {
          setDeleting(true);
          return;
        }

        if (deleting && finishedDeleting) {
          setDeleting(false);
          return;
        }

        setVisibleChars((prev) => prev + (deleting ? -1 : 1));
      },
      finishedTyping && !deleting ? 1400 : finishedDeleting && deleting ? 450 : deleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [deleting, visibleChars]);

  const typedSegments = useMemo(() => {
    const before = fullHeroText.slice(0, Math.min(visibleChars, beforeLength));
    const highlight =
      visibleChars > beforeLength
        ? fullHeroText.slice(beforeLength, Math.min(visibleChars, beforeLength + highlightLength))
        : "";
    const after =
      visibleChars > beforeLength + highlightLength
        ? fullHeroText.slice(beforeLength + highlightLength, visibleChars)
        : "";

    return { before, highlight, after };
  }, [visibleChars]);

  return (
    <div className="min-h-screen bg-dark text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            AI <span className="text-primary">Fit</span>
          </h1>

          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => scrollTo("home")} className="text-sm font-semibold text-slate-200 transition hover:text-primary">
              Home
            </button>
            <button onClick={() => scrollTo("features")} className="text-sm font-semibold text-slate-200 transition hover:text-primary">
              Features
            </button>
            <button onClick={() => scrollTo("about")} className="text-sm font-semibold text-slate-200 transition hover:text-primary">
              About
            </button>
          </div>

          <Link to="/login" className="btn-primary px-5 py-2 text-sm">
            Login
          </Link>
        </div>
      </nav>

      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.56), rgba(2,6,23,0.88)), url('/images/hero-barn-gym.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <p className="animate-fadeInUp text-sm font-semibold uppercase tracking-[0.34em] text-primary/90">
            Smart fitness planning
          </p>
          <h2 className="mt-6 min-h-[8rem] text-4xl font-semibold leading-tight text-white md:min-h-[10rem] md:text-6xl">
            <span>{typedSegments.before}</span>
            <span className="text-primary">{typedSegments.highlight}</span>
            <span>{typedSegments.after}</span>
            <span className="typing-caret" />
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-200 animate-fadeInUp" style={{ animationDelay: "0.15s" }}>
            Plans, meals, and weekly scheduling that respond to your goals, your busy weeks, and the progress you actually log.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
              Start Your Journey
            </Link>
            <button
              type="button"
              onClick={() => scrollTo("features")}
              className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/15"
            >
              Explore Features
            </button>
          </div>

          <p className="mt-14 text-sm font-medium text-slate-400 animate-fadeIn" style={{ animationDelay: "0.6s" }}>
            Scroll to explore
          </p>
        </div>
      </section>

      <section
        className="quote-banner px-6 py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.48), rgba(2,6,23,0.82)), url('/images/kettlebell-silhouette.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-primary/90">
            Workout Motivation
          </p>
          <p className="text-2xl font-semibold italic leading-snug text-white md:text-3xl">
            "Discipline is choosing between what you want now and what you want most."
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.32em] text-primary">Features</p>
          <h3 className="text-3xl font-semibold text-white md:text-4xl">Everything you need, built by AI</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="interactive-card overflow-hidden rounded-[28px] border border-white/10 bg-dark-card">
              <div
                className="h-40 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(rgba(2,6,23,0.25), rgba(2,6,23,0.82)), url('${feature.img}')`,
                }}
              />
              <div className="p-6">
                <div className="mb-4 inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {feature.icon}
                </div>
                <h4 className="mb-2 text-xl font-semibold text-white">{feature.title}</h4>
                <p className="text-sm font-medium leading-relaxed text-slate-300">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="quote-banner px-6 py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.84)), url('/images/healthy-bowl.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-accent-light">
            Nutrition Motivation
          </p>
          <p className="text-2xl font-semibold italic leading-snug text-white md:text-3xl">
            "Every meal is a chance to nourish the body you are building."
          </p>
        </div>
      </section>

      <section
        className="quote-banner px-6 py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.30), rgba(2,6,23,0.76)), url('/images/worry-less-run-more.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xl font-semibold italic text-white md:text-2xl">
            Keep moving. Your future self is already proud of you.
          </p>
        </div>
      </section>

      <section
        id="about"
        className="relative border-t border-white/5 px-6 py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.88), rgba(2,6,23,0.92)), url('/images/dont-give-up.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.32em] text-primary">About Us</p>
          <h3 className="mb-6 text-3xl font-semibold text-white md:text-4xl">Why AI Fit exists</h3>
          <p className="mb-4 font-medium leading-relaxed text-slate-200">
            Generic workout plans and cookie-cutter meal templates do not account for your injuries, your schedule, or how your goals change over time. AI Fit was built to fix that by creating a coach that actually reads your profile and builds a plan around you.
          </p>
          <p className="font-medium leading-relaxed text-slate-200">
            Tell us who you are once. Update it whenever life changes. Get a fresh plan every time, backed by progress tracking that shows what is actually working.
          </p>
        </div>
      </section>

      <section
        className="quote-banner px-6 py-24 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,23,0.74), rgba(2,6,23,0.90)), url('/images/be-fit-food.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="mb-6 text-3xl font-semibold text-white md:text-4xl">Ready to Be Fit?</h3>
        <Link to="/signup" className="btn-primary inline-flex px-8 py-3 text-lg">
          Get Started Free
        </Link>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-sm font-medium text-slate-500">
        AI <span className="text-primary">Fit</span> built for your goals.
      </footer>
    </div>
  );
};

export default Landing;
