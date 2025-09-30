import MenuSider from '@/components/MenuSider';
import { Layout } from 'antd'
import React, { useState } from 'react'
import { Outlet } from 'react-router';
import "./HotelAdminDashboard.scss";

const { Sider, Content } = Layout;

const HotelAdminDashboard = () => {

  const [collapse, setCollapse] = useState(false);

  return (
    <Layout>
      <Sider className="sider" collapsed={collapse} theme="light">
        <MenuSider />
      </Sider>
      <Content className="content">
        <Outlet />
      </Content>
    </Layout>
  )
}

export default HotelAdminDashboard