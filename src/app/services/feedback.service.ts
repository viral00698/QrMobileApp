import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http:HttpClient) { }

  getQuestion(data:any){
    return this.http.get('question/getActiveQuestion/'+data)
  }

  saveFeedBack(data:any){
    return this.http.post('question/saveFeedBack',data)
  }
}
