// src/pages/HotelAdmin/Dashboard/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Empty, Space, Spin, message } from 'antd';
import { DollarCircleOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import { getDashboardData } from '@/service/bookingService';
import dayjs from 'dayjs';
import './Dashboard.scss';

const { RangePicker } = DatePicker;

const rangePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
  { label: 'Last 14 Days', value: [dayjs().subtract(14, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

  const fetchData = (dates) => {
    if (!dates || dates.length !== 2) return;
    setLoading(true);
    const [start, end] = dates;

    getDashboardData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
      .then(data => {
        setDashboardData(data || []);
      })
      .catch(() => {
        message.error("Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(dateRange);
  }, [dateRange]);

  const totalRevenue = useMemo(() =>
    dashboardData.reduce((sum, item) => item.status !== 'CANCELLED' ? sum + item.amount : sum, 0),
    [dashboardData]
  );

  const totalBookings = useMemo(() => dashboardData.length, [dashboardData]);

  const totalGuests = useMemo(() =>
    dashboardData.reduce((sum, item) => item.status !== 'CANCELLED' ? sum + item.guests : sum, 0),
    [dashboardData]
  );

  const revenueByDay = useMemo(() => {
    const daily = {};
    dashboardData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        daily[item.date] = (daily[item.date] || 0) + item.amount;
      }
    });
    return Object.keys(daily).map(date => ({ date, revenue: daily[date] })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [dashboardData]);

  const bookingStatusData = useMemo(() => {
    const statusCount = {};
    dashboardData.forEach(item => {
      statusCount[item.status] = (statusCount[item.status] || 0) + 1;
    });
    return Object.keys(statusCount).map(status => ({ type: status, value: statusCount[status] }));
  }, [dashboardData]);

  const revenueByRoomType = useMemo(() => {
    const roomRevenue = {};
    dashboardData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        roomRevenue[item.roomType] = (roomRevenue[item.roomType] || 0) + item.amount;
      }
    });
    return Object.keys(roomRevenue).map(type => ({ roomType: type, revenue: roomRevenue[type] })).sort((a, b) => b.revenue - a.revenue);
  }, [dashboardData]);

  const currencyFormatter = (value) => `${(value / 1000000).toFixed(1)}M VND`;
  const lineConfig = {
    data: revenueByDay, xField: 'date', yField: 'revenue', point: { shape: 'diamond' }, color: '#1976D2',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: 'Revenue', value: `${datum.revenue.toLocaleString()} VND` }) }
  };
  const pieConfig = {
    appendPadding: 10, data: bookingStatusData, angleField: 'value', colorField: 'type', radius: 0.8,
    legend: { position: 'top' },
    label: {
      offset: '-50%',
      content: (data) => {
        if (totalBookings === 0) return '';
        const percent = (data.value / totalBookings) * 100;
        return percent > 5 ? `${percent.toFixed(0)}%` : '';
      },
      style: { fontSize: 14, textAlign: 'center', fill: '#fff' },
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

        <Col xs={24} sm={12} lg={8}><Card loading={loading}><Statistic title="Total Revenue" value={totalRevenue} formatter={(value) => value.toLocaleString()} prefix={<DollarCircleOutlined />} suffix="VND" valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col xs={24} sm={12} lg={8}><Card loading={loading}><Statistic title="Total Bookings" value={totalBookings} prefix={<BookOutlined />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col xs={24} sm={24} lg={8}><Card loading={loading}><Statistic title="Total Guests" value={totalGuests} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>

        <Col span={24}>
          <Card title="Revenue Over Time">
            <Spin spinning={loading}>
              {revenueByDay.length > 0 ? <Line {...lineConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Booking Status">
            <Spin spinning={loading}>
              {bookingStatusData.length > 0 ? <Pie {...pieConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Revenue by Room Type">
            <Spin spinning={loading}>
              {revenueByRoomType.length > 0 ? <Column {...columnConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;