import { Component, OnInit } from '@angular/core';
import { RxStompService } from './services/rx-stomp.service';
import { SocketConfigService } from './services/socket-config.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Vitts.in';
  protected isLoading = this.loaderService.isLoading;

  constructor(private stompService: RxStompService,private stompConfigService: SocketConfigService ,  private loaderService: LoaderService) {
       // Configure only once
    this.stompService.configureOnce(this.stompConfigService.getRxStompConfig());

    // Connect only if not already connected
    this.stompService.connectIfNeeded();
  }
  ngOnInit(): void {
    setTimeout(() => {
    this.isLoading = this.loaderService.isLoading;
  });
  }
}
