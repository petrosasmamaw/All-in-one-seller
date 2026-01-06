import React from "react";
import {
  FaUserEdit,
  FaBoxOpen,
  FaComments,
  FaStore,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const SellerFooter = () => {
  return (
    <footer className="footer seller-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>MyMarket — Seller</h2>
          <p>
            Manage your shop, showcase your items or services, and connect
            directly with clients through real-time chat.
          </p>
        </div>

        <div className="footer-section">
          <h4>Seller Features</h4>
          <ul>
            <li><FaUserEdit /> Create & Update Profile</li>
            <li><FaBoxOpen /> Add & Manage Items</li>
            <li><FaStore /> Control Store Visibility</li>
            <li><FaComments /> Chat With Clients</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><FaEnvelope /> admin@mymarket.com</li>
            <li><FaPhoneAlt /> +251 9XX XXX XXX</li>
            <li><FaMapMarkerAlt /> Ethiopia, Bahir Dar</li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyMarket Seller Dashboard
      </div>
    </footer>
  );
};

export default SellerFooter;
