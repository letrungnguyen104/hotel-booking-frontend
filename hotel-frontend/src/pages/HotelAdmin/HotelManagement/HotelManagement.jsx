import React, { useEffect, useState } from "react";
import {
  Button,
  Spin,
  Empty,
  Tag,
  Select,
  Rate,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getUserIdFromToken } from "@/service/tokenService";
import { getHotelsByOwner } from "@/service/hotelService";
import AddHotelModal from "@/components/AddHotelModal/AddHotelModal";
import { useNavigate } from "react-router";
import "./HotelManagement.scss";

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8081";

  // ✅ Fetch danh sách khách sạn
  const fetchHotels = async (status = null) => {
    setLoading(true);
    try {
      const ownerId = getUserIdFromToken();
      const hotelsData = await getHotelsByOwner(ownerId, status);
      setHotels(hotelsData || []);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
      message.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleStatusChange = async (value) => {
    setSelectedStatus(value);
    const status = value === "ALL" ? null : value;
    fetchHotels(status);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="hotel-management">
      {/* Header */}
      <div className="header">
        <h2>My Hotels</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add New Hotel
        </Button>
      </div>

      {/* Bộ lọc */}
      <div className="filter">
        <div className="filter__title">Filter</div>
        <div className="filter__status">
          <span>Status</span>
          <Select
            showSearch
            placeholder="Select Status"
            optionFilterProp="label"
            onChange={handleStatusChange}
            value={selectedStatus || "ALL"}
            options={[
              { value: "ALL", label: "ALL" },
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "PENDING", label: "PENDING" },
              { value: "CLOSED", label: "CLOSED" },
            ]}
          />
        </div>
      </div>

      {/* Danh sách khách sạn */}
      <div className="hotel-list">
        {hotels.length === 0 ? (
          <Empty description="No hotels found. Add your first hotel!" />
        ) : (
          hotels.map((hotel) => (
            <div className="hotel-item" key={hotel.id}>
              <div
                className="hotel-item__image"
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                <img
                  src={
                    hotel.images?.length > 0
                      ? `${BASE_URL}${hotel.images[0]}`
                      : "/fallback.jpg"
                  }
                  alt={hotel.name}
                />
              </div>

              <div className="hotel-item__body">
                <h3>{hotel.name}</h3>
                <div className="hotel-item__rating">
                  <Rate disabled value={hotel.rating} />
                </div>
                <p>
                  {hotel.city}, {hotel.country}
                </p>
                <p className="text-gray-500">{hotel.phone}</p>
                <div className="hotel-item__status">{getStatusTag(hotel.status)}</div>
              </div>

              <div className="hotel-item__actions">
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
            </div>
          ))
        )}
      </div>

      <AddHotelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchHotels(selectedStatus)}
      />
    </div>
  );
};

export default HotelManagement;