
// import { myRxStompConfig } from './my-rx-stomp.config.service';
import { RxStompService } from './rx-stomp.service';

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  // rxStomp.configure(myRxStompConfig.getRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}