import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const BookingFailurePage = () => (
  <Result
    status="error"
    title="Booking Failed"
    subTitle="There was an error processing your payment. Please try again."
    extra={[
      <Button type="primary" key="home"><Link to="/">Go to Homepage</Link></Button>,
      <Button key="checkout"><Link to="/checkout">Try Again</Link></Button>,
    ]}
  />
);
export default BookingFailurePage;