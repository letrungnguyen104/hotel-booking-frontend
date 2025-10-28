// src/components/CancelBookingModal/CancelBookingModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space } from 'antd';
import { toast } from 'sonner';
import { cancelBooking } from '@/service/bookingService';

const { TextArea } = Input;

const CancelBookingModal = ({ open, onClose, booking, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await cancelBooking(booking.id, values.reason);
      toast.success("Booking cancelled successfully.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Cancel Booking #${booking?.id}`}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      onOk={form.submit}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <p>Are you sure you want to cancel your booking for <strong>{booking?.hotel.name}</strong>?</p>
        <Form.Item
          name="reason"
          label="Reason for cancellation"
          rules={[{ required: true, message: 'Please provide a reason for cancellation.' }]}
        >
          <TextArea rows={4} placeholder="e.g., Change of plans, found a better offer, etc." />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onClose}>Back</Button>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              Confirm Cancellation
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CancelBookingModal;