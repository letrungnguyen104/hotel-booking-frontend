import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Select,
  Spin,
  Empty,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  MessageOutlined,
  FilterOutlined,
  SendOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  getAllInquiries,
  replyToInquiry,
} from "@/service/inquiryService";
import { toast } from "sonner";
import dayjs from "dayjs";
import "./Support.scss";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Support = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [replyingInquiry, setReplyingInquiry] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [form] = Form.useForm();

  const statusColors = {
    PENDING: "gold",
    RESOLVED: "green",
  };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setInquiries(sortedData);
      filterData(sortedData, statusFilter);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const filterData = (data, status) => {
    if (status === "ALL") {
      setFilteredInquiries(data);
    } else {
      setFilteredInquiries(data.filter((item) => item.status === status));
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    filterData(inquiries, value);
  };

  const handleOpenReplyModal = (record) => {
    setReplyingInquiry(record);
    setIsModalVisible(true);
    if (record.status === "RESOLVED") {
      form.setFieldsValue({ replyMessage: record.adminReply });
    } else {
      form.resetFields();
    }
  };

  const handleCancelReply = () => {
    setIsModalVisible(false);
    setReplyingInquiry(null);
    form.resetFields();
  };

  const handleSendReply = async () => {
    try {
      const values = await form.validateFields();
      setIsReplying(true);

      const result = await replyToInquiry(
        replyingInquiry.id,
        values.replyMessage
      );

      if (result) {
        toast.success("Reply sent successfully via email!");
        handleCancelReply();
        await fetchInquiries();
      }
    } catch (errorInfo) {
      console.log("Validate Failed:", errorInfo);
      toast.error("Please fill out the reply message.");
    } finally {
      setIsReplying(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
      width: 150,
    },
    {
      title: "From",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => (
        <div>
          <Text strong>{record.fullName}</Text>
          <br />
          <Text type="secondary">{record.email}</Text>
        </div>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={statusColors[status] || "default"} key={status}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          icon={
            record.status === "PENDING" ? <MessageOutlined /> : <EyeOutlined />
          }
          onClick={() => handleOpenReplyModal(record)}
          type={record.status === "PENDING" ? "primary" : "default"}
        >
          {record.status === "PENDING" ? "Reply" : "View"}
        </Button>
      ),
    },
  ];

  return (
    <div className="support-page-admin">
      <div className="support-header">
        <Title level={2}>Guest Support Inquiries</Title>
        <Space>
          <Text>Filter by status:</Text>
          <Select
            value={statusFilter}
            style={{ width: 150 }}
            onChange={handleFilterChange}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="ALL">All</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="RESOLVED">Resolved</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredInquiries}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <Empty description="No inquiries found." /> }}
      />

      {replyingInquiry && (
        <Modal
          title={
            replyingInquiry.status === "PENDING"
              ? "Reply to Inquiry"
              : "View Inquiry"
          }
          open={isModalVisible}
          onCancel={handleCancelReply}
          width={700}
          footer={[
            <Button key="back" onClick={handleCancelReply}>
              Cancel
            </Button>,
            replyingInquiry.status === "PENDING" && (
              <Button
                key="submit"
                type="primary"
                loading={isReplying}
                onClick={handleSendReply}
                icon={<SendOutlined />}
              >
                Send Reply
              </Button>
            ),
          ]}
        >
          <div className="inquiry-modal-content">
            <Paragraph>
              <strong>From:</strong> {replyingInquiry.fullName} (
              {replyingInquiry.email})
            </Paragraph>
            <Paragraph>
              <strong>Received:</strong>{" "}
              {dayjs(replyingInquiry.createdAt).format("YYYY-MM-DD HH:mm")}
            </Paragraph>
            <Title level={5}>Guest's Message:</Title>
            <blockquote className="guest-message">
              {replyingInquiry.message}
            </blockquote>
            <Divider />
            <Form form={form} layout="vertical">
              <Form.Item
                name="replyMessage"
                label={
                  replyingInquiry.status === "PENDING"
                    ? "Your Reply (will be sent via email):"
                    : "Your Reply (sent via email):"
                }
                rules={[
                  {
                    required: true,
                    message: "Please enter a reply message.",
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Write your response to the guest..."
                  disabled={replyingInquiry.status === "RESOLVED"}
                />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Support;