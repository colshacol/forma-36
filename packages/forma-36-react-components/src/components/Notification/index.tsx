/* global Promise */

import React from 'react';
import { render } from 'react-dom';
import NotificationManager, {
  ShowAction,
  CloseAction,
  CloseAllAction,
  SetPositionAction,
  SetDurationAction,
  Intent,
  Notification,
} from './NotificationsManager';

interface NotificationsAPI {
  success: ShowAction<Notification>;
  error: ShowAction<Notification>;
  show: ShowAction<Notification>;
  close: CloseAction<void>;
  closeAll: CloseAllAction<void>;
  setPosition: SetPositionAction<void>;
  setDuration: SetDurationAction<void>;
}

let initiated = false;
const internalAPI: Partial<NotificationsAPI> = {};

function registerAPI(fnName, fn) {
  internalAPI[fnName] = fn;
}

function createRoot(callback) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  render(<NotificationManager register={registerAPI} />, container, callback);
}

const afterInit = fn => (...args) => {
  if (!initiated) {
    initiated = true;
    return new Promise(resolve => {
      createRoot(() => {
        resolve(fn(...args));
      });
    });
  } else {
    return Promise.resolve(fn(...args));
  }
};

const show = (intent: Intent) => (
  text: string,
  settings?: {
    duration?: number;
    canClose?: boolean;
  },
) =>
  internalAPI.show(text, {
    ...(settings || {}),
    intent,
  });

const API: {
  success: ShowAction<Promise<Notification>>;
  error: ShowAction<Promise<Notification>>;
  close: CloseAction<Promise<void>>;
  closeAll: CloseAllAction<Promise<void>>;
  setPosition: SetPositionAction<Promise<void>>;
  setDuration: SetDurationAction<Promise<void>>;
} = {
  success: afterInit(show('success')),
  error: afterInit(show('error')),
  close: afterInit(id => internalAPI.close(id)),
  closeAll: afterInit(() => internalAPI.closeAll()),
  setPosition: afterInit((position, params) =>
    internalAPI.setPosition(position, params),
  ),
  setDuration: afterInit(duration => internalAPI.setDuration(duration)),
};

export default API;