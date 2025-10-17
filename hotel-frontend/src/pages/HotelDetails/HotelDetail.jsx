// src/pages/HotelDetails/HotelDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Tag, Rate, Image, Button, Row, Col, Empty } from "antd";
import { EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getHotelById } from "@/service/hotelService";
import { getAvailableRoomTypes } from "@/service/roomTypeService";
import Search from "@/components/Search/Search"; // ✅ 1. Import component Search
import "./HotelDetails.scss";
import { toast } from "sonner";
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const HotelDetail = () => {
  const { id } = useParams();
  const searchState = useSelector(state => state.searchReducer);

  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logic lấy ngày tháng từ Redux hoặc dùng ngày mặc định
  const checkIn = searchState.dates?.[0]
    ? dayjs(searchState.dates[0]).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD');

  const checkOut = searchState.dates?.[1]
    ? dayjs(searchState.dates[1]).format('YYYY-MM-DD')
    : dayjs().add(1, 'day').format('YYYY-MM-DD');

  useEffect(() => {
    const fetchHotelData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [hotelData, roomTypeData] = await Promise.all([
          getHotelById(id),
          getAvailableRoomTypes(id, checkIn, checkOut)
        ]);
        setHotel(hotelData);
        setRoomTypes(roomTypeData || []);
      } catch (err) {
        setError("Failed to load hotel details. Please try again later.");
        toast.error("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelData();
  }, [id, checkIn, checkOut]); // useEffect sẽ tự chạy lại khi checkIn/checkOut thay đổi

  if (loading) {
    return <div className="hotel-detail-loading"><Spin size="large" /></div>;
  }
  if (error || !hotel) {
    return <div className="hotel-detail-error"><h1>Hotel not found</h1><p>{error}</p></div>;
  }

  return (
    <div className="hotel-detail">

      {/* ✅ 2. Thêm component Search vào đây */}
      <div className="hotel-detail__search-bar">
        <Search />
      </div>

      <h1>{hotel.name}</h1>
      <div className="hotel-rating-header">
        <Rate disabled allowHalf value={hotel.rating || 0} />
        <span className="review-summary">{hotel.rating?.toFixed(1)} Excellent</span>
        <span>({hotel.reviewCount} reviews)</span>
        <Tag color={hotel.status === "ACTIVE" ? "green" : "orange"} style={{ marginLeft: 16 }}>
          {hotel.status}
        </Tag>
      </div>
      <p className="hotel-location"><EnvironmentOutlined /> {hotel.address}</p>

      <div className="gallery-section">
        <Image.PreviewGroup>
          <Row gutter={[8, 8]}>
            {hotel.images?.slice(0, 5).map((img, index) => (
              <Col key={index} span={index === 0 ? 12 : 6}>
                <Image
                  wrapperClassName={index === 0 ? 'main-image-wrapper' : 'thumb-image-wrapper'}
                  src={img}
                  alt={`Hotel gallery ${index + 1}`}
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      </div>

      <div className="description-section">
        <h3>About this property</h3>
        <p>{hotel.description}</p>
      </div>

      <div className="rooms-section">
        <h3>Available Room Types from {dayjs(checkIn).format('DD/MM/YYYY')} to {dayjs(checkOut).format('DD/MM/YYYY')}</h3>
        {roomTypes.length > 0 ? roomTypes.map(rt => {
          const isAvailable = rt.status === 'ACTIVE' && (rt.availableRoomsCount === undefined || rt.availableRoomsCount > 0);
          return (
            <Card key={rt.id} className={`room-card-customer ${!isAvailable ? 'disabled' : ''}`}>
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} md={8}>
                  <Image
                    src={rt.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={rt.name}
                    className="room-image"
                  />
                </Col>
                <Col xs={24} md={10}>
                  <h4>{rt.name}</h4>
                  <p>{rt.description}</p>
                  <div className="amenities-list">
                    {rt.amenities?.slice(0, 4).map(amenity => (
                      <span key={amenity.id} className="amenity-tag"><CheckCircleOutlined /> {amenity.name}</span>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={6} className="booking-details">
                  <div className="price-info">
                    <span className="price-label">Starts from</span>
                    <span className="price-value">${rt.pricePerNight?.toFixed(2)}</span>
                    <span className="price-suffix">/ night</span>
                  </div>
                  {isAvailable ? (
                    rt.availableRoomsCount !== undefined && (
                      <Tag color={rt.availableRoomsCount > 5 ? "green" : "orange"}>
                        Only {rt.availableRoomsCount} rooms left!
                      </Tag>
                    )
                  ) : (
                    <Tag color="red">Unavailable</Tag>
                  )}
                  <Button type="primary" className="booking-button" disabled={!isAvailable}>
                    {isAvailable ? 'Book Now' : 'Not Available'}
                  </Button>
                </Col>
              </Row>
            </Card>
          );
        }) : (
          <Empty description={checkIn ? "No available room types found for the selected dates." : "No room types available for this hotel."} />
        )}
      </div>
    </div>
  );
};

export default HotelDetail;