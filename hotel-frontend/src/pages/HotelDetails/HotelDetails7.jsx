import React from "react";
import "./HotelDetails.scss";

const HotelDetail7 = () => (
  <div className="hotel-detail">
    <h1>Palm Garden Resort Da Nang</h1>

    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/33985059/-1/69c240730e90112a2afc26aa668014a4.jpg?ce=0&s=208x117&ar=16x9"
          alt="Palm Garden Resort Da Nang"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p><b>Vị trí:</b> Bãi biển Non Nước, Đà Nẵng - 5 km đến Ngũ Hành Sơn</p>
        </div>

        <div className="price-section">
          <span className="current-price">₫2,050,000</span>
          <span className="old-price">₫3,800,000</span>
          <div className="discount-badge">-46% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">9.1</div>
          <div className="review-text">Tuyệt vời</div>
          <div className="review-count">3,810 đánh giá</div>
        </div>
      </div>
    </div>

    <div className="description-section">
      <h3>Giới thiệu khách sạn</h3>
      <p>
        Palm Garden Resort Da Nang là khu nghỉ dưỡng cao cấp nằm dọc bãi biển Non Nước thơ mộng,
        được bao quanh bởi những khu vườn nhiệt đới xanh mát. Với kiến trúc tinh tế kết hợp giữa hiện đại
        và truyền thống, khu nghỉ mang đến không gian yên bình, gần gũi với thiên nhiên.
      </p>
      <p>
        Resort đặc biệt phù hợp cho các gia đình và cặp đôi đang tìm kiếm một kỳ nghỉ thư giãn.
        Chỉ mất vài phút lái xe, bạn có thể đến Ngũ Hành Sơn hoặc trung tâm thành phố Đà Nẵng,
        thuận tiện cho việc tham quan, mua sắm và trải nghiệm ẩm thực địa phương.
      </p>
    </div>

    <div className="amenities-section">
      <h3>Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag">Bãi biển riêng</span>
        <span className="amenity-tag">Spa & Massage</span>
        <span className="amenity-tag">Thân thiện với gia đình</span>
        <span className="amenity-tag">Hồ bơi ngoài trời</span>
        <span className="amenity-tag">Nhà hàng hải sản</span>
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
      ĐẶT PHÒNG NGAY - ₫2,050,000
    </button>
  </div>
);

export default HotelDetail7;
