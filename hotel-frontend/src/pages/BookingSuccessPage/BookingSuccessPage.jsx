import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const BookingSuccessPage = () => (
  <Result
    status="success"
    title="Booking Confirmed!"
    subTitle="Your booking has been successfully processed. A confirmation email has been sent."
    extra={[
      <Button type="primary" key="home"><Link to="/">Go to Homepage</Link></Button>,
      <Button key="bookings"><Link to="/profile">View My Bookings</Link></Button>,
    ]}
  />
);
export default BookingSuccessPage;