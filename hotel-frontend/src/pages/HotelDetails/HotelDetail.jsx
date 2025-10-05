import React from "react";
import { useParams } from "react-router-dom";
import "./HotelDetails.scss";

// Import các component HotelDetail tĩnh
import HotelDetail1 from "./HotelDetails1";
import HotelDetail2 from "./HotelDetails2";
import HotelDetail3 from "./HotelDetails3";
import HotelDetail4 from "./HotelDetails4";
import HotelDetail5 from "./HotelDetails5";
import HotelDetail6 from "./HotelDetails6";
import HotelDetail7 from "./HotelDetails7";

// Component động để hiển thị chi tiết khách sạn dựa trên ID
const HotelDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL

  // Mapping ID với component tương ứng
  const hotelComponents = {
    "1": HotelDetail1,
    "2": HotelDetail2,
    "3": HotelDetail3,
    "4": HotelDetail4,
    "5": HotelDetail5,
    "6": HotelDetail6,
    "7": HotelDetail7,
  };

  // Lấy component tương ứng với ID
  const HotelComponent = hotelComponents[id];

  // Nếu không tìm thấy, hiển thị thông báo lỗi
  if (!HotelComponent) {
    return (
      <div className="hotel-detail">
        <h1>Không tìm thấy khách sạn</h1>
        <p>Khách sạn với ID {id} không tồn tại.</p>
      </div>
    );
  }

  return <HotelComponent />;
};

export default HotelDetail;

