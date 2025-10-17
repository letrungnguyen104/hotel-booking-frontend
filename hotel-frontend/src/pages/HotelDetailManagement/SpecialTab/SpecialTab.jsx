// src/pages/HotelAdmin/SpecialPriceTab/SpecialPriceTab.jsx

import React, { useState, useEffect } from 'react';
import { Select, Table, Button, Modal, Form, DatePicker, InputNumber, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoomTypesByHotelForHotelAdmin } from '@/service/roomTypeService';
import { getSpecialPricesByRoomType, createSpecialPrice, deleteSpecialPrice } from '@/service/specialPriceService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SpecialPriceTab = ({ hotelId }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
  const [specialPrices, setSpecialPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getRoomTypesByHotelForHotelAdmin(hotelId)
      .then(data => setRoomTypes(data || []))
      .catch(() => message.error("Failed to load room types."));
  }, [hotelId]);

  const fetchSpecialPrices = async (roomTypeId) => {
    if (!roomTypeId) {
      setSpecialPrices([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getSpecialPricesByRoomType(roomTypeId);
      setSpecialPrices(data || []);
    } catch (error) {
      message.error("Failed to load special prices.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomTypeChange = (value) => {
    setSelectedRoomTypeId(value);
    fetchSpecialPrices(value);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      const requestData = {
        roomTypeId: selectedRoomTypeId,
        startDate: dayjs(values.dates[0]).format('YYYY-MM-DD'),
        endDate: dayjs(values.dates[1]).format('YYYY-MM-DD'),
        price: values.price,
      };
      await createSpecialPrice(requestData);
      toast.success("Special price added successfully!");
      setIsModalOpen(false);
      fetchSpecialPrices(selectedRoomTypeId);
    } catch (error) {
      toast.error("Failed to add special price. Please check the date range.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This special price period will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSpecialPrice(id);
          toast.success("Special price deleted successfully.");
          fetchSpecialPrices(selectedRoomTypeId);
        } catch (error) {
          toast.error("Failed to delete the special price.");
        }
      }
    });
  };

  const columns = [
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (text) => dayjs(text).format('DD/MM/YYYY') },
    { title: 'Special Price (VND)', dataIndex: 'price', key: 'price', render: (price) => price.toLocaleString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (<Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Delete</Button>),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Select
          style={{ width: 300 }}
          placeholder="Select a Room Type to manage prices"
          onChange={handleRoomTypeChange}
          allowClear
        >
          {roomTypes.map(rt => (
            <Select.Option key={rt.id} value={rt.id}>{rt.name}</Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={!selectedRoomTypeId}
        >
          Add Special Price
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={specialPrices}
        rowKey="id"
        loading={loading}
        bordered
        title={() => `Special prices for: ${roomTypes.find(rt => rt.id === selectedRoomTypeId)?.name || '...'}`}
      />

      <Modal
        title="Add New Special Price"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="dates" label="Date Range" rules={[{ required: true, message: "Please select a date range!" }]}>
            <RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
          <Form.Item name="price" label="Special Price (VND)" rules={[{ required: true, message: "Please enter a price!" }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/[^\d]/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecialPriceTab;