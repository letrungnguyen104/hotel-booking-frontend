import React from "react";
import "./HotelDetails.scss";

const HotelDetail1 = () => (
  <div className="hotel-detail">
    {/* Tiêu đề khách sạn */}
    <h1>Golden Lotus Grand Đà Nẵng</h1>

    {/* Ảnh và thông tin chính */}
    <div className="hotel-content">
      <div className="hotel-image">
        <img
          src="https://pix8.agoda.net/hotelImages/63227000/0/bb9bcb3b36fa90f9c77276bd89f883ae.jpg?ce=0&s=750x"
          alt="Golden Lotus Grand Da Nang"
        />
      </div>

      <div className="hotel-info">
        <div className="location-section">
          <p>
            <span className="location-icon"></span>
            <b>Vị trí:</b> Phước Mỹ, Đà Nẵng - 2.5 km đến trung tâm
          </p>
        </div>

        <div className="price-section">
          <span className="current-price">₫1,454,250</span>
          <span className="old-price">₫4,539,555</span>
          <div className="discount-badge">-69% GIẢM GIÁ</div>
        </div>

        <div className="rating-section">
          <div className="score">9.3</div>
          <div className="review-text">Xuất sắc</div>
          <div className="review-count">7,327 đánh giá</div>
        </div>
      </div>
    </div>

    {/* Mô tả khách sạn */}
    <div className="description-section">
      <h3> Giới thiệu khách sạn</h3>
      <p>
        Golden Lotus Grand Đà Nẵng nằm ở vị trí đắc địa gần biển Mỹ Khê, chỉ cách trung tâm thành phố 2.5 km.
        Khách sạn cung cấp hệ thống phòng hiện đại, hồ bơi ngoài trời và dịch vụ spa cao cấp,
        mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho du khách trong và ngoài nước.
      </p>
    </div>

    {/* Tiện nghi */}
    <div className="amenities-section">
      <h3>🏨 Tiện nghi khách sạn</h3>
      <div className="amenities-list">
        <span className="amenity-tag"> Bữa sáng miễn phí</span>
        <span className="amenity-tag"> Hồ bơi ngoài trời</span>
        <span className="amenity-tag"> Phòng gym miễn phí</span>
        <span className="amenity-tag"> Dịch vụ spa</span>
        <span className="amenity-tag"> Chỗ đậu xe miễn phí</span>
      </div>
    </div>

    {/* Thư viện ảnh */}
    <div className="gallery-section">
      <h3>Hình ảnh khác</h3>
      <div className="gallery">
        <img src="https://pix8.agoda.net/hotelImages/63227000/0/bb9bcb3b36fa90f9c77276bd89f883ae.jpg?ce=0&s=375x" alt="Hotel view" />
        <img src="https://pix8.agoda.net/hotelImages/33985059/-1/921c4b8b55ee83f794575f0779fd549b.jpg?ce=0&s=1024x" alt="Swimming pool" />
        <img src="https://pix8.agoda.net/hotelImages/33985059/-1/e39a8defb4a42c9977df96b2ccbefe57.jpg?ce=0&s=1024x" alt="Hotel room" />
      </div>
    </div>

    {/* Các loại phòng */}
    <div className="rooms-section">
      <h3> Các loại phòng</h3>
      <div className="room-card">
        <h4>Phòng Deluxe City View</h4>
        <p>Diện tích: 30m² - 1 giường đôi</p>
        <p>Giá: ₫1,454,250 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
      <div className="room-card">
        <h4>Phòng Suite Sea View</h4>
        <p>Diện tích: 45m² - 1 giường king + ban công hướng biển</p>
        <p>Giá: ₫2,200,000 / đêm</p>
        <button className="booking-button">Đặt ngay</button>
      </div>
    </div>

    {/* Đánh giá khách hàng */}
    <div className="reviews-section">
      <h3> Đánh giá từ khách hàng</h3>
      <div className="review">
        <p><b>Nguyễn Văn A:</b> "Khách sạn rất đẹp, nhân viên thân thiện, vị trí thuận tiện!"</p>
      </div>
      <div className="review">
        <p><b>Trần Thị B:</b> "Phòng sạch sẽ, view biển tuyệt vời. Sẽ quay lại lần sau."</p>
      </div>
      <div className="review">
        <p><b>Lê Minh C:</b> "Bữa sáng ngon, nhiều lựa chọn, hồ bơi rộng rãi."</p>
      </div>
    </div>

    {/* Bản đồ vị trí */}
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

    {/* Nút đặt phòng tổng */}
    <button className="booking-button">
      🏨 ĐẶT PHÒNG NGAY - ₫1,454,250
    </button>
  </div>
);

export default HotelDetail1;
