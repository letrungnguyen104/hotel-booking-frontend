import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Empty, Space, Table, Spin, message, Tag } from 'antd';
import { DollarCircleOutlined, ShopOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import { getAdminDashboardData } from '@/service/dashboardService';
import dayjs from 'dayjs';
import './AdminDashboard.scss';

const { RangePicker } = DatePicker;

const rangePresets = [
  { label: 'Last 7 Days', value: [dayjs().subtract(7, 'd'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().subtract(30, 'd'), dayjs()] },
  { label: 'Last 90 Days', value: [dayjs().subtract(90, 'd'), dayjs()] },
];

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const fetchData = (dates) => {
    if (!dates || dates.length !== 2) return;
    setLoading(true);
    const [start, end] = dates;

    getAdminDashboardData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'))
      .then(apiData => {
        setData(apiData);
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


  const currencyFormatter = (value) => `${(value / 1000000).toFixed(1)}M VND`;

  const lineConfig = {
    data: data?.revenueOverTime || [], xField: 'date', yField: 'revenue', point: { shape: 'diamond' }, color: '#1976D2',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: 'Revenue', value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  const pieConfig = {
    appendPadding: 10, data: data?.userRoleDistribution || [], angleField: 'value', colorField: 'type', radius: 0.8,
    legend: { position: 'top' },
    label: { content: (data) => `${data.type}\n${data.value}`, style: { textAlign: 'center', fontSize: 14 } },
    interactions: [{ type: 'element-active' }],
    tooltip: { formatter: (datum) => ({ name: datum.type, value: `${datum.value} users` }) }
  };

  const columnConfig = {
    data: data?.topHotelsByRevenue || [], xField: 'hotel', yField: 'revenue', color: '#4CAF50',
    yAxis: { label: { formatter: currencyFormatter } },
    tooltip: { formatter: (datum) => ({ name: datum.hotel, value: `${datum.revenue.toLocaleString()} VND` }) }
  };

  const hotelTableColumns = [
    { title: 'Hotel Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'gold'}>{status}</Tag> },
  ];

  return (
    <div className="admin-dashboard-container">
      <Row gutter={[24, 24]}>
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

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Revenue" value={data?.totalRevenue || 0} formatter={(val) => val.toLocaleString()} prefix={<DollarCircleOutlined />} suffix="VND" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Bookings" value={data?.totalBookings || 0} prefix={<BookOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Hotels" value={data?.totalHotels || 0} prefix={<ShopOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic title="Total Users" value={data?.totalUsers || 0} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="System Revenue Over Time">
            <Spin spinning={loading}>
              {(data?.revenueOverTime?.length || 0) > 0 ? <Line {...lineConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="User Role Distribution">
            <Spin spinning={loading}>
              {(data?.userRoleDistribution?.length || 0) > 0 ? <Pie {...pieConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="Top 5 Hotels by Revenue">
            <Spin spinning={loading}>
              {(data?.topHotelsByRevenue?.length || 0) > 0 ? <Column {...columnConfig} /> : <Empty />}
            </Spin>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Hotel Overview">
            <Table
              dataSource={data?.hotelOverview || []}
              columns={hotelTableColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;