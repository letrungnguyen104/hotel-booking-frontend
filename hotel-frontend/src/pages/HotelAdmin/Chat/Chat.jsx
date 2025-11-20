import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, Avatar, Spin, Empty, message, Badge, Menu, Dropdown } from 'antd';
import { FlagOutlined } from '@ant-design/icons';
import { Search, Paperclip, Smile, Send, Phone, MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getConversations, getChatHistory, getOnlineUsers } from '@/service/chatService';
import './Chat.scss';
import ReportModal from '@/components/ReportModal/ReportModal';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '@/service/webSocketService';
import {
  setConversations,
  setConversationUnread,
  setMessages,
  setOnlineUsers,
  setActiveChatPartner
} from '@/action/chatActions';

dayjs.extend(relativeTime);

const Chat = () => {
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchText, setSearchText] = useState('');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userReducer);

  const { conversations, messages, onlineUsers } = useSelector(state => state.chatReducer);

  const chatRecipientId = useSelector(state => state.chatReducer.recipientId);
  const chatRecipientHotelId = useSelector(state => state.chatReducer.hotelId);

  const isSocketConnected = useSelector(state => state.chatReducer.isSocketConnected);
  const messageAreaRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messageAreaRef.current?.scrollTo({ top: messageAreaRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  useEffect(() => {
    if (userDetails) {
      setLoadingConvos(true);

      getConversations()
        .then(data => {
          const convos = data || [];
          dispatch(setConversations(convos));

          if (chatRecipientId) {
            const existingConvo = convos.find(c =>
              c.conversationPartnerId === chatRecipientId &&
              c.hotelId === chatRecipientHotelId
            );

            if (existingConvo) {
              handleSelectConvo(existingConvo);
            } else {
              const newConvo = {
                conversationPartnerId: chatRecipientId,
                conversationPartnerName: "New Chat",
                conversationPartnerAvatar: null,
                lastMessage: 'Start chatting...',
                timestamp: new Date().toISOString(),
                unreadCount: 0,
                hotelId: chatRecipientHotelId,
                conversationPartnerUsername: "New Chat"
              };
              dispatch(setConversations([newConvo, ...convos]));
              handleSelectConvo(newConvo);
            }
            dispatch({ type: 'CLEAR_CHAT_RECIPIENT' });
          }
        })
        .catch(() => message.error('Failed to load conversations.'))
        .finally(() => setLoadingConvos(false));

      getOnlineUsers()
        .then(usernames => dispatch(setOnlineUsers(new Set(usernames))))
        .catch(err => console.error("Failed to fetch initial online users", err));
    }
  }, [userDetails, dispatch, chatRecipientId, chatRecipientHotelId]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      dispatch(setActiveChatPartner(null));
      dispatch(setMessages([]));
    };
  }, [dispatch]);

  const handleSelectConvo = async (convo) => {
    setSelectedConvo(convo);
    setLoadingMessages(true);
    dispatch(setMessages([]));

    dispatch(setActiveChatPartner(convo.conversationPartnerId));

    try {
      const history = await getChatHistory(convo.conversationPartnerId, convo.hotelId);
      dispatch(setMessages(history || []));
      dispatch(setConversationUnread(convo.conversationPartnerId));
    } catch {
      message.error('Failed to load chat history.');
    } finally {
      setLoadingMessages(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConvo) return;

    if (!userDetails) {
      message.error("User not loaded. Cannot send message.");
      return;
    }

    const chatMessageRequest = {
      receiverId: selectedConvo.conversationPartnerId,
      hotelId: selectedConvo.hotelId || null,
      message: newMessage.trim(),
      messageType: 'TEXT',
    };

    sendMessage('/app/chat.private', chatMessageRequest);

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
      <div className="chat-layout">
        <aside className="conversation-list">
          <div className="cl-header">
            <h2>Tin nhắn</h2>
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
                  <Empty description="Chưa có tin nhắn nào." />
                )}
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <button type="button" className="icon-btn"><Paperclip size={20} /></button>
                <button type="button" className="icon-btn"><Smile size={20} /></button>
                <input
                  type="text"
                  placeholder={isSocketConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={!isSocketConnected}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!isSocketConnected}
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <h2>Chào mừng bạn đến với Chat</h2>
              <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
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

export default Chat;