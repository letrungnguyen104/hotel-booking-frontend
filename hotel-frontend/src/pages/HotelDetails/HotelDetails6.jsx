import React from "react";
import "./HotelDetails.scss";

const HotelDetail6 = () => (
  <div className="hotel-detail">
    <h1>Melia Vinpearl Danang Riverfront</h1>

    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/4947690/-1/f5dd1db7b2125faf6a1210227979f529.jpg?ce=0&s=1024x"
          alt="Melia Vinpearl Danang Riverfront"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> An Hải Bắc, Đà Nẵng - 0.4 km đến trung tâm</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫770,000</span>
          <span className="old-price">₫1,400,000</span>
          <div className="discount-badge">-45% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">8.1</div>
          <div className="review-text">Rất tốt</div>
          <div className="review-count">2,209 đánh giá</div>
        </div>
      </div>
    </div>

    <div className="description-section">
      <h3>Giới thiệu khách sạn</h3>
      <p>
        Melia Vinpearl Danang Riverfront nằm bên bờ sông Hàn, mang đến trải nghiệm sang trọng với
        tầm nhìn tuyệt đẹp ra cầu Rồng và trung tâm thành phố. Khách sạn kết hợp phong cách hiện đại
        với dịch vụ tiêu chuẩn quốc tế, là lựa chọn lý tưởng cho cả khách du lịch và khách công tác.
      </p>
      <p>
        Với vị trí chỉ cách trung tâm 5 phút đi bộ, khách sạn dễ dàng kết nối tới các điểm tham quan
        nổi tiếng như chợ Hàn, bãi biển Mỹ Khê và bán đảo Sơn Trà. Hệ thống phòng nghỉ được thiết kế tinh tế,
        đầy đủ tiện nghi và mang lại không gian thoải mái cho kỳ nghỉ của bạn.
      </p>
    </div>

    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Bữa sáng bao gồm</span>
        <span className="amenity-tag">Đỗ xe miễn phí</span>
        <span className="amenity-tag">Bar trên sân thượng</span>
        <span className="amenity-tag">Hồ bơi ngoài trời</span>
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
      ĐẶT PHÒNG NGAY - ₫770,000
    </button>
  </div>
);

export default HotelDetail6;
