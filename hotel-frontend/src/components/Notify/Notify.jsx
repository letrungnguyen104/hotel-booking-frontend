// src/components/Notify/Notify.jsx
import React, { useState, useEffect } from 'react';
import { BellOutlined, CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Menu, Spin, Empty, Modal } from 'antd';
import { getMyNotifications, markAsRead, markAllAsRead } from '@/service/notificationService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import "./Notify.scss";
import { useSelector } from 'react-redux';

dayjs.extend(relativeTime);

const NotifyItem = ({ notification }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'HOTEL_STATUS':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'MANUAL_ADMIN':
        return <MailOutlined style={{ color: '#1890ff' }} />;
      default:
        return <BellOutlined />;
    }
  };

  return (
    <div className={`notify__item ${notification.status}`}>
      {notification.status === 'UNREAD' && <div className="unread-dot" />}
      <div className="notify__item-icon">
        {getIcon(notification.type)}
      </div>
      <div className="notify__item-content">
        <div className="notify__item-title">{notification.title}</div>
        <div className="notify__item-message">{notification.message}</div>
        <div className="notify__item-time">
          {dayjs(notification.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};

function Notify() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const isLogin = useSelector((state) => state.loginReducer);

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [isLogin]);


  const handleItemClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
    if (notification.status === 'UNREAD') {
      markAsRead(notification.id).then(updatedNotification => {
        setNotifications(prev =>
          prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
        );
      });
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead().then(() => {
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'READ' }))
      );
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  // Tạo menu items từ data
  const items = notifications.map(notification => ({
    key: notification.id,
    label: <NotifyItem notification={notification} />,
    onClick: () => handleItemClick(notification)
  }));

  const menu = (
    <div className="notify__dropdown">
      <div className="notify__header">
        <div className="notify__header-title">
          <BellOutlined /> Notification
        </div>
        <Button type="link" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </div>
      <div className="notify__body">
        {loading ? (
          <div className="notify-loading"><Spin /></div>
        ) : items.length > 0 ? (
          <Menu items={items} />
        ) : (
          <Empty description="No notifications" />
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dropdown
        dropdownRender={() => menu}
        trigger={['click']}
        open={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <Badge count={unreadCount} className='notify__badge'>
          <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />
        </Badge>
      </Dropdown>

      <Modal
        title={selectedNotification?.title}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[<Button key="close" type="primary" onClick={handleCloseModal}>Close</Button>]}
      >
        {selectedNotification && (
          <>
            <p className="modal-notify-time">{dayjs(selectedNotification.createdAt).format('HH:mm DD/MM/YYYY')}</p>
            <p>{selectedNotification.message}</p>
          </>
        )}
      </Modal>
    </>
  );
}

export default Notify;