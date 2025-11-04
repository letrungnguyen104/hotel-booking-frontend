import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { createHotel } from "@/service/hotelService";
import { getUserIdFromToken } from "@/service/tokenService";
import { getProvinces } from "@/service/locationService";

const { TextArea } = Input;
const { Option } = Select;

const AddHotelModal = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    getProvinces().then(data => {
      if (data) {
        setProvinces(data.map(p => ({ value: p.name, label: p.name })));
      }
    });
  }, []);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

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

      message.success("Hotel created successfully! Please wait for Admin approval.");
      form.resetFields();
      setFileList([]);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to create hotel");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    multiple: true,
    listType: "picture-card",
    beforeUpload: () => false,
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
    onRemove: (file) => {
      setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    }
  };

  const filterProvinces = (input, option) =>
    (option?.label ?? '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  return (
    <Modal
      title="Add New Hotel"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Create"
      width={700}
      destroyOnClose
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
          name="city"
          label="City / Province"
          rules={[{ required: true, message: "Please select a city/province" }]}
        >
          <Select
            showSearch
            placeholder="Select or search for your province"
            options={provinces}
            filterOption={filterProvinces}
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address (Street, Ward, District)"
          rules={[{ required: true, message: "Please enter the detailed address" }]}
        >
          <Input placeholder="E.g., 123 Nguyen Van Linh, Hai Chau District" />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[{ required: true, message: "Please enter country" }]}
          S       >
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