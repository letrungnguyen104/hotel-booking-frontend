import React, { useEffect, useState } from "react";
import { Select, Card, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getRoomsByHotel } from "@/service/roomService";
import { getRoomTypesByHotel } from "@/service/roomTypeService";

const RoomTab = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomData, roomTypeData] = await Promise.all([
          getRoomsByHotel(hotelId),
          getRoomTypesByHotel(hotelId)
        ]);

        setRooms(roomData);
        setRoomTypes(roomTypeData.map(rt => rt.name));
      } catch (err) {
        console.error(err);
        message.error("Failed to load rooms or room types");
      }
    };

    fetchData();
  }, [hotelId]);

  const filteredRooms = filterType
    ? rooms.filter(r => r.roomTypeName === filterType)
    : rooms;

  return (
    <div className="room-tab">
      <div className="flex justify-between mb-3">
        <Select
          placeholder="Filter by Room Type"
          style={{ width: 200 }}
          onChange={setFilterType}
          allowClear
          options={roomTypes.map(type => ({ label: type, value: type }))}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredRooms.map(room => (
          <Card
            key={room.id}
            title={`Room ${room.roomNumber}`}
            extra={
              <Tag
                color={
                  room.status === "AVAILABLE"
                    ? "green"
                    : room.status === "BOOKED"
                      ? "red"
                      : "orange"
                }
              >
                {room.status}
              </Tag>
            }
          >
            <p><strong>Floor:</strong> {room.floor}</p>
            <p><strong>Type:</strong> {room.roomTypeName}</p>
            <p><strong>Capacity:</strong> {room.capacity} persons</p>
            <p><strong>Price:</strong> ${room.pricePerNight}</p>
            <div className="mt-2 flex gap-2">
              <Button size="small">Edit</Button>
              <Button size="small" danger>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomTab;