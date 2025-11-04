import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './BookingResultPage.scss';

const BookingSuccessPage = () => (
  <div className="booking-result-container">
    <Result
      className="booking-result-card"
      status="success"
      title="Booking Confirmed!"
      subTitle="Your booking has been successfully processed. A confirmation email has been sent."
      extra={[
        <Button type="primary" key="home"><Link to="/">Go to Homepage</Link></Button>,
        <Button key="bookings"><Link to="/my-bookings">View My Bookings</Link></Button>,
      ]}
    />
  </div>
);

export default BookingSuccessPage;