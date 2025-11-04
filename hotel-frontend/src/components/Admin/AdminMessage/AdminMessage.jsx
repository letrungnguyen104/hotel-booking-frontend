// src/components/Admin/AdminMessage/AdminMessage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, Avatar, Spin, Empty, message, Badge, Menu, Dropdown } from 'antd';
import { FlagOutlined } from '@ant-design/icons';
import { Search, Paperclip, Smile, Send, Phone, MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getChatHistory, getOnlineUsers, getAdminConversations } from '@/service/chatService';
import { getToken } from '@/service/tokenService';
import ReportModal from '@/components/ReportModal/ReportModal';
import './AdminMessage.scss';

dayjs.extend(relativeTime);

const AdminMessage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [searchText, setSearchText] = useState('');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const userDetails = useSelector(state => state.userReducer);

  const dispatch = useDispatch();
  const chatRecipient = useSelector(state => state.adminChatReducer);

  const messageAreaRef = useRef(null);
  const stompClientRef = useRef(null);
  const selectedConvoRef = useRef(null);

  useEffect(() => { selectedConvoRef.current = selectedConvo; }, [selectedConvo]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageAreaRef.current?.scrollTo({ top: messageAreaRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const handleNewMessage = (receivedMessage) => {
    const currentConvo = selectedConvoRef.current;
    const currentUser = userDetails;

    const partnerId = receivedMessage.senderId === currentUser.id
      ? receivedMessage.receiverId
      : receivedMessage.senderId;
    const isMe = receivedMessage.senderId === currentUser.id;

    setConversations(prevConvos => {
      const convoToUpdate = prevConvos.find(c => c.conversationPartnerId === partnerId);
      let updatedConvos = prevConvos.filter(c => c.conversationPartnerId !== partnerId);
      const partnerName = isMe ? (receivedMessage.receiverFullName || receivedMessage.receiverUsername) : (receivedMessage.senderFullName || receivedMessage.senderUsername);
      const partnerUsername = isMe ? receivedMessage.receiverUsername : receivedMessage.senderUsername;

      const newConvoData = {
        ...(convoToUpdate || {}),
        conversationPartnerId: partnerId,
        conversationPartnerName: partnerName,
        conversationPartnerUsername: partnerUsername,
        conversationPartnerAvatar: convoToUpdate?.conversationPartnerAvatar || null,
        lastMessage: isMe ? `Bạn: ${receivedMessage.message}` : receivedMessage.message,
        timestamp: receivedMessage.sentAt,
        unreadCount: (currentConvo?.conversationPartnerId === partnerId || isMe) ? 0 : (convoToUpdate?.unreadCount || 0) + 1,
        hotelId: receivedMessage.hotelId
      };
      return [newConvoData, ...updatedConvos];
    });

    if (currentConvo && (receivedMessage.senderId === currentConvo.conversationPartnerId || receivedMessage.receiverId === currentConvo.conversationPartnerId)) {
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
      scrollToBottom();
    }
  };


  useEffect(() => {
    if (!userDetails || stompClientRef.current) return;
    const token = getToken();
    if (!token) {
      message.error('Authentication token not found.');
      return;
    }

    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: async () => {
        stompClientRef.current = client;

        try {
          const onlineUsernames = await getOnlineUsers();
          setOnlineUsers(new Set(onlineUsernames));
        } catch (err) {
          console.error("Failed to fetch initial online users", err);
        }

        client.subscribe('/user/queue/messages', (message) => {
          handleNewMessage(JSON.parse(message.body));
        });

        client.subscribe('/topic/presence', (message) => {
          const presenceMessage = JSON.parse(message.body);
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            if (presenceMessage.status === 'ONLINE') newSet.add(presenceMessage.username);
            else newSet.delete(presenceMessage.username);
            return newSet;
          });
        });

        setLoadingConvos(true);
        getAdminConversations()
          .then(data => {
            const convos = data || [];
            setConversations(convos);

            if (chatRecipient.recipientId) {
              const existingConvo = convos.find(c => c.conversationPartnerId === chatRecipient.recipientId);
              if (existingConvo) {
                handleSelectConvo(existingConvo);
              } else {
                const newConvo = {
                  conversationPartnerId: chatRecipient.recipientId,
                  conversationPartnerName: chatRecipient.recipientName,
                  conversationPartnerAvatar: null,
                  lastMessage: 'Start chatting...',
                  timestamp: new Date().toISOString(),
                  unreadCount: 0,
                  hotelId: null,
                  conversationPartnerUsername: chatRecipient.recipientName
                };
                setConversations(prev => [newConvo, ...prev]);
                setSelectedConvo(newConvo);
                setMessages([]);
              }
              dispatch({ type: 'ADMIN_CLEAR_CHAT_RECIPIENT' });
            }
          })
          .catch(() => message.error('Failed to load user list.'))
          .finally(() => setLoadingConvos(false));
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
      },
    });

    client.activate();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [userDetails, dispatch, chatRecipient]);

  const handleSelectConvo = async (convo) => {
    setSelectedConvo(convo);
    setLoadingMessages(true);
    setMessages([]);
    try {
      const history = await getChatHistory(convo.conversationPartnerId, convo.hotelId);
      setMessages(history || []);
      setConversations(prev =>
        prev.map(c => c.conversationPartnerId === convo.conversationPartnerId ? { ...c, unreadCount: 0 } : c)
      );
    } catch {
      message.error('Failed to load chat history.');
    } finally {
      setLoadingMessages(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const client = stompClientRef.current;
    if (newMessage.trim() === '' || !client || !selectedConvo) return;
    if (!client.connected) {
      message.error('Chat is not connected. Please wait.');
      return;
    }

    const chatMessageRequest = {
      receiverId: selectedConvo.conversationPartnerId,
      hotelId: selectedConvo.hotelId || null, // ✅ Gửi hotelId (nếu có) hoặc null
      message: newMessage.trim(),
      messageType: 'TEXT',
    };

    client.publish({
      destination: '/app/chat.private',
      body: JSON.stringify(chatMessageRequest)
    });
    setNewMessage('');
  };

  const handleOpenReportModal = () => {
    if (!selectedConvo) return;
    setReportTarget({
      type: 'USER',
      id: selectedConvo.conversationPartnerId,
      name: selectedConvo.conversationPartnerName
    });
    setIsReportModalOpen(true);
  };

  const menu = (
    <Menu onClick={({ key }) => {
      if (key === 'report') {
        handleOpenReportModal();
      }
    }}>
      <Menu.Item key="report" danger icon={<FlagOutlined />}>
        Report this user
      </Menu.Item>
    </Menu>
  );

  const filteredConversations = useMemo(() => {
    if (!searchText) {
      return conversations;
    }
    const lowerSearch = searchText.toLowerCase();
    return conversations.filter(convo =>
      convo.conversationPartnerName.toLowerCase().includes(lowerSearch) ||
      convo.conversationPartnerUsername.toLowerCase().includes(lowerSearch)
    );
  }, [conversations, searchText]);

  if (!userDetails) {
    return <div className="chat-layout"><Spin size="large" /></div>;
  }

  const isSelectedOnline = selectedConvo && onlineUsers.has(selectedConvo.conversationPartnerUsername);

  return (
    <>
      <div className="chat-layout admin-chat-layout">
        <aside className="conversation-list">
          <div className="cl-header">
            <h2>All Users</h2>
            <Input
              className="cl-search"
              placeholder="Search users..."
              prefix={<Search size={16} color="#888" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="cl-items">
            {loadingConvos ? (
              <div className="chat-loading"><Spin /></div>
            ) : (
              filteredConversations.map(convo => {
                const isOnline = onlineUsers.has(convo.conversationPartnerUsername);
                return (
                  <div
                    key={convo.conversationPartnerId}
                    className={`convo-item ${selectedConvo?.conversationPartnerId === convo.conversationPartnerId ? 'active' : ''}`}
                    onClick={() => handleSelectConvo(convo)}
                  >
                    <Badge dot status={isOnline ? 'success' : 'default'} offset={[-5, 40]}>
                      <Avatar src={convo.conversationPartnerAvatar} size={48} className="convo-avatar" />
                    </Badge>
                    <div className="convo-details">
                      <div className="convo-top">
                        <span className="convo-name">{convo.conversationPartnerName}</span>
                        <span className="convo-timestamp">{dayjs(convo.timestamp).fromNow()}</span>
                      </div>
                      <div className="convo-bottom">
                        <p className="convo-last-message">{convo.lastMessage}</p>
                        {convo.unreadCount > 0 && <span className="unread-badge">{convo.unreadCount}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <main className="chat-window">
          {selectedConvo ? (
            <>
              <header className="chat-header">
                <div className="ch-user">
                  <Avatar src={selectedConvo.conversationPartnerAvatar} size={40} />
                  <div className="ch-user-details">
                    <h4>{selectedConvo.conversationPartnerName}</h4>
                    <span className={isSelectedOnline ? 'online' : 'offline'}>
                      {isSelectedOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="ch-actions">
                  <button className="icon-btn"><Phone size={20} /></button>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <button className="icon-btn"><MoreVertical size={20} /></button>
                  </Dropdown>
                </div>
              </header>
              <div className="message-area" ref={messageAreaRef}>
                {loadingMessages ? (
                  <div className="chat-loading"><Spin size="large" /></div>
                ) : messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={msg.id || index} className={`message-bubble ${msg.senderId === userDetails.id ? 'sent' : 'received'}`}>
                      {msg.senderId !== userDetails.id && <Avatar src={selectedConvo.conversationPartnerAvatar} size={32} className="message-avatar" />}
                      <div className="message-content">
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description="No messages yet. Start the conversation!" />
                )}
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <button type="button" className="icon-btn"><Paperclip size={20} /></button>
                <button type="button" className="icon-btn"><Smile size={20} /></button>
                <input
                  type="text"
                  placeholder="Enter message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h2>Admin Message Center</h2>
              <p>Select a user from the list to start chatting.</p>
            </div>
          )}
        </main>
      </div>

      <ReportModal
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        target={reportTarget}
      />
    </>
  );
};

export default AdminMessage;