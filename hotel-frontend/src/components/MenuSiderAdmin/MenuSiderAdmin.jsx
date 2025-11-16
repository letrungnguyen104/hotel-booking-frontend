// src/components/MenuSiderAdmin/MenuSiderAdmin.jsx
import { Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  AreaChartOutlined,
  MessageOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  FireOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

function MenuSiderAdmin({ collapsed }) {
  const items = [
    {
      label: <Link to="/admin/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "dashboard",
    },
    {
      label: "Management",
      icon: <AppstoreOutlined />,
      key: "management",
      children: [
        {
          label: <Link to="/admin/user-management">User Management</Link>,
          icon: <UserOutlined />,
          key: "usermanagement",
        },
        {
          label: <Link to="/admin/hotel-management">Hotel Management</Link>,
          icon: <ShopOutlined />,
          key: "hotelmanagement",
        },
        {
          label: <Link to="/admin/report-management">Report Management</Link>,
          icon: <AreaChartOutlined />,
          key: "reportmanagement",
        },
        {
          label: <Link to="/admin/business-registration">Business Registration</Link>,
          icon: <SolutionOutlined />,
          key: "businessregistration",
        },
        {
          label: <Link to="/admin/promotion">Promotion</Link>,
          icon: <FireOutlined />,
          key: "promotion",
        },
      ]
    },
    {
      label: <Link to="/admin/message">Message</Link>,
      icon: <MessageOutlined />,
      key: "message",
    },
    {
      label: <Link to="/admin/support">Support</Link>,
      icon: <NotificationOutlined />,
      key: "support",
    },
  ];

  return (
    <>
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={["dashboard"]}
        defaultOpenKeys={["management"]}
        inlineCollapsed={collapsed}
      />
    </>
  )
}

export default MenuSiderAdmin;