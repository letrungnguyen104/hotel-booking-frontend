import { NotificationActionTypes } from "@/action/notificationActions";


const initialState = {
  notifications: [],
  unreadCount: 0,
};

const calculateUnread = (notifications) => {
  return notifications.filter(n => n.status === 'UNREAD').length;
};

const notificationReducer = (state = initialState, action) => {
  let newNotifications;
  switch (action.type) {
    case NotificationActionTypes.SET_NOTIFICATIONS:
      newNotifications = action.payload;
      return {
        notifications: newNotifications,
        unreadCount: calculateUnread(newNotifications),
      };

    case NotificationActionTypes.ADD_NOTIFICATION:
      newNotifications = [action.payload, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: calculateUnread(newNotifications),
      };

    case NotificationActionTypes.MARK_ONE_READ:
      newNotifications = state.notifications.map(n =>
        n.id === action.payload.id ? action.payload : n
      );
      return {
        notifications: newNotifications,
        unreadCount: calculateUnread(newNotifications),
      };

    case NotificationActionTypes.MARK_ALL_READ:
      newNotifications = state.notifications.map(n => ({ ...n, status: 'READ' }));
      return {
        notifications: newNotifications,
        unreadCount: calculateUnread(newNotifications),
      };

    default:
      return state;
  }
};

export default notificationReducer;