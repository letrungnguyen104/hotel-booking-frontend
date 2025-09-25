import React from "react";
import "./Contactpage.css";

const Contactpage = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="subtitle">
          Have questions or need support? Get in touch with us.
        </p>

        <div className="contact-content">
          {/* Form liên hệ */}
          <div className="contact-form">
            <h2>Send us a message</h2>
            <form>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="Your email" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows="5" placeholder="Write your message..." required></textarea>
              </div>

              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>

          {/* Thông tin liên hệ */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p><strong>📍 Address:</strong> 123 Nguyen Van Linh, Da Nang, Vietnam</p>
            <p><strong>📞 Phone:</strong> +84 123 456 789</p>
            <p><strong>✉️ Email:</strong> support@hotelbooking.com</p>

            {/* Google Map (tuỳ chọn) */}
            <div className="map-container">
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.1046504936!2d108.2219633153679!3d16.04720014567202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219cf01000001%3A0xa90f0b6f2e3d9b77!2zQ-G7rWEgR8OyIFRydW5n!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contactpage;
