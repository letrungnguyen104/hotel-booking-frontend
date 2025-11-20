import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Card, Space, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { getWithdrawalRequests, approveWithdrawal, rejectWithdrawal } from "@/service/walletService";
import { toast } from "sonner";
import dayjs from "dayjs";
import "./WithdrawalManagement.scss"; // <-- Import SCSS

const WithdrawalManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await getWithdrawalRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveWithdrawal(id);
      toast.success("Request approved!");
      fetchRequests();
    } catch (e) { }
  };

  const handleReject = async (id) => {
    try {
      await rejectWithdrawal(id);
      toast.success("Request rejected.");
      fetchRequests();
    } catch (e) { }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      align: 'center',
      render: (id) => <span style={{ color: '#888' }}>#{id}</span>
    },
    {
      title: "Hotel Owner",
      render: (_, record) => (
        <span className="user-info">
          {record.wallet?.user?.username || "Unknown"}
        </span>
      )
    },
    {
      title: "Amount Requested",
      dataIndex: "amount",
      render: (val) => <span className="amount-highlight">{val.toLocaleString()} VND</span>
    },
    {
      title: "Bank Details (Transfer To)",
      render: (_, record) => (
        <div className="bank-details">
          <div className="bank-name">{record.bankName}</div>
          <div className="account-number">{record.bankAccountNumber}</div>
          <div className="holder-name">{record.accountHolderName}</div>
        </div>
      )
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color="gold" style={{ fontWeight: 600 }}>
          {status}
        </Tag>
      )
    },
    {
      title: "Action",
      align: 'center',
      render: (_, record) => (
        record.status === 'PENDING' && (
          <Space>
            <Popconfirm
              title="Confirm Transfer"
              description="Have you manually transferred the money?"
              onConfirm={() => handleApprove(record.id)}
              okText="Yes, Approved"
              cancelText="No"
            >
              <Button type="primary" icon={<CheckOutlined />} size="small" style={{ backgroundColor: '#52c41a' }}>
                Approve
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Reject Request"
              description="Money will be refunded to user's wallet."
              onConfirm={() => handleReject(record.id)}
              okText="Yes, Reject"
              cancelText="No"
            >
              <Button danger icon={<CloseOutlined />} size="small">
                Reject
              </Button>
            </Popconfirm>
          </Space>
        )
      )
    }
  ];

  return (
    <div className="withdrawal-management-page">
      <div className="page-header">
        <h2>Withdrawal Requests</h2>
        <p>Review and process payout requests from hotel partners.</p>
      </div>

      <Card className="requests-card" bordered={false}>
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default WithdrawalManagement;