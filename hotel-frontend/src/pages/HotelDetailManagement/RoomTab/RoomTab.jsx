// src/pages/HotelAdmin/RoomTab.jsx/RoomTab.jsx

import React, { useEffect, useState } from "react";
import { Select, Card, Button, Tag, message, Modal, Form, Input, InputNumber, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getRoomTypesByHotel } from "@/service/roomTypeService";
import { getRoomsByHotel, createRoom, updateRoom, deleteRoom } from "@/service/roomService";
import Swal from 'sweetalert2';
import { toast } from "sonner";

const RoomTab = ({ hotelId }) => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomData, roomTypeData] = await Promise.all([
        getRoomsByHotel(hotelId),
        getRoomTypesByHotel(hotelId)
      ]);
      setRooms(roomData || []);
      setRoomTypes(roomTypeData || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load room data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const handleAddEdit = (room = null) => {
    setEditingRoom(room);
    if (room) {
      form.setFieldsValue({
        floor: room.floor,
        roomNumber: room.roomNumber,
        status: room.status,
      });
    } else {
      // Add mode: reset form
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      if (editingRoom) {
        console.log(editingRoom.id);
        const result = await updateRoom(editingRoom.id, values);
        if (result) {
          toast.success(`Room ${values.roomNumber} updated successfully!`);
        } else {
          toast.error('Update failed!');
        }
      } else {
        const result = await createRoom(values);
        if (result) {
          toast.success(`Room ${values.roomNumber} created successfully!`);
        } else {
          toast.error('Create failed!');
        }
      }

      setIsModalOpen(false);
      fetchData(); // Reload data
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (room) => {
    console.log(room.id);
    console.log(room);
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete Room ${room.roomNumber}. This action might affect existing bookings!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (room.status !== 'BOOKED') {
            await deleteRoom(room.id);
            toast.success(`Room ${room.roomNumber} has been deleted!`);
            fetchData();
          } else {
            toast.warning(`Room ${room.roomNumber} is being booked!`);
          }
        } catch (error) {
          toast.error("Failed to delete the room.");
        }
      }
    });
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  const filteredRooms = filterType
    ? rooms.filter(r => r.roomTypeName === filterType)
    : rooms;

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + pageSize);

  return (
    <div className="room-tab">
      <div className="flex justify-between mb-4">
        <Select
          placeholder="Filter by Room Type"
          style={{ width: 240 }}
          onChange={setFilterType}
          allowClear
          options={roomTypes.map(rt => ({ label: rt.name, value: rt.name }))}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAddEdit(null)}>
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sử dụng mảng đã được phân trang */}
        {paginatedRooms.map(room => (
          <Card
            key={room.id}
            title={`Room ${room.roomNumber}`}
            loading={loading}
            extra={<Tag color={room.status === "AVAILABLE" ? "green" : room.status === "BOOKED" ? "red" : "orange"}>{room.status}</Tag>}
          >
            <p><strong>Floor:</strong> {room.floor}</p>
            <p><strong>Type:</strong> {room.roomTypeName}</p>
            <p><strong>Capacity:</strong> {room.capacity} person(s)</p>
            <p><strong>Price:</strong> ${room.pricePerNight?.toFixed(2)}</p>
            <div className="mt-3 flex gap-2">
              <Button size="small" icon={<EditOutlined />} onClick={() => handleAddEdit(room)}>Edit</Button>
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(room)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredRooms.length > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredRooms.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      <Modal
        title={editingRoom ? `Edit Room ${editingRoom.roomNumber}` : "Add a New Room"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isSubmitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="roomForm">
          {!editingRoom && (
            <Form.Item
              name="roomTypeId"
              label="Room Type"
              rules={[{ required: true, message: "Please select a room type!" }]}
            >
              <Select placeholder="Select a type">
                {roomTypes.map(rt => (
                  <Select.Option key={rt.id} value={rt.id}>{rt.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="roomNumber"
            label="Room Number"
            rules={[{ required: true, message: "Please enter the room number!" }]}
          >
            <Input placeholder="e.g., 101, A203" />
          </Form.Item>

          <Form.Item
            name="floor"
            label="Floor"
            rules={[{ required: true, message: "Please enter the floor number!" }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          {editingRoom && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status!" }]}
            >
              <Select>
                <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
                <Select.Option value="MAINTENANCE">MAINTENANCE</Select.Option>
                <Select.Option value="CLOSED">CLOSED</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default RoomTab;