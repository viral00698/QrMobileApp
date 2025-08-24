import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { myRxStompConfig } from './my-rx-stomp.config.service';

@Injectable({
  providedIn: 'root'
})
export class RxStompService extends RxStomp {
  private configured = false;
  private connectedOnce = false;
  constructor() {
    super();
    // this.configure(myRxStompConfig);
  }

  /** Connect only if not already connected */
  connectIfNeeded(): void {
    if (this.connectedOnce || this.connected()) {
      console.log('Already connected, skipping activation.');
      return;
    }
    this.activate();
    this.connectedOnce = true;

    this.connectionState$.subscribe((state) => {
      console.log('WebSocket connection state:', state);
    });
  }

  configureOnce(config: any): void {
    if (!this.configured) {
      this.configure(config);
      this.configured = true;
    }
  }
}