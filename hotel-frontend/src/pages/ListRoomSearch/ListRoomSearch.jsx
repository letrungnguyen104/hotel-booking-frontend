import React from 'react';
import "./ListRoomSearch.scss";
import Search from '@/components/Search/Search';
import HotelList from '../RoomListHome/RoomListHome';
import { Slider, Rate } from "antd";

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

          <HotelList />

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
  );
};

export default ListRoomSearch;
