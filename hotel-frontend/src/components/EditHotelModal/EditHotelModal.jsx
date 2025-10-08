import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, Spin, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getHotelById, updateHotel } from "@/service/hotelService";
import { toast } from "sonner";

const { Option } = Select;

const EditHotelModal = ({ open, onClose, hotelId, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = "http://localhost:8081";

  useEffect(() => {
    if (open && hotelId) fetchHotelData();
  }, [open, hotelId]);

  const fetchHotelData = async () => {
    setLoading(true);
    try {
      const hotel = await getHotelById(hotelId);
      form.setFieldsValue({
        name: hotel.name,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        phone: hotel.phone,
        description: hotel.description,
        status: hotel.status,
      });

      if (hotel.images && hotel.images.length > 0) {
        setFileList(
          hotel.images.map((url, index) => ({
            uid: String(index),
            name: url.split("/").pop(),
            status: "done",
            url: `${BASE_URL}${url}`,
          }))
        );
      }
    } catch (err) {
      message.error("Failed to load hotel info");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("request", JSON.stringify(values));
      const remainingImages = fileList
        .filter((file) => !file.originFileObj && file.url)
        .map((file) => file.url.replace(BASE_URL, ""));

      formData.append("remainingImages", JSON.stringify(remainingImages));
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      await updateHotel(hotelId, formData);
      toast.success("Update hotel successfully!")
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating hotel:", err);
      toast.error("Failed to update hotel!");
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Hotel"
      onCancel={onClose}
      onOk={handleOk}
      okText="Save Changes"
      width={600}
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item label="Hotel Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter hotel name" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Enter address" />
          </Form.Item>

          <Form.Item label="City" name="city">
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item label="Country" name="country">
            <Input placeholder="Enter country" />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Enter hotel description" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select>
              <Option value="ACTIVE">Active</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="CLOSED">Closed</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Images">
            <Upload
              listType="picture"
              multiple
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={(file) => {
                setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>Upload new images</Button>
            </Upload>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditHotelModal;