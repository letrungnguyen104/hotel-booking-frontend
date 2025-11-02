import React, { useState } from 'react';
import { Modal, Form, Input, Button, Rate, message } from 'antd';
import { toast } from 'sonner';
import { createReview } from '@/service/bookingService';

const { TextArea } = Input;

const ReviewModal = ({ open, onClose, booking, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const requestData = {
        ...values,
        bookingId: booking.id,
      };
      await createReview(requestData);
      toast.success("Thank you for your review!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Review your stay at ${booking?.hotel.name}`}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="rating"
          label="Your Rating"
          rules={[{ required: true, message: 'Please provide a rating.' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="comment"
          label="Your Comment"
        >
          <TextArea rows={4} placeholder="Tell us about your experience..." />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Review
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;