import React, { useEffect, useState } from "react";
import { Select, Card, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const RoomTab = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const mockRooms = [
    {
      id: 1,
      name: "Deluxe Room 101",
      floor: 1,
      roomType: "Deluxe",
      capacity: 2,
      price: 80,
      status: "AVAILABLE",
    },
    {
      id: 2,
      name: "Standard Room 102",
      floor: 1,
      roomType: "Standard",
      capacity: 2,
      price: 50,
      status: "OCCUPIED",
    },
    {
      id: 3,
      name: "Family Suite 201",
      floor: 2,
      roomType: "Suite",
      capacity: 4,
      price: 120,
      status: "AVAILABLE",
    },
    {
      id: 4,
      name: "Single Room 103",
      floor: 1,
      roomType: "Single",
      capacity: 1,
      price: 40,
      status: "MAINTENANCE",
    },
  ];

  useEffect(() => {
    try {
      setRooms(mockRooms);
      setRoomTypes([...new Set(mockRooms.map((r) => r.roomType))]);
    } catch (err) {
      console.error(err);
      message.error("Failed to load rooms");
    }
  }, [hotelId]);

  const filteredRooms = filterType
    ? rooms.filter((r) => r.roomType === filterType)
    : rooms;

  return (
    <div className="room-tab">
      <div className="flex justify-between mb-3">
        <Select
          placeholder="Filter by Room Type"
          style={{ width: 200 }}
          onChange={(value) => setFilterType(value)}
          allowClear
          options={roomTypes.map((type) => ({ label: type, value: type }))}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            title={room.name}
            extra={
              <Tag
                color={
                  room.status === "AVAILABLE"
                    ? "green"
                    : room.status === "OCCUPIED"
                      ? "red"
                      : "orange"
                }
              >
                {room.status}
              </Tag>
            }
          >
            <p>
              <strong>Floor:</strong> {room.floor}
            </p>
            <p>
              <strong>Type:</strong> {room.roomType}
            </p>
            <p>
              <strong>Capacity:</strong> {room.capacity} persons
            </p>
            <p>
              <strong>Price:</strong> ${room.price}
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="small">Edit</Button>
              <Button size="small" danger>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomTab;