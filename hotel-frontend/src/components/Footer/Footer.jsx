import React from "react";
import "./Footer.scss";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__container">
          {/* Help */}
          <div className="footer__column">
            <h4 className="footer__title">Help</h4>
            <ul className="footer__list">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>Terms of Use</li>
              <li>Manage Cookie Settings</li>
              <li>Digital Services Act (EU)</li>
              <li>Content Guidelines</li>
              <li>Modern Slavery Act Statement</li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__column">
            <h4 className="footer__title">Company</h4>
            <ul className="footer__list">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
              <li>PointsMAX</li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="footer__column">
            <h4 className="footer__title">Destinations</h4>
            <ul className="footer__list">
              <li>Countries</li>
              <li>Flights</li>
            </ul>
          </div>

          {/* Partners */}
          <div className="footer__column">
            <h4 className="footer__title">Partners</h4>
            <ul className="footer__list">
              <li>YCS Partner Portal</li>
              <li>Partner Hub</li>
              <li>Advertise on Agoda</li>
              <li>Affiliate Partners</li>
              <li>Agoda API</li>
            </ul>
          </div>

          {/* Apps */}
          <div className="footer__column">
            <h4 className="footer__title">Get the App</h4>
            <ul className="footer__list">
              <li><AppleOutlined /> iOS App</li>
              <li><AndroidOutlined /> Android App</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2025 Agoda Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;