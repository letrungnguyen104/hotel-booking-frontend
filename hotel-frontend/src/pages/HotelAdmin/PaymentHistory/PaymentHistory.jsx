import React, { useEffect, useState, useMemo } from "react";
import { Table, Card, Input, DatePicker, Tag, Button, Modal, Space, Typography, Divider } from "antd";
import { SearchOutlined, PrinterOutlined, EyeOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import { getPaymentHistory } from "@/service/paymentService";
import dayjs from "dayjs";
import "./PaymentHistory.scss";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const data = await getPaymentHistory();
      setPayments(data);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const searchLower = searchText.toLowerCase();
      const matchSearch =
        p.customerName.toLowerCase().includes(searchLower) ||
        p.bookingId.toString().includes(searchLower) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(searchLower));

      let matchDate = true;
      if (dateRange) {
        const pDate = dayjs(p.paymentDate);
        matchDate = pDate.isAfter(dateRange[0]) && pDate.isBefore(dateRange[1]);
      }
      return matchSearch && matchDate;
    });
  }, [payments, searchText, dateRange]);

  const handleViewInvoice = (record) => {
    setSelectedInvoice(record);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      width: 100,
      align: 'center',
      render: (id) => <b style={{ color: '#1677ff' }}>#{id}</b>
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.customerEmail}</div>
        </div>
      )
    },
    {
      title: "Transaction No.",
      dataIndex: "transactionId",
      render: (id) => id ? <span className="transaction-id">{id}</span> : "-"
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: 'right',
      render: (val) => <span className="amount-positive">+{val.toLocaleString()} ₫</span>
    },
    {
      title: "Method",
      dataIndex: "method",
      align: 'center',
      render: (method) => <Tag color="blue">{method}</Tag>
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm")
    },
    {
      title: "Status",
      dataIndex: "status",
      align: 'center',
      render: (status) => {
        let color = status === 'PAID' ? 'success' : status === 'PENDING' ? 'warning' : 'error';
        return <Tag color={color}>{status}</Tag>
      }
    },
    {
      title: "Action",
      align: 'center',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewInvoice(record)}>
          Detail
        </Button>
      )
    }
  ];

  return (
    <div className="payment-history-page">
      <h2>Payment History & Invoices</h2>

      <Card className="filter-card" bordered={false}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search Booking ID, Customer, Transaction..."
            style={{ width: 300 }}
            onChange={e => setSearchText(e.target.value)}
          />
          <RangePicker onChange={setDateRange} />
        </Space>
      </Card>

      <Card className="table-card" bordered={false}>
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="paymentId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>,
          <Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>Close</Button>
        ]}
        width={500}
        className="invoice-modal"
        centered
      >
        {selectedInvoice && (
          <div style={{ padding: '10px' }}>
            <div className="invoice-header">
              <FileTextOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 10 }} />
              <h3>PAYMENT RECEIPT</h3>
              <p>Transaction ID: {selectedInvoice.transactionId || "N/A"}</p>
              <Tag color={selectedInvoice.status === 'PAID' ? 'success' : 'error'}>
                {selectedInvoice.status}
              </Tag>
            </div>

            <div className="invoice-section">
              <h4>Customer Info</h4>
              <div className="invoice-row">
                <span>Name:</span>
                <b>{selectedInvoice.customerName}</b>
              </div>
              <div className="invoice-row">
                <span>Email:</span>
                <span>{selectedInvoice.customerEmail}</span>
              </div>
            </div>

            <div className="invoice-section">
              <h4>Booking Details</h4>
              <div className="invoice-row">
                <span>Booking ID:</span>
                <b>#{selectedInvoice.bookingId}</b>
              </div>
              <div className="invoice-row">
                <span>Room Type:</span>
                <span>{selectedInvoice.roomTypeName}</span>
              </div>
              <div className="invoice-row">
                <span>Check-in:</span>
                <span>{dayjs(selectedInvoice.checkInDate).format("DD/MM/YYYY")}</span>
              </div>
              <div className="invoice-row">
                <span>Check-out:</span>
                <span>{dayjs(selectedInvoice.checkOutDate).format("DD/MM/YYYY")}</span>
              </div>
            </div>

            <div className="invoice-section">
              <h4>Payment Info</h4>
              <div className="invoice-row">
                <span>Date:</span>
                <span>{dayjs(selectedInvoice.paymentDate).format("DD/MM/YYYY HH:mm:ss")}</span>
              </div>
              <div className="invoice-row">
                <span>Method:</span>
                <span>{selectedInvoice.method}</span>
              </div>
              <div className="invoice-row total">
                <span>TOTAL PAID</span>
                <span>{selectedInvoice.amount?.toLocaleString()} VND</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentHistory;