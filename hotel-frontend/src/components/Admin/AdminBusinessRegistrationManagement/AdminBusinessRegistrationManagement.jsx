// src/pages/Admin/AdminBusinessRegistrationManagement/AdminBusinessRegistrationManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Spin, Empty, Tag, Button, message, Space, Modal, Descriptions, Select, Input, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getAllBusinessProfiles, verifyBusinessProfile, deleteBusinessProfile } from '@/service/hotelAdminService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import './AdminBusinessRegistrationManagement.scss';

const { Option } = Select;
const { Search } = Input;

const AdminBusinessRegistrationManagement = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [filters, setFilters] = useState({ searchText: '', status: 'ALL' });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await getAllBusinessProfiles();
      setProfiles(data || []);
    } catch (error) {
      message.error("Failed to load business profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesStatus = filters.status === 'ALL' ||
        (filters.status === 'PENDING' && profile.verified === 0) ||
        (filters.status === 'VERIFIED' && profile.verified === 1);

      const matchesSearch = filters.searchText === '' ||
        profile.businessName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        profile.owner.username.toLowerCase().includes(filters.searchText.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [profiles, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleVerify = (profile) => {
    Swal.fire({
      title: `Approve this business?`,
      text: `Do you want to verify "${profile.businessName}" and grant HOTEL_ADMIN role to ${profile.owner.username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#52c41a',
      confirmButtonText: 'Yes, verify!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await verifyBusinessProfile(profile.id);
          toast.success("Business profile verified successfully!");
          fetchProfiles();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to verify.");
        }
      }
    });
  };

  const handleDelete = (profile) => {
    Swal.fire({
      title: `Delete profile #${profile.id}?`,
      text: `This will delete the business profile "${profile.businessName}" and remove the HOTEL_ADMIN role from ${profile.owner.username}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteBusinessProfile(profile.id);
          console.log(response);
          toast.success("Profile deleted successfully.");
          fetchProfiles();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to delete.");
        }
      }
    });
  };

  const handleViewDetails = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 60
    },
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 200,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'username'],
      key: 'owner',
      width: 150,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Owner Email',
      dataIndex: ['owner', 'email'],
      key: 'email',
      width: 250,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Tax Code',
      dataIndex: 'taxCode',
      key: 'taxCode',
      width: 150,
      ellipsis: true,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>
    },
    {
      title: 'Status',
      dataIndex: 'verified',
      key: 'verified',
      width: 120,
      render: (verified) => (
        verified === 1
          ? <Tag color="green" icon={<CheckCircleOutlined />}>Verified</Tag>
          : <Tag color="gold" icon={<ClockCircleOutlined />}>Pending</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          {record.verified === 0 && (
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVerify(record)}>
              Verify
            </Button>
          )}
          <Button danger icon={<CloseCircleOutlined />} onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="admin-business-management">
        <Card title="Business Registration Management">
          <Space style={{ marginBottom: 16, width: '100%' }}>
            <Search
              placeholder="Search by Business Name or Owner..."
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
              <Option value="VERIFIED">Verified</Option>
            </Select>
          </Space>
          <Table
            columns={columns}
            dataSource={filteredProfiles}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Modal
        title="Business Profile Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>]}
        width={800}
      >
        {selectedProfile && (
          <Descriptions bordered column={1} layout="horizontal">
            <Descriptions.Item label="Profile ID">{selectedProfile.id}</Descriptions.Item>
            <Descriptions.Item label="Owner Username">{selectedProfile.owner.username}</Descriptions.Item>
            <Descriptions.Item label="Owner Email">{selectedProfile.owner.email}</Descriptions.Item>
            <Descriptions.Item label="Business Name">{selectedProfile.businessName}</Descriptions.Item>
            <Descriptions.Item label="Business Address">{selectedProfile.businessAddress}</Descriptions.Item>
            <Descriptions.Item label="Tax Code">{selectedProfile.taxCode}</Descriptions.Item>
            <Descriptions.Item label="License Number">{selectedProfile.licenseNumber}</Descriptions.Item>
            <Descriptions.Item label="Bank Account">{selectedProfile.bankAccount}</Descriptions.Item>
            <Descriptions.Item label="ID Card/Passport">{selectedProfile.idCardOrPassport}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedProfile.verified === 1
                ? <Tag color="green">Verified</Tag>
                : <Tag color="gold">Pending</Tag>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AdminBusinessRegistrationManagement;