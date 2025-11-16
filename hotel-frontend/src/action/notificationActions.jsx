export const NotificationActionTypes = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_ONE_READ: 'MARK_ONE_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
};

export const setNotifications = (notifications) => ({
  type: NotificationActionTypes.SET_NOTIFICATIONS,
  payload: notifications,
});

export const addNotification = (notification) => ({
  type: NotificationActionTypes.ADD_NOTIFICATION,
  payload: notification,
});

export const setOneRead = (notification) => ({
  type: NotificationActionTypes.MARK_ONE_READ,
  payload: notification,
});

export const setAllRead = (notifications) => ({
  type: NotificationActionTypes.MARK_ALL_READ,
  payload: notifications,
});