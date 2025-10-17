import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DollarOutlined,
  AppstoreOutlined,
  UserOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { getRoomTypesByHotel, getRoomTypesByHotelForHotelAdmin } from "@/service/roomTypeService";
import { getAmenities } from "@/service/amenityService";
import "./RoomTypeTab.scss";
import { toast } from "sonner";
import { updateRoomType } from "@/service/roomTypeService";
import { createRoomType } from "@/service/roomTypeService";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { deleteRoomType } from "@/service/roomTypeService";

const { Option } = Select;

const RoomTypeTab = ({ hotelId }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // State mới cho loading button
  const [form] = Form.useForm();

  const statusColor = {
    ACTIVE: "green",
    CLOSED: "volcano",
    MAINTENANCE: "gold",
  };

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const data = await getRoomTypesByHotelForHotelAdmin(hotelId);
      const reversed = (data || []).reverse();
      setRoomTypes(reversed);
      setFilteredTypes(reversed);
    } catch (err) {
      console.error(err);
      message.error("Failed to load room types");
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const data = await getAmenities();
      setAmenities(data);
    } catch {
      message.error("Failed to load amenities");
    }
  };

  useEffect(() => {
    if (hotelId) {
      fetchRoomTypes();
      fetchAmenities();
    }
  }, [hotelId]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    if (value === "ALL") setFilteredTypes(roomTypes);
    else setFilteredTypes(roomTypes.filter((r) => r.status === value));
  };

  const handleAddEdit = (type = null) => {
    setEditingType(type);
    if (type) {
      form.setFieldsValue({
        name: type.name,
        capacity: type.capacity,
        pricePerNight: type.pricePerNight,
        description: type.description,
        status: type.status,
        amenityIds: type.amenities?.map((a) => a.id) || [],
      });
      setFileList(
        type.images?.map((url, i) => ({
          uid: `old-${i}`,
          name: `image-${i}`,
          status: "done",
          url: url,
        })) || []
      );
    } else {
      form.resetFields();
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleCreateRoomType = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const formData = new FormData();
      const request = {
        hotelId,
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        pricePerNight: values.pricePerNight,
        amenityIds: values.amenityIds || [],
      };

      formData.append("request", JSON.stringify(request));
      fileList.forEach((f) => {
        if (f.originFileObj) formData.append("files", f.originFileObj);
      });

      const res = await createRoomType(formData);
      if (res) {
        toast.success("Room type created successfully!");
        fetchRoomTypes(); // Tải lại danh sách
        setIsModalVisible(false);
      } else {
        message.error("Failed to create room type");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating room type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoomType = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const formData = new FormData();
      const request = {
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        pricePerNight: values.pricePerNight,
        status: values.status,
        amenityIds: values.amenityIds || [],
      };
      formData.append("request", JSON.stringify(request));

      const remainingImageUrls = fileList
        .filter(file => file.url && !file.originFileObj)
        .map(file => file.url);
      formData.append("remainingImages", JSON.stringify(remainingImageUrls));

      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      const res = await updateRoomType(editingType.id, formData);
      if (res) {
        toast.success("Room type updated successfully!");
        fetchRoomTypes();
        setIsModalVisible(false);
      } else {
        message.error("Failed to update room type");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating room type");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // Giữ nguyên hàm này
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "The room will be marked as CLOSED!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await deleteRoomType(id);
        if (response != null && response != undefined) {
          await Swal.fire({
            title: "Deleted!",
            text: "The room type has been successfully deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          await fetchRoomTypes();
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete room type.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting.",
        icon: "error",
      });
    }
  };

  const columns = [
    // Giữ nguyên columns
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      render: (imgs) => (
        <img
          src={
            imgs?.length
              ? `${imgs[0]}`
              : "https://via.placeholder.com/80x60?text=No+Image"
          }
          alt="room"
          width={80}
          height={60}
          style={{ borderRadius: 6, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>
          <AppstoreOutlined className="mr-1" /> {text}
        </span>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (num) => (
        <span>
          <UserOutlined className="mr-1" /> {num} person(s)
        </span>
      ),
    },
    {
      title: "Price/Night",
      dataIndex: "pricePerNight",
      key: "pricePerNight",
      render: (price) => (
        <span>
          <DollarOutlined className="mr-1" /> ${price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleAddEdit(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="room-type-tab-table">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Room Types</h2>
        <Space>
          <Select
            value={statusFilter}
            style={{ width: 180 }}
            onChange={handleFilterChange}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="ALL">All Status</Option>
            <Option value="ACTIVE">Active</Option>
            <Option value="CLOSED">Closed</Option>
            <Option value="MAINTENANCE">Maintenance</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddEdit()}
          >
            Add Room Type
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTypes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 6 }}
        bordered
      />

      <Modal
        title={editingType ? "Edit Room Type" : "Add Room Type"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={editingType ? handleUpdateRoomType : handleCreateRoomType}
        width={700}
        okButtonProps={{ loading: isSubmitting }} // Thêm prop này
        destroyOnClose // Thêm prop này để tự reset form
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "ACTIVE", capacity: 2 }}
        >
          {/* Các Form.Item giữ nguyên */}
          <Form.Item
            name="name"
            label="Room Type Name"
            rules={[{ required: true, message: "Please enter room name" }]}
          >
            <Input placeholder="e.g. Deluxe Room" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please enter capacity" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            name="pricePerNight"
            label="Price per Night ($)"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          {editingType && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="ACTIVE">Active</Option>
                <Option value="CLOSED">Closed</Option>
                <Option value="MAINTENANCE">Maintenance</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="amenityIds"
            label="Amenities"
            rules={[{ required: true, message: "Please select at least one amenity" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select amenities"
              options={amenities.map((a) => ({
                label: a.name,
                value: a.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter room description" />
          </Form.Item>

          <Form.Item label="Upload Images">
            <Upload
              multiple
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              onPreview={(file) => window.open(file.url || file.thumbUrl)}
            >
              {fileList.length >= 6 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomTypeTab;