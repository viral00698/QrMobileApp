import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UrlFilterInterceptor implements HttpInterceptor {

  constructor() {}

  url="http://192.168.1.16:8080";
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = request.url.startsWith('http')? request
      : request.clone({ url: `${this.url}/${request.url}`});
      return next.handle(apiReq);
  }
}
