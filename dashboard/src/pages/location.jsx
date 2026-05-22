import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import './location.css';

import storeFrontImg from '../assets/location.jpg';
import mascotSignImg from '../assets/location2.jpg';

export default function Location() {
  return (
    <div className="location-page">
      <div className="location-hero">
        <span className="location-sub">Visit Us</span>
        <h1 className="location-title">Our Location</h1>
        <p className="location-lead">Drop by for fresh flavors, traditionally prepared with a modern vision.</p>
      </div>

      <div className="location-single-container">
        <div className="location-details-card">
          <div className="detail-section">
            <div className="detail-header">
              <MapPin className="detail-icon" />
              <h3>Address</h3>
            </div>
            <p className="detail-text">
             Domang, Dupax Del Sur, Nueva Vizcaya, Philippines
            </p>
          </div>

          <div className="detail-section">
            <div className="detail-header">
              <Clock className="detail-icon" />
              <h3>Operating Hours</h3>
            </div>
            <ul className="hours-list">
              <li><span>Monday - Friday:</span> <strong>9:00 AM - 6:00 PM</strong></li>
              <li><span>Saturday:</span> <strong>10:00 AM - 6:00 PM</strong></li>
              <li><span>Sunday:</span> <strong>Closed</strong></li>
            </ul>
          </div>

          <div className="detail-section">
            <div className="detail-header">
              <Phone className="detail-icon" />
          
             </div>
          </div>

          <div className="map-embed-container">
            <p>
              <iframe
                title="CantoBox Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d489953.51347064227!2d121.01183595679469!3d16.38604758509893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3390038df3634081%3A0x8ec8c4e42777176!2sNueva%20Vizcaya!5e0!3m2!1sen!2sph!4v1716000000000!5m2!1sen!2sph"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="location-map-iframe"
              ></iframe>
            </p>
          </div>
        </div>
      </div>

      <div className="store-gallery-section">
        <h2 className="gallery-title">Spot the White Signboard</h2>
        <p className="gallery-subtitle">Look out for our signature curly-haired mascot cloud sign!</p>

        <div className="store-gallery-grid">
          <div className="store-img-card">
            <img 
              src={storeFrontImg} 
              alt="Our Storefront Layout" 
              className="gallery-image"
            />
            <div className="img-overlay">
              <span>OUR STOREFRONT</span>
            </div>
          </div>
          
          <div className="store-img-card">
            <img 
              src={mascotSignImg} 
              alt="CantoBox Mascot Cloud Sign" 
              className="gallery-image"
            />
            <div className="img-overlay">
              <span>CANTOBOX SIGN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}