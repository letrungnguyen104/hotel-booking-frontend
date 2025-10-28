// src/components/Admin/AdminHotelManagement/AdminHotelManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Tag, message, Input, Select, Card, Modal, Descriptions, Form } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  StopOutlined,
  SendOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import { getAllHotelsForAdmin, approveHotel, rejectHotel, banHotel, unbanHotel } from '@/service/hotelService';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import './AdminHotelManagement.scss';
import { sendNotification } from '@/service/notificationService';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const AdminHotelManagement = () => {
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ searchText: '', status: 'ALL' });
  const [isNotifySubmitting, setIsNotifySubmitting] = useState(false);

  // State cho các Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [notifyForm] = Form.useForm();

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getAllHotelsForAdmin();
      setAllHotels(data || []);
    } catch (error) {
      message.error("Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const filteredHotels = useMemo(() => {
    return allHotels.filter(hotel => {
      const matchesStatus = filters.status === 'ALL' || hotel.status === filters.status;
      const matchesSearch = filters.searchText === '' ||
        hotel.name.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        hotel.owner.username.toLowerCase().includes(filters.searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [allHotels, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // --- Xử lý các hành động ---

  const handleApprove = async (id) => {
    try {
      await approveHotel(id);
      toast.success("Hotel approved successfully!");
      fetchHotels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve hotel.");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectHotel(id);
      toast.warning("Hotel has been rejected.");
      fetchHotels();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject hotel.");
    }
  };

  const handleBan = (hotel) => {
    Swal.fire({
      title: `Are you sure you want to ban "${hotel.name}"?`,
      text: "The hotel status will be set to INACTIVE.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, ban this hotel!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await banHotel(hotel.id);
          toast.success(`Hotel "${hotel.name}" has been banned.`);
          fetchHotels();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to ban hotel.');
        }
      }
    });
  };

  const handleUnban = async (hotel) => {
    try {
      await unbanHotel(hotel.id);
      toast.success(`Hotel "${hotel.name}" has been reactivated.`);
      fetchHotels();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reactivate hotel.');
    }
  };

  // Mở Modal xem chi tiết
  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setViewModalOpen(true);
  };

  // Mở Modal gửi thông báo
  const handleOpenNotifyModal = (hotel) => {
    setSelectedHotel(hotel);
    setNotifyModalOpen(true);
    notifyForm.resetFields();
  };

  const handleSendNotification = async (values) => {
    setIsNotifySubmitting(true);
    try {
      const requestData = {
        ...values,
        userId: selectedHotel.owner.id,
        type: "MANUAL_ADMIN"
      };

      console.log(requestData);
      const response = await sendNotification(requestData);
      if (response) {
        toast.success(`Notification sent to "${selectedHotel.name}"!`);
        setNotifyModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to send notification.");
    } finally {
      setIsNotifySubmitting(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'ACTIVE': return <Tag color="green">ACTIVE</Tag>;
      case 'PENDING': return <Tag color="blue">PENDING</Tag>;
      case 'CLOSED': return <Tag color="red">CLOSED</Tag>;
      case 'REJECTED': return <Tag color="volcano">REJECTED</Tag>;
      case 'INACTIVE': return <Tag color="grey">BANNED (INACTIVE)</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, width: 80 },
    { title: 'Hotel Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Owner', dataIndex: ['owner', 'username'], key: 'owner' },
    { title: 'City', dataIndex: 'city', key: 'city' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: getStatusTag, width: 120 },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 320,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            View
          </Button>

          {/* Hành động khi đang PENDING */}
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>
                Approve
              </Button>
              <Button danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>
                Reject
              </Button>
            </>
          )}

          {record.status === 'ACTIVE' && (
            <>
              <Button danger icon={<StopOutlined />} onClick={() => handleBan(record)}>
                Ban
              </Button>
              <Button icon={<SendOutlined />} onClick={() => handleOpenNotifyModal(record)}>
                Notify
              </Button>
            </>
          )}

          {(record.status === 'CLOSED' || record.status === 'REJECTED' || record.status === 'INACTIVE') && (
            <Button
              type="primary"
              icon={<CheckSquareOutlined />}
              onClick={() => handleUnban(record)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Re-activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-hotel-management">
      <Card title="Hotel Management">
        <Space style={{ marginBottom: 16, width: '100%' }}>
          <Search
            placeholder="Search by hotel name or owner..."
            onSearch={(value) => handleFilterChange('searchText', value)}
            onChange={(e) => handleFilterChange('searchText', e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            defaultValue="ALL"
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange('status', value)}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="ACTIVE">Active</Option>
            <Option value="CLOSED">Closed</Option>
            <Option value="REJECTED">Rejected</Option>
            <Option value="INACTIVE">Banned</Option>
          </Select>
        </Space>
        <Table
          columns={columns}
          dataSource={filteredHotels}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* MODAL XEM CHI TIẾT */}
      <Modal
        title="Hotel Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[<Button key="close" onClick={() => setViewModalOpen(false)}>Close</Button>]}
        width={700}
      >
        {selectedHotel && (
          <Descriptions bordered column={1} layout="horizontal">
            <Descriptions.Item label="Hotel ID">{selectedHotel.id}</Descriptions.Item>
            <Descriptions.Item label="Hotel Name">{selectedHotel.name}</Descriptions.Item>
            <Descriptions.Item label="Owner">{selectedHotel.owner.username}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(selectedHotel.status)}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedHotel.address}</Descriptions.Item>
            <Descriptions.Item label="City">{selectedHotel.city}</Descriptions.Item>
            <Descriptions.Item label="Country">{selectedHotel.country}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedHotel.phone}</Descriptions.Item>
            <Descriptions.Item label="Registered">{dayjs(selectedHotel.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedHotel.description}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* MODAL GỬI THÔNG BÁO */}
      <Modal
        title={`Send Notification to "${selectedHotel?.name}"`}
        open={notifyModalOpen}
        onCancel={() => setNotifyModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={notifyForm} layout="vertical" onFinish={handleSendNotification}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter notification title" />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter your message..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isNotifySubmitting}>
              Send Notification
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminHotelManagement;