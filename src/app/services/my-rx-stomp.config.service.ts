
import { RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';

export const myRxStompConfig: RxStompConfig = {
  // Which server?
  brokerURL: 'ws://13.232.231.237:8080/ws',

  // Headers
  // Typical keys: login, passcode, host
  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable


  heartbeatIncoming: 0, // Typical value 0 - disabled
  heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)  
  reconnectDelay: 200,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  webSocketFactory: () => new SockJS('http://13.232.231.237:8080/ws'),
  debug: (msg: string): void => {
    console.log(new Date(), msg);
  },
  
};