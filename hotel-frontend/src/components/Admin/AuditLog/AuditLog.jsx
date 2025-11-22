import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Card,
  Input,
  DatePicker,
  Tag,
  Button,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  HistoryOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { getAllAuditLogs } from "@/service/auditLogService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "./AuditLog.scss";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAllAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchLower = searchText.toLowerCase();
      const username = log.user?.username?.toLowerCase() || "system";
      const action = log.action?.toLowerCase() || "";
      const details = log.details?.toLowerCase() || "";

      const matchesSearch =
        username.includes(searchLower) ||
        action.includes(searchLower) ||
        details.includes(searchLower);

      let matchesDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const logDate = dayjs(log.createdAt);
        const startDate = dayjs(dateRange[0]).startOf("day");
        const endDate = dayjs(dateRange[1]).endOf("day");
        matchesDate = logDate.isBetween(startDate, endDate, null, "[]");
      }

      return matchesSearch && matchesDate;
    });
  }, [logs, searchText, dateRange]);

  const handleExport = (fileType) => {
    const dataToExport = filteredLogs.map((log) => ({
      ID: log.id,
      User: log.user ? `${log.user.username} (${log.user.email})` : "System/Unknown",
      Action: log.action,
      Details: log.details,
      Time: dayjs(log.createdAt).format("DD/MM/YYYY HH:mm:ss"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Logs");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const fileName = `System_Audit_Logs_${dayjs().format("YYYYMMDD_HHmmss")}`;

    if (fileType === 'csv') {
      saveAs(data, `${fileName}.xlsx`);
    } else {
      saveAs(data, `${fileName}.xlsx`);
    }
  };

  const exportMenu = (
    <Menu onClick={({ key }) => handleExport(key)}>
      <Menu.Item key="xlsx" icon={<FileExcelOutlined />}>
        Export to Excel (.xlsx)
      </Menu.Item>
    </Menu>
  );

  const getActionColor = (action) => {
    if (!action) return "default";
    if (action.includes("LOGIN_SUCCESS")) return "success";
    if (action.includes("LOGIN_FAILED")) return "error";
    if (action.includes("CREATE")) return "cyan";
    if (action.includes("UPDATE")) return "processing";
    if (action.includes("DELETE") || action.includes("BAN")) return "volcano";
    if (action.includes("APPROVE") || action.includes("RESOLVE")) return "green";
    return "default";
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      render: (text) => <span className="text-muted">#{text}</span>,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user) => (
        <div className="user-cell">
          <Avatar
            src={user?.imgPath}
            icon={<UserOutlined />}
            style={{ backgroundColor: user ? "#1677ff" : "#ccc" }}
          />
          <div className="user-info">
            <Text strong>{user ? user.username : "Unknown / System"}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {user?.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 180,
      render: (action) => {
        return (
          <Tooltip title={action}>
            <Tag color={getActionColor(action)} style={{ fontWeight: 600 }}>
              {action}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: {
        showTitle: false,
      },
      render: (details) => (
        <Tooltip placement="topLeft" title={details}>
          <span className="log-details">{details}</span>
        </Tooltip>
      ),
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (date) => (
        <div className="time-cell">
          <HistoryOutlined className="mr-1" />
          {dayjs(date).format("DD/MM/YYYY HH:mm:ss")}
        </div>
      ),
    },
  ];

  return (
    <div className="audit-log-page">
      <div className="page-header">
        <div>
          <Title level={2}>System Audit Logs</Title>
          <Text type="secondary">
            Track and monitor all system activities and security events.
          </Text>
        </div>

        <Dropdown overlay={exportMenu} trigger={['click']}>
          <Button icon={<ExportOutlined />}>Export Data</Button>
        </Dropdown>
      </div>

      <Card bordered={false} className="filter-card">
        <div className="filter-bar">
          <Input
            placeholder="Search by User, Action, or Details..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="search-input"
          />
          <RangePicker
            className="date-picker"
            format="DD/MM/YYYY"
            onChange={(dates) => setDateRange(dates)}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchLogs}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </Card>

      <Card bordered={false} className="table-card">
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} logs`,
            style: {
              paddingRight: "24px"
            }
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default AuditLog;