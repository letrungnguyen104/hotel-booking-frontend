// src/pages/MyBookingsPage/MyBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Empty, Tag, Button, Avatar, message, Space, Modal, List, Descriptions, Divider, Form, Input } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getMyBookings, cancelBooking } from '@/service/bookingService';
import { toast } from 'sonner';
import './MyBookingPage.scss';

const { TabPane } = Tabs;
const { TextArea } = Input;

const CancelBookingModal = ({ open, onClose, booking, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await cancelBooking(booking.id, values.reason);
      toast.success("Cancellation request sent. Please wait for hotel confirmation.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Request to Cancel Booking #${booking?.id}`}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <p>Are you sure you want to request cancellation for <strong>{booking?.hotel.name}</strong>?</p>
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
              Send Cancellation Request
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};


const BookingDetailModal = ({ booking, open, onClose }) => {
  if (!booking) return null;

  const totalNights = dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), 'day');

  const originalPrice = (booking.totalPrice || 0) + (booking.discountAmount || 0);
  const subTotal = booking.rooms.reduce((acc, room) => acc + (room.price * totalNights), 0)
    + booking.services.reduce((acc, s) => acc + s.price, 0);

  const getStatusTag = (status) => {
    switch (status) {
      case 'CONFIRMED': return <Tag color="blue">Upcoming</Tag>;
      case 'PENDING': return <Tag color="gold">Pending</Tag>;
      case 'CANCELLATION_PENDING': return <Tag color="orange">Cancellation Pending</Tag>;
      case 'COMPLETED': return <Tag color="green">Completed</Tag>;
      case 'CANCELLED': return <Tag color="red">Cancelled</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Booking Details #${booking.id}`}
      footer={[<Button key="close" type="primary" onClick={onClose}>Close</Button>]}
      width={700}
    >
      <div className="booking-detail-modal">
        <Descriptions bordered column={1} layout="horizontal">
          <Descriptions.Item label="Hotel">{booking.hotel.name}</Descriptions.Item>
          <Descriptions.Item label="Check-in">{dayjs(booking.checkInDate).format('ddd, DD MMM YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Check-out">{dayjs(booking.checkOutDate).format('ddd, DD MMM YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Status">{getStatusTag(booking.status)}</Descriptions.Item>
          {booking.cancellationReason && (
            <Descriptions.Item label="Reason for Cancel">{booking.cancellationReason}</Descriptions.Item>
          )}
        </Descriptions>
        <Divider />
        <h4>Room Details</h4>
        <List
          dataSource={booking.rooms}
          renderItem={item => (
            <List.Item
              extra={<strong>{(item.price * totalNights).toLocaleString()} VND</strong>}
            >
              <List.Item.Meta
                title={item.roomName}
                description={`Room: ${item.roomNumber} • ${totalNights} nights`}
              />
            </List.Item>
          )}
        />
        {booking.services.length > 0 && (
          <>
            <Divider />
            <h4>Services</h4>
            <List
              dataSource={booking.services}
              renderItem={item => (
                <List.Item extra={<strong>{item.price.toLocaleString()} VND</strong>}>
                  <List.Item.Meta title={item.name} />
                </List.Item>
              )}
            />
          </>
        )}
        <Divider />
        <div className="price-breakdown">
          <p><span>Subtotal</span> <strong>{subTotal.toLocaleString()} VND</strong></p>
          {booking.discountAmount > 0 && (
            <p className="discount-amount">
              <span>Discount ({booking.appliedPromotionCode})</span>
              <strong>- {booking.discountAmount.toLocaleString()} VND</strong>
            </p>
          )}
          <p className="grand-total"><span>Total Price Paid</span> <strong>{booking.totalPrice.toLocaleString()} VND</strong></p>
        </div>
      </div>
    </Modal>
  );
};

const BookingCard = ({ booking, onViewDetails, onCancelBooking }) => {
  const navigate = useNavigate();
  const totalNights = dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), 'day');

  const getStatusTag = (status) => {
    switch (status) {
      case 'CONFIRMED': return <Tag color="blue">Upcoming</Tag>;
      case 'PENDING': return <Tag color="gold">Pending</Tag>;
      case 'CANCELLATION_PENDING': return <Tag color="orange">Cancellation Pending</Tag>;
      case 'COMPLETED': return <Tag color="green">Completed</Tag>;
      case 'CANCELLED': return <Tag color="red">Cancelled</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  return (
    <Card className="booking-card" hoverable>
      <div className="booking-card__image">
        <img src={booking.hotel.image} alt={booking.hotel.name} />
      </div>
      <div className="booking-card__details">
        <div className="booking-card__header">
          <h3>{booking.hotel.name}</h3>
          {getStatusTag(booking.status)}
        </div>
        <p className="booking-card__address"><EnvironmentOutlined /> {booking.hotel.address}</p>
        <div className="booking-card__dates">
          <div>
            <span>Check-in</span>
            <strong>{dayjs(booking.checkInDate).format('DD MMM YYYY')}</strong>
          </div>
          <div>
            <span>Check-out</span>
            <strong>{dayjs(booking.checkOutDate).format('DD MMM YYYY')}</strong>
          </div>
          <div>
            <span>Nights</span>
            <strong>{totalNights}</strong>
          </div>
        </div>
        <div className="booking-card__footer">
          <span className="booking-card__price">Total: {booking.totalPrice.toLocaleString()} VND</span>
          <Space>
            {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
              <Button danger size="small" onClick={() => onCancelBooking(booking)}>
                Request Cancellation
              </Button>
            )}
            <Button size="small" icon={<EyeOutlined />} onClick={() => onViewDetails(booking)}>
              View Details
            </Button>
            <Button type="primary" size="small" onClick={() => navigate(`/hotel/${booking.hotel.id}`)}>
              View Hotel
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchMyBookings = () => {
    setLoading(true);
    getMyBookings()
      .then(data => {
        setBookings(data || []);
      })
      .catch(err => message.error("Failed to load your bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };
  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };
  const handleCloseModals = () => {
    setDetailModalOpen(false);
    setCancelModalOpen(false);
    setSelectedBooking(null);
  };

  const filterBookings = (status) => {
    const today = dayjs().format('YYYY-MM-DD');
    if (status === 'UPCOMING') {
      return bookings.filter(b => b.status === 'CONFIRMED' && dayjs(b.checkInDate).isAfter(today));
    }
    return bookings.filter(b => b.status === status);
  };

  const renderBookingList = (data) => {
    if (loading) {
      return <div className="loading-container"><Spin /></div>;
    }
    if (data.length === 0) {
      return <Empty description="No bookings found in this category." />;
    }
    return (
      <div className="booking-list">
        {data.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onViewDetails={handleViewDetails}
            onCancelBooking={handleOpenCancelModal}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="my-bookings-page">
        <Card>
          <h1 className="page-title">My Bookings</h1>
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab={`Upcoming (${filterBookings('UPCOMING').length})`} key="1">
              {renderBookingList(filterBookings('UPCOMING'))}
            </TabPane>
            <TabPane tab={`Pending (${filterBookings('PENDING').length})`} key="2">
              {renderBookingList(filterBookings('PENDING'))}
            </TabPane>
            <TabPane tab={`Cancellation Pending (${filterBookings('CANCELLATION_PENDING').length})`} key="5">
              {renderBookingList(filterBookings('CANCELLATION_PENDING'))}
            </TabPane>
            <TabPane tab={`Completed (${filterBookings('COMPLETED').length})`} key="3">
              {renderBookingList(filterBookings('COMPLETED'))}
            </TabPane>
            <TabPane tab={`Cancelled (${filterBookings('CANCELLED').length})`} key="4">
              {renderBookingList(filterBookings('CANCELLED'))}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        open={detailModalOpen}
        onClose={handleCloseModals}
      />

      <CancelBookingModal
        booking={selectedBooking}
        open={cancelModalOpen}
        onClose={handleCloseModals}
        onSuccess={() => {
          handleCloseModals();
          fetchMyBookings();
        }}
      />
    </>
  );
};

export default MyBookingsPage;