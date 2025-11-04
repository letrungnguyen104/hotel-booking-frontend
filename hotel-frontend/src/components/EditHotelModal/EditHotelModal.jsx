// src/components/EditHotelModal/EditHotelModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, Spin, message, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getHotelById, updateHotel } from "@/service/hotelService";
import { toast } from "sonner";
import { getProvinces } from "@/service/locationService";

const { Option } = Select;

const EditHotelModal = ({ open, onClose, hotelId, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);

  useEffect(() => {
    getProvinces().then(data => {
      if (data) {
        setProvinces(data.map(p => ({ value: p.name, label: p.name })));
      }
    });
  }, []);

  useEffect(() => {
    if (open && hotelId) {
      fetchHotelData(hotelId);
    } else if (!open) {
      form.resetFields();
      setFileList([]);
      setCurrentStatus(null);
    }
  }, [open, hotelId, form]);

  const fetchHotelData = async (id) => {
    setLoading(true);
    try {
      const hotel = await getHotelById(id);

      if (provinces.length === 0) {
        const provinceData = await getProvinces();
        if (provinceData) {
          setProvinces(provinceData.map(p => ({ value: p.name, label: p.name })));
        }
      }

      form.setFieldsValue({
        name: hotel.name,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        phone: hotel.phone,
        description: hotel.description,
        status: hotel.status,
      });

      setCurrentStatus(hotel.status);

      if (hotel.images && hotel.images.length > 0) {
        setFileList(
          hotel.images.map((url, index) => ({
            uid: `old-${index}`,
            name: url.split("/").pop(),
            status: "done",
            url: url,
          }))
        );
      } else {
        setFileList([]);
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
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("request", JSON.stringify(values));

      const remainingImages = fileList
        .filter((file) => !file.originFileObj && file.url)
        .map((file) => file.url);
      formData.append("remainingImages", JSON.stringify(remainingImages));

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj);
        }
      });

      await updateHotel(hotelId, formData);
      toast.success("Update hotel successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating hotel:", err);
      toast.error(err.response?.data?.message || "Failed to update hotel!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStatusChangeForbidden =
    currentStatus === "PENDING" ||
    currentStatus === "REJECTED" ||
    currentStatus === "INACTIVE";

  const filterProvinces = (input, option) =>
    (option?.label ?? '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  return (
    <Modal
      open={open}
      title="Edit Hotel"
      onCancel={onClose}
      onOk={handleOk}
      okText="Save Changes"
      width={600}
      okButtonProps={{ loading: isSubmitting }}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          {isStatusChangeForbidden && (
            <Alert
              message="This hotel's status cannot be changed."
              description="Only a Super Admin can reactivate a PENDING, REJECTED, or BANNED (INACTIVE) hotel."
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form.Item label="Hotel Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter hotel name" />
          </Form.Item>

          <Form.Item label="City / Province" name="city" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select or search for your province"
              options={provinces}
              filterOption={filterProvinces}
            />
          </Form.Item>

          <Form.Item label="Address (Street, Ward, District)" name="address" rules={[{ required: true }]}>
            <Input placeholder="E.g., 123 Nguyen Van Linh, Hai Chau District" />
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
            <Select disabled={isStatusChangeForbidden}>
              <Option value="ACTIVE">Active (Available for booking)</Option>
              <Option value="CLOSED">Closed (Temporarily unavailable)</Option>
              {isStatusChangeForbidden && (
                <Option value={currentStatus} disabled>{currentStatus}</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Images">
            <Upload
              listType="picture"
              multiple
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
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