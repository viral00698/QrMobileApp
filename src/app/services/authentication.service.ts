import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../model/login';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SecureLocalStorageService } from './secure-local-storage.service';
import { RequestStatus } from '../constent/request-status';
import { StorageKey } from '../constent/storage-key';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private isSocketSecure:boolean = false
  private jwtToken: string | undefined
  private isLogedIn: boolean = true;

  private loginResponse: any;
  xsrfToken: any;
  constructor(private http: HttpClient, private router: Router , private localStrorage:SecureLocalStorageService) { }
  login(data: Login) {
    const header = new HttpHeaders({
      Authorization: 'Basic ' + btoa(data.username + ':' + data.password)
    });
    this.loginResponse = this.http.get('login', { headers: header, observe: 'response', withCredentials: true }).pipe(
      map(response => {
        const authToken = response.headers.get('Authorization');
        if (authToken) {
          this.localStrorage.encriptAndSave(authToken,StorageKey.JWT_TOKEN)
          this.jwtToken = authToken;

          this.isLogedIn = true;
          this.router.navigate(['vendorTable'])
        }

        if(response?.body && response.status === 200){
          const tmp = response?.body as { data: any };
          if(tmp){
            this.localStrorage.encriptAndSave(tmp?.data?.vendorDetails , StorageKey.USER);
          } else{
            this.logout()
          }
        }
    
      }),
      
      catchError(this.handleError)
    ).subscribe((res: any) => { 
     
     });
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error('An error occurred'));
  }

  getLogedIn() {
    return this.isLogedIn
  }
  getJwtToken() {
    return this.jwtToken;
  }

  getSocketSecure(){
    return this.isSocketSecure;
  }

  logout(){
    this.http.get('logout').subscribe((res:any)=>{
        if(res.status == 'success'){
          this.jwtToken = undefined;
          localStorage.removeItem(StorageKey.VENDER)
          localStorage.removeItem(StorageKey.USER)
          this.router.navigate(['/login'])
        }
    })
  }

}
