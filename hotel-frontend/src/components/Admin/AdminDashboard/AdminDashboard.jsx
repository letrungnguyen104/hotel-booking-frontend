// src/components/Admin/AdminDashboard/AdminDashboard.jsx

import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Empty, Space, Table } from 'antd';
import { DollarCircleOutlined, ShopOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import './AdminDashboard.scss';

const { RangePicker } = DatePicker;

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---

// 1. Dữ liệu Booking giả lập (toàn hệ thống)
const generateMockBookings = () => {
  const data = [];
  const hotels = ['Grand Plaza', 'Seaside Villa', 'Mountain Lodge', 'City Center Hotel', 'Budget Inn'];
  const statuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
  for (let i = 0; i < 90; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const dailyBookings = Math.floor(Math.random() * 20) + 5; // Nhiều booking hơn
    for (let j = 0; j < dailyBookings; j++) {
      data.push({
        date: date,
        amount: (Math.random() * 3000000) + 500000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        hotel: hotels[Math.floor(Math.random() * hotels.length)],
      });
    }
  }
  return data;
};

// 2. Dữ liệu User giả lập
const mockUsers = [
  { id: 1, role: 'ADMIN' },
  { id: 2, role: 'HOTEL_ADMIN' },
  { id: 3, role: 'USER' },
  { id: 4, role: 'USER' },
  { id: 5, role: 'USER' },
  { id: 6, role: 'HOTEL_ADMIN' },
  { id: 7, role: 'USER' },
  { id: 8, role: 'USER' },
  { id: 9, role: 'USER' },
  { id: 10, role: 'USER' },
];

// 3. Dữ liệu Hotel giả lập
const mockHotels = [
  { id: 1, name: 'Grand Plaza', status: 'ACTIVE', owner: 'hotel_admin_1' },
  { id: 2, name: 'Seaside Villa', status: 'ACTIVE', owner: 'hotel_admin_2' },
  { id: 3, name: 'Mountain Lodge', status: 'PENDING', owner: 'hotel_admin_3' },
  { id: 4, name: 'City Center Hotel', status: 'ACTIVE', owner: 'hotel_admin_1' },
  { id: 5, name: 'Budget Inn', status: 'CLOSED', owner: 'hotel_admin_4' },
];

const mockBookingData = generateMockBookings();

// --- Các khoảng thời gian chọn nhanh ---
const rangePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
];

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return [];
    const [start, end] = dateRange;
    return mockBookingData.filter(item => dayjs(item.date).isAfter(start.subtract(1, 'day')) && dayjs(item.date).isBefore(end.add(1, 'day')));
  }, [dateRange]);

  // --- XỬ LÝ DỮ LIỆU CHO CÁC THẺ STATISTIC ---
  const totalRevenue = filteredData.reduce((sum, item) => item.status !== 'CANCELLED' ? sum + item.amount : sum, 0);
  const totalHotels = mockHotels.length; // Tổng số khách sạn
  const totalUsers = mockUsers.length; // Tổng số người dùng
  const totalBookings = filteredData.length; // Tổng booking trong khoảng ngày

  // --- XỬ LÝ DỮ LIỆU CHO BIỂU ĐỒ ---
  // 1. Biểu đồ đường: Doanh thu theo ngày
  const revenueByDay = useMemo(() => {
    const daily = {};
    filteredData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        daily[item.date] = (daily[item.date] || 0) + item.amount;
      }
    });
    return Object.keys(daily).map(date => ({ date, revenue: daily[date] })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData]);

  // 2. Biểu đồ tròn: Phân bổ vai trò người dùng
  const userRoleData = useMemo(() => {
    const roleCount = {};
    mockUsers.forEach(user => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });
    return Object.keys(roleCount).map(role => ({ type: role, value: roleCount[role] }));
  }, []);

  // 3. Biểu đồ cột: Doanh thu theo khách sạn
  const revenueByHotel = useMemo(() => {
    const hotelRevenue = {};
    filteredData.forEach(item => {
      if (item.status !== 'CANCELLED') {
        hotelRevenue[item.hotel] = (hotelRevenue[item.hotel] || 0) + item.amount;
      }
    });
    return Object.keys(hotelRevenue)
      .map(hotelName => ({ hotel: hotelName, revenue: hotelRevenue[hotelName] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Lấy top 5
  }, [filteredData]);

  // --- CẤU HÌNH BIỂU ĐỒ ---
  const currencyFormatter = (value) => `${(value / 1000000).toFixed(1)}M VND`;

  const lineConfig = {
    data: revenueByDay, xField: 'date', yField: 'revenue', point: { shape: 'diamond' }, color: '#1976D2',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: 'Revenue', value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  const pieConfig = {
    appendPadding: 10, data: userRoleData, angleField: 'value', colorField: 'type', radius: 0.8,
    legend: { position: 'top' },
    label: { content: (data) => `${data.type}\n${data.value} Users`, style: { textAlign: 'center', fontSize: 14 } },
    interactions: [{ type: 'element-active' }],
    tooltip: { formatter: (datum) => ({ name: datum.type, value: `${datum.value} users` }) }
  };

  const columnConfig = {
    data: revenueByHotel, xField: 'hotel', yField: 'revenue', color: '#4CAF50',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: datum.hotel, value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  // Cấu hình bảng
  const hotelTableColumns = [
    { title: 'Hotel Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div className="admin-dashboard-container">
      <Row gutter={[24, 24]}>
        {/* BỘ LỌC NGÀY */}
        <Col span={24}>
          <Card className="admin-header-card">
            <div className="admin-header">
              <h2 className="admin-title">Super Admin Dashboard</h2>
              <Space wrap>
                <span className="filter-label">Filter Bookings by Date:</span>
                <RangePicker presets={rangePresets} value={dateRange} onChange={setDateRange} format="DD/MM/YYYY" />
              </Space>
            </div>
          </Card>
        </Col>

        {/* CÁC THẺ THỐNG KÊ */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Revenue" value={totalRevenue} formatter={(val) => val.toLocaleString()} prefix={<DollarCircleOutlined />} suffix="VND" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Bookings" value={totalBookings} prefix={<BookOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Hotels" value={totalHotels} prefix={<ShopOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Users" value={totalUsers} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>

        {/* BIỂU ĐỒ DOANH THU THEO NGÀY */}
        <Col span={24}>
          <Card title="System Revenue Over Time">
            {revenueByDay.length > 0 ? <Line {...lineConfig} /> : <Empty />}
          </Card>
        </Col>

        {/* BIỂU ĐỒ PHÂN BỔ VAI TRÒ VÀ DOANH THU KHÁCH SẠN */}
        <Col xs={24} lg={8}>
          <Card title="User Role Distribution">
            {userRoleData.length > 0 ? <Pie {...pieConfig} /> : <Empty />}
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Top 5 Hotels by Revenue">
            {revenueByHotel.length > 0 ? <Column {...columnConfig} /> : <Empty />}
          </Card>
        </Col>

        {/* BẢNG THỐNG KÊ NHANH KHÁCH SẠN */}
        <Col span={24}>
          <Card title="Hotel Overview">
            <Table
              dataSource={mockHotels}
              columns={hotelTableColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;