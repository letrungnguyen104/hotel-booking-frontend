import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spin, Empty, Image, Tag, Badge } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getUserIdFromToken } from "@/service/tokenService";
import { getHotelsByOwner } from "@/service/hotelService";
import { useNavigate } from "react-router";
import "./HotelManagement.scss"

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8081";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const ownerId = getUserIdFromToken();
        const hotelsData = await getHotelsByOwner(ownerId);
        setHotels(hotelsData || []);
      } catch (err) {
        console.error("Failed to fetch hotels:", err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  const getStatusTag = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Tag color="green">Active</Tag>;
      case "PENDING":
        return <Tag color="orange">Pending</Tag>;
      case "INACTIVE":
        return <Tag color="red">Inactive</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div className="hotel-management">
      <div className="header">
        <h2>My Hotels</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/hotel-admin-dashboard/create-hotel")}
        >
          Add New Hotel
        </Button>
      </div>

      {hotels.length === 0 ? (
        <Empty description="No hotels found. Add your first hotel!" />
      ) : (
        <Row gutter={[16, 16]}>
          {hotels.map((hotel) => (
            <Col xs={24} sm={12} md={8} lg={6} key={hotel.id}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={hotel.name}
                    src={
                      hotel.images && hotel.images.length > 0
                        ? `${BASE_URL}${hotel.images[0]}`
                        : "/fallback.jpg"
                    }
                    style={{ height: 200, objectFit: "cover" }}
                    preview={false}
                  />
                }
              >
                <Card.Meta
                  title={hotel.name}
                  description={
                    <>
                      <p>{hotel.city}, {hotel.country}</p>
                      <p className="text-gray-500">{hotel.phone}</p>
                      {getStatusTag(hotel.status)}
                    </>
                  }
                />
                <div className="mt-3 flex justify-between">
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    onClick={() =>
                      navigate(`/hotel-admin-dashboard/edit/${hotel.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    type="default"
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HotelManagement;