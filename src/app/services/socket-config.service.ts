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
      brokerURL: 'ws://15.207.112.139:8080/ws',

      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      webSocketFactory: () => new SockJS('http://15.207.112.139:8080/ws'),
      debug: (msg: string): void => {
        console.log(new Date(), msg);
      },
    };
  }

  

}
