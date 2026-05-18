import './about.css';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container"> 
        <div className="about-content">
          <span className="section-label">Our Story</span>
          <h2 className="about-title">About Us</h2>
          
          <p className="about-text">
            Sourced directly from the lush valleys of Nueva Vizcaya. 
            Fresh, organic, and traditionally prepared with a modern vision.
          </p>
          
          <p className="about-subtext">
            We believe in a progressive harmony of nature and plate. Our culinary approach takes a forward-thinking view of dining, using contemporary techniques to reimagine traditional concepts. By sourcing pure, seasonal ingredients and treating them with modern precision, we unlock ancestral flavors in entirely new ways. It’s conscious, creative cuisine designed for the modern palate.
          </p>
          
        </div>
      </div>
    </section>
  );
}