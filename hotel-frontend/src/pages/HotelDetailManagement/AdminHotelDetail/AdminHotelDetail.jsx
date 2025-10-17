import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Tabs, Carousel, Spin, Tag, Rate, Descriptions, Button, message } from "antd";
import { getHotelById } from "@/service/hotelService";
import "./AdminHotelDetail.scss";
import RoomTypeTab from "../RoomTypeTab/RoomTypeTab";
import RoomTab from "../RoomTab/RoomTab";
import EditHotelModal from "@/components/EditHotelModal/EditHotelModal";
import SpecialPriceTab from "../SpecialTab/SpecialTab";
import ServiceTab from "../ServiceTab/ServiceTab";

const { TabPane } = Tabs;

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchHotel = async () => {
    try {
      const data = await getHotelById(id);
      console.log(data);
      setHotel(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load hotel details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );

  if (!hotel) return <p>No hotel found</p>;

  const tabItems = [
    {
      key: "1",
      label: "Room Types",
      children: <RoomTypeTab hotelId={id} />,
    },
    {
      key: "2",
      label: "Rooms",
      children: <RoomTab hotelId={id} />,
    },
    {
      key: "3",
      label: "Special Prices",
      children: <SpecialPriceTab hotelId={id} />,
    },
    {
      key: "4",
      label: "Services",
      children: <ServiceTab hotelId={id} />
    },
  ];

  return (
    <div className="hotel-detail">
      {/* Header */}
      <div className="hotel-header">
        <div className="hotel-header__carousel">
          <Carousel autoplay>
            {hotel.images?.length > 0 ? (
              hotel.images.map((img, index) => (
                <div key={index}>
                  <img src={`${img}`} alt={`Hotel ${index}`} />
                </div>
              ))
            ) : (
              <img src="/fallback.jpg" alt="No images" />
            )}
          </Carousel>
        </div>

        <div className="hotel-header__info">
          <Card title={hotel.name} variant="borderless">
            <Rate disabled value={hotel.rating || 0} />
            <Tag color={hotel.status === "ACTIVE" ? "green" : "orange"} style={{ marginLeft: 8 }}>
              {hotel.status}
            </Tag>
            <Descriptions column={1} bordered size="small" className="mt-3">
              <Descriptions.Item label="Address">{hotel.address}</Descriptions.Item>
              <Descriptions.Item label="Phone">{hotel.phone}</Descriptions.Item>
              <Descriptions.Item label="Owner">{hotel.owner.username}</Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(hotel.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Description">{hotel.description}</Descriptions.Item>
            </Descriptions>
            <Button
              type="primary"
              className="mt-3"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Hotel
            </Button>
          </Card>
        </div>
      </div>

      <div className="hotel-tabs mt-6">
        <Tabs
          defaultActiveKey="1"
          items={tabItems}
        />
      </div>

      <EditHotelModal
        open={editModalOpen}
        hotelId={id}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => fetchHotel()}
      />

    </div>
  );
};

export default HotelDetail;