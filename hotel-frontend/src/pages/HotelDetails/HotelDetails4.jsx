import React from "react";
import "./HotelDetails.scss";

const HotelDetail4 = () => (
  <div className="hotel-detail">
    <h1>Da Nang Central Luxury Hotel</h1>

    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/33985059/-1/77afd0c92c0bdee0d86e7bcf09b38d49.jpg?ce=0&s=208x117&ar=16x9"
          alt="Da Nang Central Luxury Hotel"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> Hải Châu, Đà Nẵng - 1 km đến Cầu Rồng</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫1,250,000</span>
          <span className="old-price">₫2,500,000</span>
          <div className="discount-badge">-50% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">9.0</div>
          <div className="review-text">Tuyệt hảo</div>
          <div className="review-count">2,950 đánh giá</div>
        </div>
      </div>
    </div>

    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Hủy miễn phí</span>
        <span className="amenity-tag">Phòng gym</span>
        <span className="amenity-tag">Dịch vụ Spa</span>
      </div>
    </div>

    <div className="map-section">
          <h3> Vị trí trên bản đồ</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.867563234535!2d108.243!3d16.0678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219d11cfb3dfb%3A0xb6d9fbb!2sMy%20Khe%20Beach!5e0!3m2!1sen!2s!4v1690000000"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Hotel Location"
          ></iframe>
        </div>

    <button className="booking-button">
      ĐẶT PHÒNG NGAY - ₫1,250,000
    </button>
  </div>
);

export default HotelDetail4;
