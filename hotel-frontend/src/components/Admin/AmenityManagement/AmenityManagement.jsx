import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "@/service/amenityService";
import "./AmenityManagement.scss";

const AmenityManagement = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const [form] = Form.useForm();

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const data = await getAmenities();
      const sortedData = (data || []).sort((a, b) => b.id - a.id);
      setAmenities(sortedData);
    } catch (error) {
      toast.error("Failed to load amenities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const filteredAmenities = useMemo(() => {
    if (!searchText) return amenities;
    return amenities.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [amenities, searchText]);

  const handleOpenModal = (amenity = null) => {
    setEditingAmenity(amenity);
    if (amenity) {
      form.setFieldsValue({ name: amenity.name });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      if (editingAmenity) {
        await updateAmenity(editingAmenity.id, { name: values.name });
        toast.success("Amenity updated successfully!");
      } else {
        await createAmenity({ name: values.name });
        toast.success("Amenity created successfully!");
      }

      setIsModalOpen(false);
      fetchAmenities();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteAmenity(id);
          if (response.code === 1001) {
            Swal.fire("Deleted!", "Your amenity has been deleted.", "success");
          } else {
            Swal.fire({
              icon: "error",
              title: "Amenity in use",
              text: errorMessage,
            });
          }
          fetchAmenities();
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.response?.data?.result || "Something went wrong!";
          Swal.fire({
            icon: "error",
            title: "Cannot Delete",
            text: errorMessage,
          });
        }
      }
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Amenity Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="amenity-management">
      <div className="page-header">
        <div>
          <h2 className="page-title">Amenity Management</h2>
          <p className="page-subtitle">Manage hotel facilities and services</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => handleOpenModal(null)}
        >
          Add New Amenity
        </Button>
      </div>

      <Card bordered={false} className="table-card">
        <div className="table-toolbar">
          <Input
            placeholder="Search amenity..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAmenities}
            loading={loading}
          >
            Refresh
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAmenities}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={editingAmenity ? "Edit Amenity" : "Add New Amenity"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        centered
      >
        <Form form={form} layout="vertical" name="amenityForm">
          <Form.Item
            name="name"
            label="Amenity Name"
            rules={[
              { required: true, message: "Please enter amenity name!" },
              { min: 2, message: "Name must be at least 2 characters." },
            ]}
          >
            <Input placeholder="e.g. Swimming Pool, WiFi, Gym..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AmenityManagement;