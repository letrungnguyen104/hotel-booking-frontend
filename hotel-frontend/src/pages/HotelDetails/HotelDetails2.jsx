import React from "react";
import "./HotelDetails.scss";

const HotelDetail2 = () => (
  <div className="hotel-detail">
    {/* Tiêu đề khách sạn */}
    <h1>Cordial Grand Hotel</h1>

    {/* Ảnh và thông tin chính */}
    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/64896973/0/ea760dc311d7749c106a56a6044e9760.jpeg?ce=0&s=750x"
          alt="Cordial Grand Hotel"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> An Hải Bắc, Đà Nẵng - 1.7 km đến trung tâm</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫505,172</span>
          <span className="old-price">₫1,550,000</span>
          <div className="discount-badge">-67% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">8.4</div>
          <div className="review-text">Tuyệt vời</div>
          <div className="review-count">2,031 đánh giá</div>
        </div>
      </div>
    </div>

    {/* Mô tả khách sạn */}
    <div className="description-section">
      <h3>Giới thiệu khách sạn</h3>
      <p>
        Cordial Grand Hotel tọa lạc tại khu vực An Hải Bắc, cách bãi biển Mỹ Khê chỉ vài phút đi bộ.
        Với dịch vụ lưu trú hiện đại, hồ bơi trong nhà và phòng nghỉ sang trọng,
        khách sạn là lựa chọn lý tưởng cho cả du lịch nghỉ dưỡng và công tác.
      </p>
    </div>

    {/* Tiện nghi */}
    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Bữa sáng miễn phí</span>
        <span className="amenity-tag">Tầm nhìn biển</span>
        <span className="amenity-tag">Deal nội địa</span>
        <span className="amenity-tag">Dịch vụ spa & massage</span>
        <span className="amenity-tag">Wifi miễn phí</span>
      </div>
    </div>

    {/* Các loại phòng */}
    <div className="rooms-section">
      <h3>Các loại phòng</h3>
      <div className="room-card">
        <h4>Phòng Superior</h4>
        <p>Diện tích: 28m² - 1 giường đôi</p>
        <p>Giá: ₫505,172 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
      <div className="room-card">
        <h4>Phòng Deluxe Sea View</h4>
        <p>Diện tích: 35m² - 1 giường King - View biển</p>
        <p>Giá: ₫780,000 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
    </div>

    {/* Đánh giá khách hàng */}
    <div className="reviews-section">
      <h3>Đánh giá từ khách hàng</h3>
      <div className="review">
        <p><b>Hồng Mai:</b> "Phòng sạch sẽ, nhân viên thân thiện, giá hợp lý."</p>
      </div>
      <div className="review">
        <p><b>Quốc Anh:</b> "Gần biển, đi lại tiện lợi. Ăn sáng ngon."</p>
      </div>
      <div className="review">
        <p><b>Lan Phương:</b> "View đẹp, nhiều tiện nghi hiện đại. Rất hài lòng."</p>
      </div>
    </div>

    {/* Bản đồ vị trí */}
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
      ĐẶT PHÒNG NGAY - ₫505,172
    </button>
  </div>
);

export default HotelDetail2;
