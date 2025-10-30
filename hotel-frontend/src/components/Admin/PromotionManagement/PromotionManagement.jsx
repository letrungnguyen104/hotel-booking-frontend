// src/pages/Admin/PromotionManagement/PromotionManagement.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, DatePicker, Select, InputNumber, Checkbox, Upload, message, Tag, Row, Col, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getAllPromotionsForAdmin, createPromotion, updatePromotion, deletePromotion } from '@/service/promotionService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import './PromotionManagement.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAllPromotionsForAdmin();
      console.log(data);
      const normalized = (data || []).map(p => ({
        ...p,
        isFeatured: p.featured === true || p.featured === 'true' || p.featured === 1
      }));
      setPromotions(normalized);
    } catch (error) {
      message.error("Failed to load promotions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAdd = () => {
    setEditingPromotion(null);
    form.resetFields();
    form.setFieldsValue({ status: 'SCHEDULED', isFeatured: false });
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleEdit = (promo) => {
    setEditingPromotion(promo);
    form.setFieldsValue({
      title: promo.title,
      code: promo.code,
      description: promo.description,
      discountPercent: promo.discountPercent,
      maxDiscountAmount: promo.maxDiscountAmount,
      minSpend: promo.minSpend,
      status: promo.status,
      dates: [dayjs(promo.startDate), dayjs(promo.endDate)],
      isFeatured: promo.isFeatured
    });

    if (promo.imageUrl) {
      setFileList([{
        uid: '-1',
        name: promo.imageUrl.split('/').pop(),
        status: 'done',
        url: promo.imageUrl,
      }]);
    } else {
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleDelete = (promo) => {
    Swal.fire({
      title: `Deactivate '${promo.title}'?`,
      text: "This will set the promotion to INACTIVE.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePromotion(promo.id);
          toast.success("Promotion deactivated.");
          fetchPromotions();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to deactivate.");
        }
      }
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { dates, isFeatured, ...rest } = values;
      const [startDate, endDate] = dates;

      const request = {
        ...rest,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        isFeatured: !!isFeatured, // Đảm bảo là boolean
        imageUrl: null
      };

      console.log("Submitting values:", values);
      console.log("Built request object:", request);

      const formData = new FormData();

      const newFile = fileList.find(f => f.originFileObj);
      if (newFile) {
        formData.append("file", newFile.originFileObj);
      } else if (fileList.length > 0) {
        request.imageUrl = fileList[0].url;
      }

      formData.append("request", JSON.stringify(request));

      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, formData);
        toast.success("Promotion updated successfully!");
      } else {
        await createPromotion(formData);
        toast.success("Promotion created successfully!");
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => url ? <Avatar shape="square" size={64} src={url} /> : <Avatar shape="square" size={64} />
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Code', dataIndex: 'code', key: 'code', render: (code) => code ? <Tag color="geekblue">{code}</Tag> : 'N/A' },
    { title: 'Discount', dataIndex: 'discountPercent', key: 'discountPercent', render: (val) => `${val}%` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'}>{status}</Tag> },
    { title: 'Featured', dataIndex: 'isFeatured', key: 'isFeatured', render: (val) => val ? 'Yes' : 'No' },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Deactivate</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="promotion-management-page">
      <Card title="Promotion Management" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create Promotion
        </Button>
      }>
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="id"
          loading={loading}
          bordered
        />
      </Card>

      <Modal
        title={editingPromotion ? "Edit Promotion" : "Create Promotion"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="Promo Code (Optional)">
                <Input placeholder="e.g., GIAM10" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="discountPercent" label="Discount (%)" rules={[{ required: true }]}>
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="maxDiscountAmount" label="Max Discount (VND)">
                <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minSpend" label="Min Spend (VND)">
                <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dates" label="Duration (Start - End)" rules={[{ required: true }]}>
                <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value="SCHEDULED">Scheduled</Option>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="INACTIVE">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isFeatured" valuePropName="checked" initialValue={false}>
            <Checkbox>Mark as "Featured" (Show on Homepage)</Checkbox>
          </Form.Item>

          <Form.Item label="Promotion Image (Optional)">
            <Upload
              listType="picture"
              fileList={fileList}
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => setFileList([])}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {editingPromotion ? "Save Changes" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionManagement;