import React from "react";
import "./HotelDetails.scss";

const HotelDetail3 = () => (
  <div className="hotel-detail">
    {/* Tiêu đề khách sạn */}
    <h1>Muong Thanh Luxury Da Nang Hotel</h1>

    {/* Ảnh + thông tin chính */}
    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/219/2190907/2190907_17080417080054905485.jpg?ca=6&ce=1&s=750x"
          alt="Muong Thanh Luxury Da Nang Hotel"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> Phước Mỹ, Đà Nẵng - 2.5 km đến trung tâm</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫899,000</span>
          <span className="old-price">₫1,800,000</span>
          <div className="discount-badge">-50% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">8.7</div>
          <div className="review-text">Rất tốt</div>
          <div className="review-count">4,120 đánh giá</div>
        </div>
      </div>
    </div>

    {/* Mô tả khách sạn */}
    <div className="description-section">
      <h3>Giới thiệu khách sạn</h3>
      <p>
        Muong Thanh Luxury Đà Nẵng là khách sạn 5 sao nổi bật bên bờ biển Mỹ Khê,
        với kiến trúc sang trọng, tiện nghi hiện đại và dịch vụ chuẩn quốc tế.
        Nơi đây là lựa chọn lý tưởng cho du khách nghỉ dưỡng và công tác tại Đà Nẵng.
      </p>
    </div>

    {/* Tiện nghi */}
    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Bữa sáng miễn phí</span>
        <span className="amenity-tag">Hồ bơi</span>
        <span className="amenity-tag">Wi-Fi miễn phí</span>
        <span className="amenity-tag">Phòng gym</span>
        <span className="amenity-tag">Dịch vụ spa</span>
      </div>
    </div>

    {/* Các loại phòng */}
    <div className="rooms-section">
      <h3>Các loại phòng</h3>
      <div className="room-card">
        <h4>Phòng Deluxe</h4>
        <p>Diện tích: 30m² - 1 giường đôi</p>
        <p>Giá: ₫899,000 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
      <div className="room-card">
        <h4>Phòng Suite Hướng Biển</h4>
        <p>Diện tích: 45m² - 1 giường King - View biển</p>
        <p>Giá: ₫1,500,000 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
    </div>

    {/* Đánh giá */}
    <div className="reviews-section">
      <h3>Đánh giá từ khách hàng</h3>
      <div className="review">
        <p><b>Minh Tuấn:</b> "Khách sạn sang trọng, dịch vụ tốt, đáng tiền."</p>
      </div>
      <div className="review">
        <p><b>Lan Anh:</b> "Hồ bơi rộng, gần biển, view rất đẹp."</p>
      </div>
      <div className="review">
        <p><b>Hoàng Nam:</b> "Nhân viên chuyên nghiệp, ăn sáng phong phú."</p>
      </div>
    </div>

    {/* Bản đồ */}
    <div className="map-section">
      <h3>Vị trí trên bản đồ</h3>
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

    {/* Nút đặt phòng tổng */}
    <button className="booking-button">
      ĐẶT PHÒNG NGAY - ₫899,000
    </button>
  </div>
);

export default HotelDetail3;
