import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Card,
  Row,
  Col,
  Dropdown,
  Menu
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MessageOutlined,
  ExportOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { getAllUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '@/service/userService';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import './AdminUserManagement.scss';
import { getProvinces } from '@/service/locationService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Option } = Select;
const { Search } = Input;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      message.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = (user) => {
    dispatch({
      type: 'ADMIN_START_CHAT_WITH',
      payload: {
        recipientId: user.id,
        recipientName: user.fullName || user.username
      }
    });
    navigate('/admin/message');
  };

  useEffect(() => {
    fetchUsers();
    getProvinces().then(data => {
      if (data) {
        setProvinces(data.map(p => ({ value: p.name, label: p.name })));
      }
    });
  }, []);

  const handleSearch = (value) => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleExport = (fileType) => {
    const dataToExport = filteredUsers.map((user) => ({
      ID: user.id,
      Username: user.username,
      "Full Name": user.fullName,
      Email: user.email,
      Phone: user.phoneNumber,
      Address: user.address,
      Status: user.status === 1 ? "ACTIVE" : "INACTIVE",
      Roles: user.roles.map(r => r.roleName).join(", "),
      "Created At": user.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY HH:mm") : ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User List");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    const fileName = `User_List_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;
    saveAs(data, fileName);

    toast.success("User list exported successfully!");
  };

  const exportMenu = (
    <Menu onClick={({ key }) => handleExport(key)}>
      <Menu.Item key="xlsx" icon={<FileExcelOutlined />}>
        Export to Excel (.xlsx)
      </Menu.Item>
    </Menu>
  );

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ status: 1, roles: ['USER'] });
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      roles: user.roles.map(role => role.roleName),
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await adminUpdateUser(editingUser.id, values);
        toast.success("User updated successfully!");
      } else {
        await adminCreateUser(values);
        toast.success("User created successfully!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (user) => {
    Swal.fire({
      title: `Deactivate ${user.username}?`,
      text: "This will set the user's status to inactive. They can be reactivated later.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminDeleteUser(user.id);
          toast.success(`User ${user.username} deactivated.`);
          fetchUsers();
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to deactivate user.');
        }
      }
    });
  };

  const filterProvinces = (input, option) =>
    (option?.label ?? '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .includes(input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Username', dataIndex: 'username', key: 'username', sorter: (a, b) => a.username.localeCompare(b.username) },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Roles', dataIndex: 'roles', key: 'roles',
      render: (roles) => (
        <>
          {roles.map(role => (
            <Tag color={role.roleName === 'ADMIN' ? 'purple' : 'blue'} key={role.roleName}>
              {role.roleName}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<MessageOutlined />} onClick={() => handleChat(record)}>Chat</Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          {record.status === 1 && (
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Deactivate</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-management">
      <Card
        title="User Management"
        extra={
          <Space>
            <Dropdown overlay={exportMenu} trigger={['click']}>
              <Button icon={<ExportOutlined />}>Export Data</Button>
            </Dropdown>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Create User
            </Button>
          </Space>
        }
      >
        <Search
          placeholder="Search by username, email, or name..."
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
          enterButton
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          bordered
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Create New User"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phoneNumber" label="Phone Number">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Address (Province/City)">
            <Select
              showSearch
              placeholder="Select or search for province"
              options={provinces}
              filterOption={filterProvinces}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                <Select>
                  <Option value={1}>ACTIVE</Option>
                  <Option value={0}>INACTIVE</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="roles" label="Roles" rules={[{ required: true }]}>
                <Select mode="multiple" placeholder="Select roles">
                  <Option value="USER">USER</Option>
                  <Option value="ADMIN">ADMIN</Option>
                  <Option value="HOTEL_ADMIN">HOTEL_ADMIN</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting} block>
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;