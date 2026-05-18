import './home.css';
import Logo from '../assets/logo.png';

export default function Hero() {
  const handleSeeAllMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
      // Reset to 'All' category to show all items
      const event = new CustomEvent('showAllMenu');
      window.dispatchEvent(event);
    }
  };

  return (
    <section className="hero-section">
      <div className="content-wrapper">
        <img src={Logo} alt="CantoBox Logo" className="logo" />
        <h1 className="hero-title">Welcome to CantoBox</h1>
        <p className="hero-copy">Fresh, organic, and traditionally prepared.</p>
      </div>
    </section>
  );
}