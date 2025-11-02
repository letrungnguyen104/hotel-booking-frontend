// src/components/ReportModal/ReportModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, message } from 'antd';
import { toast } from 'sonner';
import { createReport } from '@/service/reportService';

const { TextArea } = Input;
const { Option } = Select;

const hotelReasons = [
  "Misleading information or photos",
  "Fake hotel or scam",
  "Incorrect address or location",
  "Inappropriate content",
  "Other"
];

const userReasons = [
  "Harassment or abusive language",
  "Spam or unwanted messages",
  "Fake profile or impersonation",
  "Other"
];

const ReportModal = ({ open, onClose, target }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!target) {
    return null;
  }

  const isHotelReport = target?.type === 'HOTEL';
  const reasons = isHotelReport ? hotelReasons : userReasons;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const reportTypeString = isHotelReport ? "REPORT_HOTEL" : "REPORT_USER";

      const requestData = {
        ...values,
        reportType: reportTypeString,
        reportedUserId: isHotelReport ? null : target.id,
        reportedHotelId: isHotelReport ? target.id : null
      };

      console.log("Sending report request:", requestData);

      const response = await createReport(requestData);
      console.log(response);
      toast.success("Report submitted. Our team will review it shortly.");
      form.resetFields();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isHotelReport ? `Report "${target.name}"` : `Report user "${target.name}"`}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <p>Please select a reason for your report. This helps us take action faster.</p>

        <Form.Item
          name="reason"
          label="Reason"
          rules={[{ required: true, message: 'Please select a reason.' }]}
        >
          <Select placeholder="Select a reason">
            {reasons.map(reason => (
              <Option key={reason} value={reason}>{reason}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="details"
          label="Details (Optional)"
        >
          <TextArea rows={4} placeholder="Please provide any additional details..." />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit Report
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportModal;