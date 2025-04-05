import { Injectable } from '@angular/core';
import { RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root'
})
export class SocketConfigService {
  jwtToken:string | undefined;
  constructor() {}

 
  getRxStompConfig(): RxStompConfig {
    return {
      brokerURL: 'wss://qr.vitts.in/ws',

      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      webSocketFactory: () => new SockJS('wss://qr.vitts.in/ws'),
      debug: (msg: string): void => {
        console.log(new Date(), msg);
      },
    };
  }

  

}
