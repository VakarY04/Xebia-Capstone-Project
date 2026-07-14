import { Link } from "react-router-dom";
import {
  SparkleIcon,
  ShieldIcon,
  MealIcon,
  ChartIcon,
  SyncIcon,
  HomeGymIcon,
  LogoMark,
} from "../components/AppIcons.jsx";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const features = [
  {
    Icon: SparkleIcon,
    title: "AI-Generated Plans",
    desc: "A full workout and meal plan shaped around your goals, experience level, and real schedule.",
    img: "/images/pushups-duo.jpg",
  },
  {
    Icon: ShieldIcon,
    title: "Injury-Aware Training",
    desc: "Tell us about pain or limitations once, and the generated plan will work around them.",
    img: "/images/dumbbell-overhead.jpg",
  },
  {
    Icon: MealIcon,
    title: "Meals That Match Your Goal",
    desc: "Calories and macros adapt to fat loss, muscle gain, or general fitness without a generic template.",
    img: "/images/healthy-bowl.jpg",
  },
  {
    Icon: ChartIcon,
    title: "Real Progress Stats",
    desc: "Log workouts, water, weight, and meal adherence, then see those changes reflected in the charts.",
    img: "/images/boxing-wrap.jpg",
  },
  {
    Icon: SyncIcon,
    title: "Adapts With You",
    desc: "Update your details and weekly availability, then regenerate a plan that reflects your current life.",
    img: "/images/bicep-curl.jpg",
  },
  {
    Icon: HomeGymIcon,
    title: "Gym or Home",
    desc: "Whether you train with full equipment or minimal space, the plan is built for your setup.",
    img: "/images/fitness-still-life.jpg",
  },
];

const overlay = (from, to) =>
  `linear-gradient(rgba(9,9,11,${from}), rgba(9,9,11,${to}))`;

const QuoteBanner = ({
  img,
  from,
  to,
  eyebrow,
  eyebrowClass = "text-primary/90",
  quote,
  size = "text-2xl md:text-3xl",
  maxW = "max-w-2xl",
}) => (
  <section
    className="quote-banner px-6 py-24"
    style={{
      backgroundImage: `${overlay(from, to)}, url('${img}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className={`mx-auto ${maxW} text-center`}>
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.32em] ${eyebrowClass}`}
        >
          {eyebrow}
        </p>
      ) : null}
      <p className={`${size} font-semibold italic leading-snug text-white`}>
        {quote}
      </p>
    </div>
  </section>
);

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-dark-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="flex items-center gap-3 text-left"
          >
            <LogoMark className="h-11 w-11 shrink-0" />
            <div>
              <p className="text-lg font-semibold uppercase tracking-[0.22em] text-white">
                AI FIT
              </p>
              <p className="text-xs font-medium tracking-[0.18em] text-slate-300/80">
                Fitness &amp; Nutrition
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => scrollTo("home")}
              className="text-sm font-semibold text-slate-200 transition hover:text-primary"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-sm font-semibold text-slate-200 transition hover:text-primary"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="text-sm font-semibold text-slate-200 transition hover:text-primary"
            >
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
          backgroundImage: `${overlay(0.6, 0.9)}, url('/images/hero-barn-gym.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="glow-blob -left-24 top-16 h-72 w-72 bg-primary/25 animate-floatSlow" />
        <div className="glow-blob -right-16 bottom-24 h-80 w-80 bg-accent/20 animate-floatSlower" />

        <div className="relative mx-auto max-w-4xl animate-revealUp">
          <span className="eyebrow-badge">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulseDot rounded-full bg-primary" />
            </span>
            Smart fitness planning
          </span>

          <h2 className="mt-7 text-4xl font-semibold leading-tight text-white md:text-6xl">
            Your Personal <span className="hero-gradient-text animate-gradientPan">AI Coach</span>
            <br className="hidden md:block" /> for Fitness &amp; Nutrition
          </h2>

          <p
            className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-300 animate-revealUp"
            style={{ animationDelay: "0.15s" }}
          >
            Plans, meals, and weekly scheduling that respond to your goals, your busy weeks, and the progress you actually log.
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-revealUp"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/signup" className="btn-primary px-8 py-3 text-lg">
              Start Your Journey
            </Link>
            <button
              type="button"
              onClick={() => scrollTo("features")}
              className="rounded-2xl border border-white/15 bg-white/5 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-white/10"
            >
              Explore Features
            </button>
          </div>

          <p
            className="mt-14 text-sm font-medium text-slate-500 animate-fadeIn"
            style={{ animationDelay: "0.6s" }}
          >
            Scroll to explore
          </p>
        </div>
      </section>

      <QuoteBanner
        img="/images/kettlebell-silhouette.jpg"
        from={0.5}
        to={0.85}
        eyebrow="Workout Motivation"
        quote='"Discipline is choosing between what you want now and what you want most."'
      />

      <section id="features" className="mx-auto max-w-6xl px-6 py-28">
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.32em] text-primary">
            Features
          </p>
          <h3 className="text-3xl font-semibold text-white md:text-4xl">
            Everything you need, built by AI
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-slate-400">
            Plan, meals, tracking, and scheduling all shaped around one profile.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, desc, img }) => (
            <div
              key={title}
              className="interactive-card group overflow-hidden rounded-[21px] border border-white/10 bg-dark-card"
            >
              <div
                className="h-36 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `${overlay(0.25, 0.82)}, url('${img}')` }}
              />
              <div className="p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-white">{title}</h4>
                <p className="text-sm font-medium leading-relaxed text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <QuoteBanner
        img="/images/healthy-bowl.jpg"
        from={0.55}
        to={0.85}
        eyebrow="Nutrition Motivation"
        eyebrowClass="text-accent-light"
        quote='"Every meal is a chance to nourish the body you are building."'
      />

      <QuoteBanner
        img="/images/worry-less-run-more.jpg"
        from={0.32}
        to={0.78}
        quote="Keep moving. Your future self is already proud of you."
        size="text-xl md:text-2xl"
        maxW="max-w-lg"
      />

      <section
        id="about"
        className="relative border-t border-white/5 px-6 py-28"
        style={{
          backgroundImage: `${overlay(0.88, 0.94)}, url('/images/dont-give-up.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.32em] text-primary">
            About Us
          </p>
          <h3 className="mb-6 text-3xl font-semibold text-white md:text-4xl">
            Why AI FIT exists
          </h3>
          <p className="mb-4 font-medium leading-relaxed text-slate-300">
            Generic workout plans and cookie-cutter meal templates do not account for your injuries, your schedule, or how your goals change over time. AI FIT was built to fix that by creating a coach that reads your profile and builds a plan around you.
          </p>
          <p className="font-medium leading-relaxed text-slate-300">
            Tell us who you are once. Update it whenever life changes. Get a fresh plan every time, backed by progress tracking that shows what is actually working.
          </p>
        </div>
      </section>

      <section
        className="px-6 py-24 text-center"
        style={{
          backgroundImage: `${overlay(0.76, 0.92)}, url('/images/be-fit-food.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="mb-6 text-3xl font-semibold text-white md:text-4xl">
          Ready to train with AI FIT?
        </h3>
        <Link to="/signup" className="btn-primary inline-flex px-8 py-3 text-lg">
          Get Started Free
        </Link>
      </section>

      <footer className="border-t border-white/5 bg-dark-surface py-8 text-center text-sm font-medium text-slate-500">
        AI FIT built for your goals.
      </footer>
    </div>
  );
};

export default Landing;

