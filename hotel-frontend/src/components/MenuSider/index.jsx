import { Menu } from "antd";
import { AppstoreOutlined, DashboardOutlined, FormOutlined, SignatureOutlined } from "@ant-design/icons";
import { Link } from "react-router";

function MenuSider() {
  const items = [
    {
      label: <Link to="/hotel-admin-dashboard/dashboard">Dashboard</Link>,
      icon: <DashboardOutlined />,
      key: "dashboard",
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
      label: <Link to="/hotel-admin-dashboard/amenity-management">Amenity Management</Link>,
      icon: <SignatureOutlined />,
      key: "amenitymanagement",
    },
  ];

  return (
    <>
      <Menu
        mode="inline"
        items={items}
        defaultSelectedKeys={["Default"]}
        defaultOpenKeys={["Dashboard"]}
      />
    </>
  )
}

export default MenuSider;