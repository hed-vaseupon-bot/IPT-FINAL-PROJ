import './contact.css';

export default function Contact() {
  return (
    <footer id="contact" className="contact-footer">
      <div className="contact-blob" />

      <div className="contact-container">
        <h2 className="contact-title">Get in Touch</h2>
        
        <p className="contact-description">
          We’d love to hear from you! Whether you have questions about our menu, 
          want to book a reservation, or just want to say hello, feel free to reach out.
        </p>

        <div className="contact-info">
          <div className="contact-item">  
            <h3 className="contact-item-title">Address</h3>
            <p className="contact-item-info">Domang, Dupax Del Sur, Nueva Vizcaya</p>
          </div>
          
          <div className="contact-item">
            <h3 className="contact-item-title">Facebook</h3>
            <p>Canto Box</p>
          </div>
          
          <div className="contact-item">
            <h3 className="contact-item-title">Instagram</h3>
            <p>canto_box</p>
          </div>
        </div>

      </div>
    </footer>
  );
}