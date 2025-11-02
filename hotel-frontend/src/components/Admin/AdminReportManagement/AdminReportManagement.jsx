import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Spin, Tag, Button, message, Space, Modal, Descriptions, Select, Input, Tabs } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getAllReports, updateReportStatus } from '@/service/reportService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
// import './ReportManagement.scss'; // Tạo file SCSS này

const { TabPane } = Tabs;

const AdminReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('PENDING');

  const fetchReports = async (status) => {
    setLoading(true);
    try {
      const data = await getAllReports(status);
      console.log(data);
      setReports(data || []);
    } catch (error) {
      message.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(activeTab);
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleUpdateStatus = (report, newStatus) => {
    const actionText = newStatus === 'RESOLVED' ? 'resolve' : 'reject';
    Swal.fire({
      title: `Mark this report as ${newStatus}?`,
      text: `Are you sure you want to ${actionText} report #${report.id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText} it`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateReportStatus(report.id, newStatus);
          toast.success(`Report status updated to ${newStatus}`);
          fetchReports(activeTab); // Tải lại tab hiện tại
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update status.");
        }
      }
    });
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING': return <Tag color="gold">Pending</Tag>;
      case 'IN_REVIEW': return <Tag color="blue">In Review</Tag>;
      case 'RESOLVED': return <Tag color="green">Resolved</Tag>;
      case 'REJECTED': return <Tag color="red">Rejected</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Reported Item',
      key: 'reported',
      render: (_, r) => (
        r.reportType === 'REPORT_HOTEL'
          ? `[HOTEL] ${r.reportedHotel?.name || 'N/A'}`
          : `[USER] ${r.reportedUser?.username || 'N/A'}`
      )
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: 'Reporter', dataIndex: ['reporterUser', 'username'], key: 'reporter' },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 300,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleUpdateStatus(record, 'RESOLVED')}>
                Mark Resolved
              </Button>
              <Button danger icon={<CloseCircleOutlined />} onClick={() => handleUpdateStatus(record, 'REJECTED')}>
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="report-management-page">
        <Card title="Report Management">
          <Tabs defaultActiveKey="PENDING" type="card" onChange={handleTabChange}>
            <TabPane tab="Pending" key="PENDING" />
            <TabPane tab="In Review" key="IN_REVIEW" />
            <TabPane tab="Resolved" key="RESOLVED" />
            <TabPane tab="Rejected" key="REJECTED" />
          </Tabs>
          <Table
            columns={columns}
            dataSource={reports}
            rowKey="id"
            loading={loading}
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Modal
        title={`Report Details #${selectedReport?.id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsModalOpen(false)}>Close</Button>]}
        width={700}
      >
        {selectedReport && (
          <Descriptions bordered column={1} layout="horizontal">
            <Descriptions.Item label="Reporter">{selectedReport.reporterUser.username}</Descriptions.Item>
            <Descriptions.Item label="Report Type">{selectedReport.reportType}</Descriptions.Item>
            {selectedReport.reportType === 'REPORT_HOTEL' ? (
              <Descriptions.Item label="Reported Hotel">{selectedReport.reportedHotel.name} (ID: {selectedReport.reportedHotel.id})</Descriptions.Item>
            ) : (
              <Descriptions.Item label="Reported User">{selectedReport.reportedUser.username} (ID: {selectedReport.reportedUser.id})</Descriptions.Item>
            )}
            <Descriptions.Item label="Reason">{selectedReport.reason}</Descriptions.Item>
            <Descriptions.Item label="Details">{selectedReport.details || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(selectedReport.status)}</Descriptions.Item>
            <Descriptions.Item label="Reported At">{dayjs(selectedReport.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AdminReportManagement;