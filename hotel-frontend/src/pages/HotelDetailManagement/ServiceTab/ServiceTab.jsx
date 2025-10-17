// src/pages/HotelAdmin/ServiceTab/ServiceTab.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { getServicesByHotelForHotelAdmin, createService, updateService, deleteService } from '@/service/serviceService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

const { Option } = Select;

const ServiceTab = ({ hotelId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const [filters, setFilters] = useState({
    type: 'ALL',
    status: 'ALL',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getServicesByHotelForHotelAdmin(hotelId);
      setServices(data || []);
    } catch (error) {
      message.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [hotelId]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const statusMatch = filters.status === 'ALL' || service.status === filters.status;
      const typeMatch = filters.type === 'ALL' || service.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [services, filters]);


  const handleAddEdit = (service = null) => {
    setEditingService(service);
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      if (editingService) {
        await updateService(editingService.id, values);
        toast.success("Service updated successfully!");
      } else {
        await createService({ ...values, hotelId });
        toast.success("Service created successfully!");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (service) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will set the status of "${service.name}" to INACTIVE!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteService(service.id);
          toast.success(`Service "${service.name}" has been deactivated.`);
          fetchServices();
        } catch (error) {
          toast.error('Failed to deactivate service.');
        }
      }
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Price (VND)', dataIndex: 'price', key: 'price', render: (price) => price.toLocaleString(), sorter: (a, b) => a.price - b.price },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleAddEdit(record)}>Edit</Button>
          {record.status === 'ACTIVE' && (
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Deactivate</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Select
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            style={{ width: 150 }}
          >
            <Option value="ALL">All Statuses</Option>
            <Option value="ACTIVE">Active</Option>
            <Option value="INACTIVE">Inactive</Option>
          </Select>
          <Select
            value={filters.type}
            onChange={(value) => handleFilterChange('type', value)}
            style={{ width: 180 }}
          >
            <Option value="ALL">All Types</Option>
            <Option value="FOOD">Food & Beverage</Option>
            <Option value="LAUNDRY">Laundry Service</Option>
            <Option value="TRANSPORT">Transportation</Option>
          </Select>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAddEdit(null)}
        >
          Add Service
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredServices}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title={editingService ? "Edit Service" : "Add New Service"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE' }}>
          <Form.Item name="name" label="Service Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Service Type" rules={[{ required: true }]}>
            <Select placeholder="Select a type">
              <Option value="FOOD">Food & Beverage</Option>
              <Option value="LAUNDRY">Laundry Service</Option>
              <Option value="TRANSPORT">Transportation</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Price (VND)" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          {editingService && (
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Option value="ACTIVE">ACTIVE</Option>
                <Option value="INACTIVE">INACTIVE</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceTab;