import './home.css';
import Hero from './Hero';
import About from './About';
import Menu from './Menu';
import Contact from './Contact';
import { BRAND } from '../constants';

export default function Home() {
    return (
      <>
        <main>
          <Hero />
          <About />
          <Menu />
          <Contact />
        </main>
        <footer className="footer-section">
          <div className="footer-content">
            <p className="footer-copy">
              © {new Date().getFullYear()} {BRAND.name.toUpperCase()} • CRAFTED WITH SOUL
            </p>
          </div>
        </footer>
      </>
    );
  }