import { Component } from '@angular/core';
import { RxStompService } from './services/rx-stomp.service';
import { SocketConfigService } from './services/socket-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MobileQrApp';
  constructor(private stompService: RxStompService,private stompConfigService: SocketConfigService) {
    this.stompService.configure(this.stompConfigService.getRxStompConfig());
    this.stompService.activate();
  }
}
