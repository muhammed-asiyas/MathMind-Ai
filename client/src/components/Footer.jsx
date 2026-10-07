import { ArrowRight, ArrowUpRight, BrainCircuit, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__cta">
          <div>
            <span className="site-footer__eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              Your next breakthrough starts here
            </span>
            <h2>Make every problem a step forward.</h2>
            <p>Build confidence with clear lessons, guided practice, and a patient AI tutor.</p>
          </div>
          <Link className="site-footer__cta-link" to="/signup">
            Start learning
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Link className="site-footer__logo" to="/" aria-label="MathMind AI home">
              <span className="site-footer__logo-mark">
                <BrainCircuit size={23} aria-hidden="true" />
              </span>
              <span>MathMind <span>AI</span></span>
            </Link>
            <h3 className="site-footer__brand-heading">About MathMind AI</h3>
            <p>
              An AI-powered mathematics learning platform for clearer thinking,
              confident practice, and progress that feels rewarding.
            </p>
            <span className="site-footer__brand-note">
              <span aria-hidden="true" />
              Learn smarter. Practice better.
            </span>
          </div>

          <nav className="site-footer__links" aria-label="Explore MathMind AI">
            <h3>Explore</h3>
            <Link to="/#features">Learning features <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link to="/#about">Our approach <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link to="/lessons">Lessons <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </nav>

          <nav className="site-footer__links" aria-label="Your MathMind AI account">
            <h3>Your learning</h3>
            <Link to="/ai-tutor">AI tutor <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link to="/login">Sign in <ArrowUpRight size={14} aria-hidden="true" /></Link>
            <Link to="/signup">Create an account <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </nav>

          <div className="site-footer__note">
            <span className="site-footer__note-icon"><BookOpen size={18} aria-hidden="true" /></span>
            <p>Small steps, strong foundations, and a little more confidence every day.</p>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} MathMind AI. All rights reserved.</p>
          <a href="#top" className="site-footer__back-top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
