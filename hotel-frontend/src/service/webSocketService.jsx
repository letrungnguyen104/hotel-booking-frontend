import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { addNotification } from '@/action/notificationActions';
import { addMessageToHistory, handleNewChatMessage, setOnlineUsers } from '@/action/chatActions';
import { toast } from 'sonner';
import { addAdminMessageToHistory, handleNewAdminChatMessage, setAdminOnlineUsers, setAdminSocketConnected } from '@/action/adminChatActions';
import { setSocketConnected } from '@/action/chatActions';

let stompClient = (process.env.NODE_ENV === 'development' && window.stompClient)
  ? window.stompClient
  : null;
let store = null;

const onConnect = (currentUserId) => {
  console.log('WebSocket Connected!');
  store.dispatch(setSocketConnected(true));
  store.dispatch(setAdminSocketConnected(true));

  stompClient.subscribe('/user/queue/notifications', (message) => {
    const notification = JSON.parse(message.body);
    toast.info(notification.title, {
      description: notification.message,
      action: {
        label: "View",
        onClick: () => console.log("Clicked notification:", notification.link),
      },
    });
    store.dispatch(addNotification(notification));
  });

  stompClient.subscribe('/user/queue/messages', (message) => {
    const receivedMessage = JSON.parse(message.body);
    const state = store.getState();
    const userActiveChatId = state.chatReducer.activeChatPartnerId;
    const adminActiveChatId = state.adminChatReducer.activeChatPartnerId;

    store.dispatch(handleNewChatMessage(receivedMessage, currentUserId));
    store.dispatch(handleNewAdminChatMessage(receivedMessage, currentUserId));

    if (userActiveChatId && (receivedMessage.senderId === userActiveChatId || receivedMessage.receiverId === userActiveChatId)) {
      store.dispatch(addMessageToHistory(receivedMessage));
    }

    if (adminActiveChatId && (receivedMessage.senderId === adminActiveChatId || receivedMessage.receiverId === adminActiveChatId)) {
      store.dispatch(addAdminMessageToHistory(receivedMessage));
    }
  });
  stompClient.subscribe('/topic/presence', (message) => {
    const presenceMessage = JSON.parse(message.body);
    const state = store.getState();

    const userOnlineUsers = state.chatReducer.onlineUsers;
    const newUserSet = new Set(userOnlineUsers);
    if (presenceMessage.status === 'ONLINE') newUserSet.add(presenceMessage.username);
    else newUserSet.delete(presenceMessage.username);
    store.dispatch(setOnlineUsers(newUserSet));

    const adminOnlineUsers = state.adminChatReducer.onlineUsers;
    const newAdminSet = new Set(adminOnlineUsers);
    if (presenceMessage.status === 'ONLINE') newAdminSet.add(presenceMessage.username);
    else newAdminSet.delete(presenceMessage.username);
    store.dispatch(setAdminOnlineUsers(newAdminSet));
  });
};

const onError = (error) => {
  console.error('WebSocket Error:', error);
  toast.error("Chat connection error. Please refresh the page.");

  if (store) {
    store.dispatch(setSocketConnected(false));
    store.dispatch(setAdminSocketConnected(false));
  }
};

export const connectWebSocket = (token, reduxStore, currentUserId) => {
  if (stompClient && stompClient.active) {
    console.log("WebSocket already connected.");
    return;
  }

  store = reduxStore;

  const socket = new SockJS('http://localhost:8081/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 10000,
    onConnect: () => onConnect(currentUserId),
    onStompError: onError,
  });

  stompClient.activate();

  if (process.env.NODE_ENV === 'development') {
    window.stompClient = stompClient;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;

    if (store) {
      store.dispatch(setSocketConnected(false));
      store.dispatch(setAdminSocketConnected(false));
    }

    store = null;
    console.log('WebSocket Disconnected.');

    if (process.env.NODE_ENV === 'development') {
      window.stompClient = null;
    }
  }
};

export const sendMessage = (destination, body) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(body),
    });
  } else {
    console.error('Cannot send message: WebSocket client is not connected or initialized.');
    toast.error('Chat service is not connected. Please wait or refresh the page.');
  }
};