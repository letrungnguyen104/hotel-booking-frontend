// src/pages/HotelAdmin/Dashboard/Dashboard.jsx

import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Empty, Space } from 'antd';
import { DollarCircleOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import './Dashboard.scss';

const { RangePicker } = DatePicker;

// --- Dữ liệu giả lập (Mock Data) ---
const generateMockData = () => {
  const data = [];
  const roomTypes = ['Deluxe Room', 'Family Suite', 'Standard Room', 'VIP Couple'];
  const statuses = ['CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'COMPLETED'];
  for (let i = 0; i < 90; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const dailyBookings = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < dailyBookings; j++) {
      data.push({
        date: date,
        amount: (Math.random() * 2000000) + 500000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
        guests: Math.floor(Math.random() * 2) + 1,
      });
    }
  }
  return data;
};
const mockData = generateMockData();

// --- Các khoảng thời gian chọn nhanh ---
const rangePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().subtract(14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return [];
    const [start, end] = dateRange;
    return mockData.filter(item => dayjs(item.date).isAfter(start.subtract(1, 'day')) && dayjs(item.date).isBefore(end.add(1, 'day')));
  }, [dateRange]);

  const totalRevenue = filteredData.reduce((sum, item) => item.status !== 'CANCELLED' ? sum + item.amount : sum, 0);
  const totalBookings = filteredData.length;
  const totalGuests = filteredData.reduce((sum, item) => item.status !== 'CANCELLED' ? sum + item.guests : sum, 0);

  const revenueByDay = useMemo(() => {
    const daily = {};
    filteredData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        daily[item.date] = (daily[item.date] || 0) + item.amount;
      }
    });
    return Object.keys(daily).map(date => ({ date, revenue: daily[date] })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  const bookingStatusData = useMemo(() => {
    const statusCount = {};
    filteredData.forEach(item => {
      statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    return Object.keys(statusCount).map(status => ({ type: status, value: statusCount[status] }));
  }, [filteredData]);

  const revenueByRoomType = useMemo(() => {
    const roomRevenue = {};
    filteredData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        roomRevenue[item.roomType] = (roomRevenue[item.roomType] || 0) + item.amount;
      }
    });
    return Object.keys(roomRevenue).map(type => ({ roomType: type, revenue: roomRevenue[type] })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  const currencyFormatter = (value) => `${(value / 1000000).toFixed(1)}M VND`;

  const lineConfig = {
    data: revenueByDay, xField: 'date', yField: 'revenue', point: { shape: 'diamond' }, color: '#1976D2',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: 'Revenue', value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  const pieConfig = {
    appendPadding: 10,
    data: bookingStatusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    legend: { position: 'top' },
    label: {
      offset: '-50%',
      content: (data) => {
        if (totalBookings === 0) {
          return '';
        }
        const percent = (data.value / totalBookings) * 100;
        return percent > 5 ? `${percent.toFixed(0)}%` : '';
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
        fill: '#fff',
      },
    },
    interactions: [{ type: 'element-active' }],
    tooltip: { formatter: (datum) => ({ name: datum.type, value: `${datum.value} bookings` }) }
  };

  const columnConfig = {
    data: revenueByRoomType, xField: 'roomType', yField: 'revenue', color: '#4CAF50',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: datum.roomType, value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  return (
    <div className="dashboard-container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="dashboard-header-card">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Dashboard Overview</h2>
              <Space wrap>
                <span className="filter-label">Date Range:</span>
                <RangePicker presets={rangePresets} value={dateRange} onChange={setDateRange} format="DD/MM/YYYY" />
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}><Card><Statistic title="Total Revenue" value={totalRevenue} formatter={(value) => value.toLocaleString()} prefix={<DollarCircleOutlined />} suffix="VND" valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col xs={24} sm={12} lg={8}><Card><Statistic title="Total Bookings" value={totalBookings} prefix={<BookOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col xs={24} sm={24} lg={8}><Card><Statistic title="Total Guests" value={totalGuests} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>

        <Col span={24}>
          <Card title="Revenue Over Time">
            {revenueByDay.length > 0 ? <Line {...lineConfig} /> : <Empty />}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Booking Status">
            {bookingStatusData.length > 0 ? <Pie {...pieConfig} /> : <Empty />}
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Revenue by Room Type">
            {revenueByRoomType.length > 0 ? <Column {...columnConfig} /> : <Empty />}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;