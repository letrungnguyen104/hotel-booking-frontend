import React from "react";
import "./HotelDetails.scss";

const HotelDetail5 = () => (
  <div className="hotel-detail">
    <h1>Ocean View Boutique Hotel</h1>

    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/property/33985059/856131796/d7ef0d1e446f99a4baba959fb13bae76.jpeg?ce=0&s=208x117&ar=16x9"
          alt="Ocean View Boutique Hotel"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> Sơn Trà, Đà Nẵng - 3 km đến trung tâm thành phố</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫620,000</span>
          <span className="old-price">₫1,200,000</span>
          <div className="discount-badge">-48% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">7.9</div>
          <div className="review-text">Tốt</div>
          <div className="review-count">1,765 đánh giá</div>
        </div>
      </div>
    </div>

    <div className="description-section">
      <h3>Giới thiệu khách sạn</h3>
      <p>
        Ocean View Boutique Hotel mang đến trải nghiệm nghỉ dưỡng thoải mái với tầm nhìn
        hướng biển tuyệt đẹp. Khách sạn nằm gần bãi biển Mỹ Khê, chỉ cách trung tâm thành phố
        khoảng 10 phút di chuyển. Với phong cách hiện đại và dịch vụ chuyên nghiệp, đây là lựa chọn lý tưởng
        cho cả kỳ nghỉ thư giãn và chuyến công tác.
      </p>
    </div>

    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Bữa sáng</span>
        <span className="amenity-tag">Gần bãi biển</span>
        <span className="amenity-tag">Xe đưa đón sân bay</span>
        <span className="amenity-tag">Dịch vụ phòng 24/7</span>
        <span className="amenity-tag">Wi-Fi miễn phí</span>
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
      ĐẶT PHÒNG NGAY - ₫620,000
    </button>
  </div>
);

export default HotelDetail5;
