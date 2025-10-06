// src/components/AddHotelModal/AddHotelModal.jsx
import React, { useState } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { createHotel } from "@/service/hotelService";
import { getUserIdFromToken } from "@/service/tokenService";

const { TextArea } = Input;

const AddHotelModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const ownerId = getUserIdFromToken();
      const request = {
        ownerId,
        ...values,
      };

      const formData = new FormData();
      formData.append("request", JSON.stringify(request));

      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      await createHotel(formData);

      message.success("Hotel created successfully!");
      form.resetFields();
      setFileList([]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to create hotel");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    multiple: true,
    listType: "picture-card",
    beforeUpload: () => false, // không upload ngay, chỉ lưu local
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
  };

  return (
    <Modal
      title="Add New Hotel"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Create"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Hotel Name"
          rules={[{ required: true, message: "Please enter hotel name" }]}
        >
          <Input placeholder="Enter hotel name" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "Please enter city" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: "Please enter country" }]}
        >
          <Input placeholder="Enter country" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Hotel description" />
        </Form.Item>

        <Form.Item label="Upload Images">
          <Upload {...uploadProps}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddHotelModal;