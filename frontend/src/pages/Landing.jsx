import { Link } from "react-router-dom";

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Discipline is choosing between what you want now and what you want most.",
];

const Landing = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.85)), url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Top nav */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          AI <span className="text-primary">Fit</span>
        </h1>
        <Link
          to="/login"
          className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded-full transition"
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-24 md:mt-32">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight">
          Your Personal <span className="text-primary">AI Coach</span> for
          Fitness & Nutrition
        </h2>
        <p className="text-slate-300 mt-6 max-w-xl text-lg italic">
          "{quotes[0]}"
        </p>

        <Link
          to="/signup"
          className="mt-10 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full text-lg transition"
        >
          Start Your Journey →
        </Link>

        <div className="grid md:grid-cols-2 gap-4 mt-16 max-w-2xl">
          {quotes.slice(1).map((q, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-slate-200 text-sm italic"
            >
              "{q}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
