import { Component, OnInit } from '@angular/core';
import { RxStompService } from 'src/app/services/rx-stomp.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  constructor(private stompService: RxStompService) { }
  ngOnInit(): void {
    this.getCurrentOrderStatus()
  }

  getHistoryOrderFromDB() {

  }

  getCurrentOrderStatus() {
    this.stompService.watch('/queue/a1e68d9a-4d59-4f25-a579-2bb23e928686/messages').subscribe((res: any) => {
      console.log(JSON.parse(res.body));
      
    debugger
    })
  }
}
