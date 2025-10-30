// src/pages/CheckoutPage/CheckoutPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Input, Button, Steps, Divider, Avatar, List, message, Spin } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, UserOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import './CheckoutPage.scss';
import { createBooking } from '@/service/bookingService';
import { validatePromotion } from '@/service/promotionService';

const { Step } = Steps;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const checkoutData = useSelector(state => state.checkoutReducer);
  const userDetails = useSelector(state => state.userReducer);

  useEffect(() => {
    if (!checkoutData.hotel || checkoutData.cart.length === 0) {
      toast.error("Your booking cart is empty. Redirecting to homepage.");
      navigate('/');
    }
  }, [checkoutData, navigate]);

  const { hotel, cart, checkIn, checkOut } = checkoutData;

  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
    return nights > 0 ? nights : 1;
  }, [checkIn, checkOut]);

  const { roomsTotal, servicesTotal, grandTotal } = useMemo(() => {
    let roomsTotal = 0;
    let servicesTotal = 0;

    cart.forEach(item => {
      roomsTotal += (item.price * totalNights);
      servicesTotal += item.selectedServices.reduce((acc, s) => acc + s.price, 0);
    });

    const grandTotal = roomsTotal + servicesTotal;
    return { roomsTotal, servicesTotal, grandTotal };
  }, [cart, totalNights]);

  const finalTotal = useMemo(() => {
    return grandTotal - discountAmount;
  }, [grandTotal, discountAmount]);

  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue({
        fullName: userDetails.fullName,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
      });
    }
  }, [userDetails, form]);

  const handleApplyCoupon = async (code) => {
    console.log(code);
    if (!code) {
      setDiscountAmount(0);
      return;
    }
    setIsPromoLoading(true);
    try {
      const res = await validatePromotion(code, grandTotal);
      console.log(res);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setPromoCode(code);
        toast.success(res.message);
      } else {
        setDiscountAmount(0);
        setPromoCode("");
        toast.error(res.message);
      }
    } catch (error) {
      setDiscountAmount(0);
      setPromoCode("");
      toast.error(error.response?.data?.message || "Invalid code");
    } finally {
      setIsPromoLoading(false);
    }
  };

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      const aggregatedCart = cart.reduce((acc, item) => {
        const id = item.roomType.id;
        if (!acc[id]) {
          acc[id] = { roomTypeId: id, quantity: 0, services: [] };
        }
        acc[id].quantity += 1;
        acc[id].services.push(...item.selectedServices.map(s => s.id));
        acc[id].services = [...new Set(acc[id].services)];
        return acc;
      }, {});

      const bookingRequest = {
        hotelId: hotel.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        roomsToBook: Object.values(aggregatedCart),
        totalPrice: grandTotal,
        promotionCode: promoCode,
        customerInfo: values
      };

      console.log("Booking Request Payload:", bookingRequest);
      const response = await createBooking(bookingRequest);

      if (response && response.paymentUrl) {
        toast.success("Redirecting to payment gateway...");
        dispatch({ type: 'CLEAR_CHECKOUT_DATA' });
        window.location.href = response.paymentUrl;
      } else {
        toast.error("Could not create payment URL.");
        setIsSubmitting(false);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  if (!hotel || cart.length === 0) {
    return (
      <div className="checkout-page-container empty-cart">
        <Spin />
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="checkout-card">
            <Steps
              current={1}
              items={[
                { title: 'Review Selection' },
                { title: 'Your Details & Payment' },
                { title: 'Confirmation' },
              ]}
            />
          </Card>

          <Card title="Your Information" className="checkout-card">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col span={12}><Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}><Input prefix={<UserOutlined />} /></Form.Item></Col>
                <Col span={12}><Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true }]}><Input /></Form.Item></Col>
                <Col span={24}><Form.Item name="email" label="Email Address" rules={[{ required: true }]}><Input /></Form.Item></Col>
              </Row>
              <Button htmlType="submit" style={{ display: 'none' }} id="checkout-form-submit" />
            </Form>
          </Card>

          <Card title="Your Booking Details" className="checkout-card">
            <List
              itemLayout="vertical"
              dataSource={cart}
              renderItem={(item) => (
                <List.Item
                  className="room-summary-item"
                  key={item.cartItemId}
                  extra={<span className="room-price">{(item.price * totalNights).toLocaleString()} VND</span>}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={item.roomType.images?.[0]} shape="square" size={64} />}
                    title={`${item.roomType.name} (x${totalNights} nights)`}
                    description={`1 room • ${item.roomType.capacity} guests`}
                  />
                  {item.selectedServices.length > 0 && (
                    <div className="selected-services-list">
                      <strong>Services:</strong> {item.selectedServices.map(s => `${s.name} (${s.price.toLocaleString()} VND)`).join(', ')}
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="summary-card sticky-card">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              className="back-button"
            >
              Back to hotel
            </Button>
            <div className="summary-hotel-info">
              <img src={hotel.images[0]} alt={hotel.name} />
              <div>
                <h3>{hotel.name}</h3>
                <p><EnvironmentOutlined /> {hotel.address}</p>
              </div>
            </div>
            <Divider />
            <div className="summary-dates">
              <div>
                <span>Check-in</span>
                <strong>{dayjs(checkIn).format('ddd, DD MMM YYYY')}</strong>
              </div>
              <div>
                <span>Check-out</span>
                <strong>{dayjs(checkOut).format('ddd, DD MMM YYYY')}</strong>
              </div>
            </div>
            <p>{totalNights} night(s)</p>
            <Divider />
            <div className="discount-section">
              <Input.Search
                placeholder="Enter discount code"
                enterButton="Apply"
                loading={isPromoLoading}
                onSearch={handleApplyCoupon}
                disabled={isPromoLoading || discountAmount > 0}
                suffix={discountAmount > 0 ? <CheckCircleOutlined style={{ color: 'green' }} /> : null}
              />
            </div>
            <Divider />
            <div className="price-breakdown">
              <h4>Price Breakdown</h4>
              <p><span>Rooms Total ({cart.length}x)</span> <strong>{roomsTotal.toLocaleString()} VND</strong></p>
              <p><span>Services Total</span> <strong>{servicesTotal.toLocaleString()} VND</strong></p>
              {discountAmount > 0 && (
                <p className="discount-amount">
                  <span>Discount ({promoCode})</span>
                  <strong>- {discountAmount.toLocaleString()} VND</strong>
                </p>
              )}
              <Divider />
              <p className="grand-total"><span>Total Price</span> <strong>{finalTotal.toLocaleString()} VND</strong></p>
            </div>
            <Button
              type="primary"
              size="large"
              block
              loading={isSubmitting}
              onClick={() => form.submit()}
            >
              Confirm & Pay
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;