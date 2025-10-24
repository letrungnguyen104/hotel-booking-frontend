// src/pages/Chat/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Input, Avatar, Spin, Empty, message } from 'antd';
import { Search, Paperclip, Smile, Send, Phone, MoreVertical } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useDispatch, useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { getConversations, getChatHistory } from '@/service/chatService';
import './Chat.scss';
import { getToken } from '@/service/tokenService';

dayjs.extend(relativeTime);

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userReducer);
  const chatRecipient = useSelector(state => state.chatReducer);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    if (!userDetails) return;
    const token = getToken();
    if (!token) {
      message.error("Authentication token not found. Cannot connect to chat.");
      return;
    }

    const socket = new SockJS('http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket!');
        setStompClient(client);
        client.subscribe(`/user/${userDetails.username}/queue/messages`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          handleNewMessage(receivedMessage);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
        console.log('WebSocket disconnected.');
      }
    };
  }, [userDetails]);
  useEffect(() => {
    if (stompClient && userDetails) {
      setLoadingConvos(true);
      getConversations()
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
                lastMessage: "Start chatting...",
                timestamp: new Date().toISOString(),
                unreadCount: 0,
                hotelId: chatRecipient.hotelId
              };
              setConversations(prev => [newConvo, ...prev]);
              setSelectedConvo(newConvo);
              setMessages([]);
            }
            dispatch({ type: 'CLEAR_CHAT_RECIPIENT' });
          }
        })
        .catch(err => message.error("Failed to load conversations."))
        .finally(() => setLoadingConvos(false));
    }
  }, [stompClient, userDetails, dispatch]);
  const handleNewMessage = (receivedMessage) => {
    setConversations(prevConvos => {
      const partnerId = receivedMessage.senderId === userDetails.id
        ? receivedMessage.receiverId
        : receivedMessage.senderId;
      const isMe = receivedMessage.senderId === userDetails.id;

      const convoToUpdate = prevConvos.find(c => c.conversationPartnerId === partnerId);
      let updatedConvos = prevConvos.filter(c => c.conversationPartnerId !== partnerId);

      const newConvoData = {
        ...(convoToUpdate || {}),
        conversationPartnerId: partnerId,
        conversationPartnerName: isMe ? receivedMessage.receiverUsername : receivedMessage.senderUsername,
        conversationPartnerAvatar: convoToUpdate?.conversationPartnerAvatar || null,
        lastMessage: isMe ? `Bạn: ${receivedMessage.message}` : receivedMessage.message,
        timestamp: receivedMessage.sentAt,
        unreadCount: (selectedConvo?.conversationPartnerId === partnerId || isMe) ? 0 : (convoToUpdate?.unreadCount || 0) + 1,
        hotelId: receivedMessage.hotelId
      };

      return [newConvoData, ...updatedConvos];
    });

    if (selectedConvo &&
      (receivedMessage.senderId === selectedConvo.conversationPartnerId ||
        receivedMessage.receiverId === selectedConvo.conversationPartnerId)) {
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
      scrollToBottom();
    }
  };

  const handleSelectConvo = async (convo) => {
    setSelectedConvo(convo);
    setLoadingMessages(true);
    setMessages([]);

    try {
      const history = await getChatHistory(convo.conversationPartnerId);
      setMessages(history || []);
      setConversations(prev =>
        prev.map(c => c.conversationPartnerId === convo.conversationPartnerId ? { ...c, unreadCount: 0 } : c)
      );
    } catch (error) {
      message.error("Failed to load chat history.");
    } finally {
      setLoadingMessages(false);
      scrollToBottom();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !stompClient || !selectedConvo) return;
    if (!selectedConvo.hotelId) {
      const hotelId = selectedConvo.hotelId || chatRecipient.hotelId;
      if (!hotelId) {
        message.error("Cannot determine hotelId for this conversation.");
        return;
      }
      setSelectedConvo(prev => ({ ...prev, hotelId: hotelId }));
    }

    const chatMessageRequest = {
      receiverId: selectedConvo.conversationPartnerId,
      hotelId: selectedConvo.hotelId,
      message: newMessage.trim(),
      messageType: "TEXT",
    };
    stompClient.publish({
      destination: '/app/chat.private',
      body: JSON.stringify(chatMessageRequest)
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messageAreaRef.current?.scrollTo({ top: messageAreaRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  if (!userDetails) {
    return <div className="chat-layout"><Spin size="large" /></div>;
  }

  return (
    <div className="chat-layout">
      <aside className="conversation-list">
        <div className="cl-header">
          <h2>Tin nhắn</h2>
          <Input className="cl-search" placeholder="Tìm kiếm khách hàng..." prefix={<Search size={16} color="#888" />} />
        </div>
        <div className="cl-items">
          {loadingConvos ? (
            <div className="chat-loading"><Spin /></div>
          ) : (
            conversations.map(convo => (
              <div
                key={convo.conversationPartnerId}
                className={`convo-item ${selectedConvo?.conversationPartnerId === convo.conversationPartnerId ? 'active' : ''}`}
                onClick={() => handleSelectConvo(convo)}
              >
                <Avatar src={convo.conversationPartnerAvatar} size={48} className="convo-avatar" />
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
            ))
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
                  <span>Đang hoạt động</span>
                </div>
              </div>
              <div className="ch-actions">
                <button className="icon-btn"><Phone size={20} /></button>
                <button className="icon-btn"><MoreVertical size={20} /></button>
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
                placeholder="Nhập tin nhắn..."
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
            <h2>Chào mừng bạn đến với Chat</h2>
            <p>Chọn một cuộc trò chuyện để bắt đầu.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Chat;