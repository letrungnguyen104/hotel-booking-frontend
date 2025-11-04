import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './BookingResultPage.scss';

const BookingFailurePage = () => (
  <div className="booking-result-container">
    <Result
      className="booking-result-card"
      status="error"
      title="Booking Failed"
      subTitle="There was an error processing your payment or the booking was cancelled. Please try again."
      extra={[
        <Button type="primary" key="home"><Link to="/">Go to Homepage</Link></Button>,
        <Button key="checkout"><Link to="/checkout">Try Again</Link></Button>,
      ]}
    />
  </div>
);

export default BookingFailurePage;