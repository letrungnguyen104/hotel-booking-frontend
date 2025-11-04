// src/pages/HotelAdmin/BookingManagement/BookingManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Spin, Empty, Tag, Button, message, Space, Modal, List, Descriptions, Divider, DatePicker, Tabs, Row, Col, Tooltip, Alert } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LoginOutlined,
  LogoutOutlined,
  StopOutlined,
  QuestionCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {
  getBookingsForHotelAdmin,
  confirmBooking,
  checkInBooking,
  checkOutBooking,
  approveCancellation,
  rejectCancellation
} from '@/service/bookingService';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import './BookingManagement.scss';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const BookingDetailModal = ({ booking, open, onClose }) => {
  if (!booking) return null;

  const totalNights = dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), 'day');

  const subTotal = booking.rooms.reduce((acc, room) => acc + (room.price * totalNights), 0)
    + booking.services.reduce((acc, s) => acc + s.price, 0);

  const getStatusTag = (status) => {
    switch (status) {
      case 'CONFIRMED': return <Tag color="blue">Confirmed</Tag>;
      case 'PENDING': return <Tag color="gold">Pending</Tag>;
      case 'CANCELLATION_PENDING': return <Tag color="orange">Cancellation Pending</Tag>;
      case 'COMPLETED': return <Tag color="green">Completed</Tag>;
      case 'CANCELLED': return <Tag color="red">Cancelled</Tag>;
      case 'CHECKED_IN': return <Tag color="cyan">Checked-In</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Booking Details #${booking.id}`}
      footer={[<Button key="close" type="primary" onClick={onClose}>Close</Button>]}
      width={800}
    >
      <div className="booking-detail-modal">
        {booking.cancellationReason && (
          <Alert
            message={booking.status === 'CANCELLED' ? "Cancellation Reason" : "Cancellation Request"}
            description={<strong>Reason: {booking.cancellationReason}</strong>}
            type={booking.status === 'CANCELLED' ? "error" : "warning"}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Row gutter={24}>
          <Col span={12}>
            <h4>Customer Details</h4>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Full Name">{booking.user.fullName}</Descriptions.Item>
              <Descriptions.Item label="Email">{booking.user.email}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <h4>Booking Info</h4>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Check-in">{dayjs(booking.checkInDate).format('DD MMM YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Check-out">{dayjs(booking.checkOutDate).format('DD MMM YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Status">{getStatusTag(booking.status)}</Descriptions.Item>
              <Descriptions.Item label="Payment">{booking.paymentStatus}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />
        <h4>Room Details</h4>
        <List
          dataSource={booking.rooms}
          renderItem={item => (
            <List.Item extra={<strong>{(item.price * totalNights).toLocaleString()} VND</strong>}>
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
          <p><span>Subtotal (Rooms + Services)</span> <strong>{subTotal.toLocaleString()} VND</strong></p>
          {booking.discountAmount > 0 && (
            <p className="discount-amount">
              <span>Discount ({booking.appliedPromotionCode})</span>
              <strong>- {booking.discountAmount.toLocaleString()} VND</strong>
            </p>
          )}
          <p className="grand-total"><span>Final Price</span> <strong>{booking.totalPrice.toLocaleString()} VND</strong></p>
        </div>
      </div>
    </Modal>
  );
};

const BookingManagement = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookingsForHotelAdmin();
      setAllBookings(data || []);
    } catch (error) {
      message.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (!dateRange) return allBookings;
    const [start, end] = dateRange;
    return allBookings.filter(b => {
      const checkIn = dayjs(b.checkInDate);
      return checkIn.isAfter(start.startOf('day')) && checkIn.isBefore(end.endOf('day'));
    });
  }, [allBookings, dateRange]);

  const getBookingsByStatus = (status) => {
    return filteredBookings.filter(b => b.status === status);
  };

  const handleConfirm = (booking) => {
    Swal.fire({
      title: `Confirm Booking #${booking.id}?`,
      text: "This will confirm the booking and mark it as paid.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, confirm it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await confirmBooking(booking.id);
          toast.success("Booking confirmed!");
          fetchBookings();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to confirm.");
        }
      }
    });
  };

  const handleCheckIn = (booking) => {
    Swal.fire({
      title: `Check-in Booking #${booking.id}?`,
      text: `Customer: ${booking.user.fullName}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Check-in!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await checkInBooking(booking.id);
          if (response && response.id) {
            toast.success("Customer checked in!");
            fetchBookings();
          } else {
            throw new Error("Invalid check-in date or error occurred.");
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message || "Failed to check-in.";
          if (errorMessage.includes("Invalid check in date")) {
            toast.error("Check-in Failed: Today is not the check-in date for this booking.");
          } else {
            toast.error(errorMessage);
          }
        }
      }
    });
  };

  const handleCheckOut = (booking) => {
    Swal.fire({
      title: `Check-out Booking #${booking.id}?`,
      text: `Customer: ${booking.user.fullName}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Check-out!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await checkOutBooking(booking.id);
          toast.success("Customer checked out!");
          fetchBookings();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to check-out.");
        }
      }
    });
  };

  const handleRejectPending = (booking) => {
    Swal.fire({
      title: `Reject Pending Booking #${booking.id}?`,
      text: "This booking has not been paid. Rejecting will cancel it and free up the room.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveCancellation(booking.id);
          toast.success("Booking rejected and set to Cancelled.");
          fetchBookings();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to reject.");
        }
      }
    });
  };

  const handleApproveCancel = (booking) => {
    Swal.fire({
      title: `Approve Cancellation for #${booking.id}?`,
      text: "This will cancel the booking and issue a refund.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, approve cancellation'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await approveCancellation(booking.id);
          toast.success("Cancellation approved.");
          fetchBookings();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to approve.");
        }
      }
    });
  };

  const handleRejectCancel = (booking) => {
    Swal.fire({
      title: `Reject Cancellation for #${booking.id}?`,
      text: "This will reactivate the user's booking.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject cancellation'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await rejectCancellation(booking.id);
          toast.info("Cancellation request rejected.");
          fetchBookings();
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to reject.");
        }
      }
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const columns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, width: 100 },
    { title: 'Customer', dataIndex: ['user', 'fullName'], key: 'customer', width: 120 },
    {
      title: 'Check-in', dataIndex: 'checkInDate', key: 'checkIn', width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.checkInDate).unix() - dayjs(b.checkInDate).unix()
    },
    {
      title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice', width: 120,
      render: (price) => price.toLocaleString() + " VND",
      sorter: (a, b) => a.totalPrice - b.totalPrice
    },
    {
      title: 'Action', key: 'action', fixed: 'right', width: 250,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="View Details">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>

          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Reject Pending Booking">
                <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectPending(record)} />
              </Tooltip>
            </>
          )}
          {record.status === 'CONFIRMED' && (
            <Tooltip title="Check-in Customer">
              <Button type="link" icon={<LoginOutlined />} onClick={() => handleCheckIn(record)} />
            </Tooltip>
          )}
          {record.status === 'CHECKED_IN' && (
            <Tooltip title="Check-out Customer">
              <Button type="link" icon={<LogoutOutlined />} onClick={() => handleCheckOut(record)} />
            </Tooltip>
          )}

          {record.status === 'CANCELLATION_PENDING' && (
            <>
              <Tooltip title="Approve Cancellation">
                <Button type="link" icon={<CheckCircleOutlined />} style={{ color: '#52c41a' }} onClick={() => handleApproveCancel(record)} />
              </Tooltip>
              <Tooltip title="Reject Cancellation">
                <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectCancel(record)} />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const renderBookingTable = (status) => {
    const data = getBookingsByStatus(status);
    return <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 1000 }} />;
  };

  return (
    <>
      <div className="booking-management-page">
        <Card>
          <div className="booking-header">
            <h1 className="page-title">Booking Management</h1>
            <Space>
              <span>Filter by Check-in Date:</span>
              <RangePicker onChange={(dates) => setDateRange(dates)} />
            </Space>
          </div>

          <Tabs defaultActiveKey="PENDING" type="card">
            <TabPane tab={<><ClockCircleOutlined /> Pending ({getBookingsByStatus('PENDING').length})</>} key="PENDING">
              {renderBookingTable('PENDING')}
            </TabPane>

            <TabPane tab={<><QuestionCircleOutlined /> Cancel Requests ({getBookingsByStatus('CANCELLATION_PENDING').length})</>} key="CANCELLATION_PENDING">
              {renderBookingTable('CANCELLATION_PENDING')}
            </TabPane>

            <TabPane tab={<><CheckCircleOutlined /> Confirmed ({getBookingsByStatus('CONFIRMED').length})</>} key="CONFIRMED">
              {renderBookingTable('CONFIRMED')}
            </TabPane>
            <TabPane tab={<><LoginOutlined /> Checked-in ({getBookingsByStatus('CHECKED_IN').length})</>} key="CHECKED_IN">
              {renderBookingTable('CHECKED_IN')}
            </TabPane>
            <TabPane tab={<><LogoutOutlined /> Completed ({getBookingsByStatus('COMPLETED').length})</>} key="COMPLETED">
              {renderBookingTable('COMPLETED')}
            </TabPane>
            <TabPane tab={<><StopOutlined /> Cancelled ({getBookingsByStatus('CANCELLED').length})</>} key="CANCELLED">
              {renderBookingTable('CANCELLED')}
            </TabPane>
          </Tabs>
        </Card>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedBooking(null);
        }}
      />
    </>
  );
};

export default BookingManagement;