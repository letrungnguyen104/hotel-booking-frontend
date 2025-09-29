import React from 'react'
import "./ListRoomSearch.scss";
import Search from '@/components/Search/Search';
import { Card, Rate, Slider, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons'

const roomList = [
  {
    id: 1,
    name: "Golden Lotus Grand Da Nang",
    location: "Phước Mỹ, Da Nang - 2.5 km to center",
    price: "₫1,454,250",
    oldPrice: "₫4,539,555",
    discount: "-69%",
    rating: 5,
    score: 9.3,
    review: "Exceptional",
    reviewCount: 7327,
    offers: ["Breakfast", "Free fitness center access", "World Tourism Day Sale"],
    image:
      "https://pix8.agoda.net/hotelImages/63227000/0/bb9bcb3b36fa90f9c77276bd89f883ae.jpg?ce=0&s=375x",
  },
  {
    id: 2,
    name: "Cordial Grand Hotel",
    location: "An Hai Bac, Da Nang - 1.7 km to center",
    price: "₫505,172",
    oldPrice: "₫1,550,000",
    discount: "-67%",
    rating: 4,
    score: 8.4,
    review: "Excellent",
    reviewCount: 2031,
    offers: ["Breakfast", "Sea View", "Domestic Deal"],
    image:
      "https://pix8.agoda.net/hotelImages/64896973/0/ea760dc311d7749c106a56a6044e9760.jpeg?ce=0&s=375x",
  },
  {
    id: 3,
    name: "Muong Thanh Luxury Da Nang hotel",
    location: "Phuoc My, Da Nang - 2.5 km to center",
    price: "₫899,000",
    oldPrice: "₫1,800,000",
    discount: "-50%",
    rating: 4,
    score: 8.7,
    review: "Very Good",
    reviewCount: 4120,
    offers: ["Breakfast", "Swimming Pool", "Free Wi-Fi"],
    image:
      "https://pix8.agoda.net/hotelImages/219/2190907/2190907_17080417080054905485.jpg?ca=6&ce=1&s=375x",
  },
  {
    id: 4,
    name: "Da Nang Central Luxury Hotel",
    location: "Hai Chau, Da Nang - 1 km to Dragon Bridge",
    price: "₫1,250,000",
    oldPrice: "₫2,500,000",
    discount: "-50%",
    rating: 5,
    score: 9.0,
    review: "Superb",
    reviewCount: 2950,
    offers: ["Free cancellation", "Gym", "Spa service"],
    image:
      "https://pix8.agoda.net/hotelImages/33985059/-1/77afd0c92c0bdee0d86e7bcf09b38d49.jpg?ce=0&s=208x117&ar=16x9",
  },
  {
    id: 5,
    name: "Ocean View Boutique Hotel",
    location: "Son Tra, Da Nang - 3 km to city center",
    price: "₫620,000",
    oldPrice: "₫1,200,000",
    discount: "-48%",
    rating: 3,
    score: 7.9,
    review: "Good",
    reviewCount: 1765,
    offers: ["Breakfast", "Near Beach", "Airport Shuttle"],
    image:
      "https://pix8.agoda.net/property/33985059/856131796/d7ef0d1e446f99a4baba959fb13bae76.jpeg?ce=0&s=208x117&ar=16x9",
  },
  {
    id: 6,
    name: "Melia Vinpearl Danang Riverfront",
    location: "An Hai Bac, Da Nang - 0.4 km to center",
    price: "₫770,000",
    oldPrice: "₫1,400,000",
    discount: "-45%",
    rating: 4,
    score: 8.1,
    review: "Very Good",
    reviewCount: 2209,
    offers: ["Breakfast included", "Free parking", "Rooftop Bar"],
    image:
      "https://pix8.agoda.net/hotelImages/4947690/-1/f5dd1db7b2125faf6a1210227979f529.jpg?ce=0&s=1024x",
  },
  {
    id: 7,
    name: "Palm Garden Resort Da Nang",
    location: "Non Nuoc Beach, Da Nang - 5 km to Marble Mountains",
    price: "₫2,050,000",
    oldPrice: "₫3,800,000",
    discount: "-46%",
    rating: 5,
    score: 9.1,
    review: "Wonderful",
    reviewCount: 3810,
    offers: ["Private beach", "Spa", "Family friendly"],
    image:
      "https://pix8.agoda.net/hotelImages/33985059/-1/69c240730e90112a2afc26aa668014a4.jpg?ce=0&s=208x117&ar=16x9",
  },
];

const ListRoomSearch = () => {
  return (
    <>
      <div className="search-bar">
        <Search />
      </div>
      <div className="main-content">
        {/* Sidebar trái (bộ lọc) */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Khách sạn ở Đà Nẵng</h3>

          {/* Budget */}
          <div className="filter-group">
            <h4>Budget (per night)</h4>
            <Slider range defaultValue={[300000, 5000000]} min={0} max={5000000} step={50000} />
            <div className="price-inputs">
              <input type="number" defaultValue={300000} /> -{" "}
              <input type="number" defaultValue={5000000} />
            </div>
            <p className="price-range">300.000 ₫ – 5.000.000 ₫</p>
          </div>

          {/* Giá mỗi đêm */}
          <div className="filter-group">
            <h4>Giá mỗi đêm</h4>
            <label><input type="checkbox" /> Dưới 500.000 ₫</label>
            <label><input type="checkbox" /> 500.000 ₫ – 1.000.000 ₫</label>
            <label><input type="checkbox" /> 1.000.000 ₫ – 2.000.000 ₫</label>
            <label><input type="checkbox" /> 2.000.000 ₫ – 5.000.000 ₫</label>
            <label><input type="checkbox" /> Trên 5.000.000 ₫</label>
          </div>

          {/* Hạng sao */}
          <div className="filter-group">
            <h4>Hạng sao</h4>
            <label><Rate disabled defaultValue={5} /></label>
            <label><Rate disabled defaultValue={4} /></label>
            <label><Rate disabled defaultValue={3} /></label>
          </div>

          {/* Tiện nghi */}
          <div className="filter-group">
            <h4>Tiện nghi</h4>
            <label><input type="checkbox" /> Wi-Fi miễn phí</label>
            <label><input type="checkbox" /> Hồ bơi</label>
            <label><input type="checkbox" /> Nhà hàng</label>
          </div>

          {/* Vị trí */}
          <div className="filter-group">
            <h4>Vị trí</h4>
            <label><input type="checkbox" /> Bãi biển Mỹ Khê</label>
            <label><input type="checkbox" /> Sông Hàn</label>
            <label><input type="checkbox" /> Trung tâm thành phố</label>
          </div>

          {/* Đánh giá */}
          <div className="filter-group">
            <h4>Đánh giá</h4>
            <label><input type="checkbox" /> Xuất sắc (8+)</label>
            <label><input type="checkbox" /> Rất tốt (8+)</label>
            <label><input type="checkbox" /> Tốt (7+)</label>
          </div>
        </aside>

        {/* Phần chính giữa */}
        <section className="hotel-list-section">
          <div className="list-header">
            <h2>Kết quả tìm kiếm</h2>
            <div className="sort-box">
              <label>Sắp xếp:</label>
              <select>
                <option value="popular">Phổ biến nhất</option>
                <option value="priceLow">Giá thấp nhất</option>
                <option value="priceHigh">Giá cao nhất</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          <div className="hotel-list">
            {roomList.map((room) => (
              <Card
                key={room.id}
                className="hotel-card"
                hoverable
                onClick={() => handleHotelClick(room)}
                style={{ cursor: "pointer" }}
              >
                {/* Bên trái: ảnh */}
                <div className="hotel-card__left">
                  <img src={room.image} alt={room.name} />
                  <span className="hotel-card__score">{room.score}</span>
                </div>

                {/* Bên phải: thông tin */}
                <div className="hotel-card__right">
                  <div className="hotel-card__header">
                    <h3 className="hotel-card__title">{room.name}</h3>
                    <div className="hotel-card__rating">
                      <Rate disabled defaultValue={room.rating} />
                    </div>
                  </div>

                  <div className="hotel-card__location">
                    <EnvironmentOutlined /> {room.location}
                  </div>

                  <div className="hotel-card__offers">
                    {room.offers.map((offer, idx) => (
                      <Tag key={idx} color="blue">
                        {offer}
                      </Tag>
                    ))}
                  </div>

                  <div className="hotel-card__footer">
                    <div className="hotel-card__price">
                      <span className="old-price">{room.oldPrice}</span>
                      <span className="new-price">{room.price}</span>
                      <span className="discount">{room.discount}</span>
                      <p className="free-cancel">+ FREE CANCELLATION</p>
                    </div>

                    <div className="hotel-card__review">
                      <span className="score-box">{room.score}</span>
                      <span className="review-text">{room.review}</span>
                      <p className="review-count">{room.reviewCount} reviews</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Phân trang */}
          <div className="pagination">
            <button className="page-btn">{'<'}</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">{'>'}</button>
          </div>
        </section>
      </div>
    </>
  )
}

export default ListRoomSearch