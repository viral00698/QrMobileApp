import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { StorageKey } from '../constent/storage-key';
import { AuthenticationService } from '../services/authentication.service';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';

@Injectable()
export class UrlFilterInterceptor implements HttpInterceptor {

  // url="http://192.168.108.204:8080";
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const apiReq = request.url.startsWith('http')? request
  //     : request.clone({ url: `${this.url}/${request.url}`});
  //     return next.handle(apiReq);
  // }


  
  constructor(
    private authService: AuthenticationService,
    private localStorage: SecureLocalStorageService
  ) { }

  jwt_Token: any;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Clone the request and prepend the base URL if it's not already a full URL.

    const apiReq = request.url.startsWith('http')
      ? request
      : request.clone({ url: `${environment.apiUrl}/${request.url}` });

    if (request.url.startsWith('login')) {
      return next.handle(apiReq);
    }
    // Retrieve JWT token from secure local storage.
    const tokenString = this.localStorage.decryptAndGet(StorageKey.JWT_TOKEN);

    if (tokenString) {
      try {
        this.jwt_Token = JSON.parse(tokenString);
      } catch (error) {
        console.error('Error parsing JWT token:', error);
      }
    }

    // If JWT token exists, clone the request and add the Authorization header.
    if (this.jwt_Token) {
      const headers = new HttpHeaders({
        'Authorization': `${this.jwt_Token}`
      });
      const jwtReq = apiReq.clone({
        headers: headers
      });

      console.log('JWT token found, request modified with Authorization header.');

      return next.handle(jwtReq);
    }

    console.log('No JWT token found, sending request without Authorization header.');
    return next.handle(apiReq);
  }
}
