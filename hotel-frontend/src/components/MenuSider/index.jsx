import { Menu } from "antd";
import { AppstoreOutlined, CreditCardOutlined, DashboardOutlined, DollarOutlined, FormOutlined, SignatureOutlined } from "@ant-design/icons";
import { Link } from "react-router";

function MenuSider() {
  const items = [
    {
      label: <Link to="/hotel-admin-dashboard/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "dashboard",
    },
    {
      label: <Link to="/hotel-admin-dashboard/wallet">My Wallet</Link>,
      icon: <CreditCardOutlined />,
      key: "wallet",
    },
    {
      label: <Link to="/hotel-admin-dashboard/payment-history">Payment History</Link>,
      icon: <DollarOutlined />,
      key: "payment-history",
    },
    {
      label: <Link to="/hotel-admin-dashboard/hotel-management">Hotel Management</Link>,
      icon: <FormOutlined />,
      key: "hotelmanagement",
    },
    {
      label: <Link to="/hotel-admin-dashboard/booking-management">Booking Management</Link>,
      icon: <AppstoreOutlined />,
      key: "bookingmanagement",
    },
    {
      label: <Link to="/hotel-admin-dashboard/chat">Chat</Link>,
      icon: <SignatureOutlined />,
      key: "chat",
    },
  ];

  return (
    <>
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={["dashboard"]}
        defaultOpenKeys={["dashboard"]}
      />
    </>
  )
}

export default MenuSider;