import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedbackService } from '../services/feedback.service';
import { SecureLocalStorageService } from '../services/secure-local-storage.service';
import { StorageKey } from '../constent/storage-key';
import { RequestStatus } from '../constent/request-status';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit{
  value: number = 2;
  formGroup!:FormGroup
  vendor: any;
  Questions: any;
  orderId: any;

  constructor(private fb:FormBuilder , private router:Router , private feedbackService:FeedbackService ,  private secureStoregeSerive: SecureLocalStorageService,){
     this.formGroup = this.fb.group({
      q1: [null, [Validators.required]],
      q2: [null, [Validators.required]],
      q3: [null, [Validators.required]],
      q4: [null, [Validators.required]],
      q5: [null, [Validators.required]],
    })

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { orderId: any, };

  if (state) {
    this.orderId = state.orderId
    console.log('orderId:', state.orderId);
  }
  }
  ngOnInit(): void {
   this.getVendorDetails()
   this.getFeedbackQuestion()
  }

  onSubmit(){
    if(this.formGroup.valid){

      if(!this.orderId){
        this.cancel()
        return;
      }

      let feedbackAnswerDto:any = []

      const q1 = {
        'questionId':this.Questions?.[0]?.id,
        'rating':this.formGroup.get('q1')?.value
      }
      const q2 = {
        'questionId':this.Questions?.[1]?.id,
        'rating':this.formGroup.get('q2')?.value
      }
      const q3 = {
        'questionId':this.Questions?.[2]?.id,
        'rating':this.formGroup.get('q3')?.value
      }
      const q4 = {
        'questionId':this.Questions?.[3]?.id,
        'rating':this.formGroup.get('q4')?.value
      }
      const q5 = {
        'questionId':this.Questions?.[4]?.id,
        'rating':this.formGroup.get('q5')?.value
      }

      feedbackAnswerDto.push(q1)
      feedbackAnswerDto.push(q2)
      feedbackAnswerDto.push(q3)
      feedbackAnswerDto.push(q4)
      feedbackAnswerDto.push(q5)

      const json = {
          'vendorId':this.vendor?.vendorId ,
          'orderId':this.orderId,
          'answers':feedbackAnswerDto
      }

      this.feedbackService.saveFeedBack(json).subscribe((res:any)=>{
        
      })
    }
  }

  cancel(){
    this.router.navigate(['md', 'vendorTable']);
  }

  getFeedbackQuestion(){
    if(this.vendor?.vendorId){
        this.feedbackService.getQuestion(this.vendor?.vendorId).subscribe((res:any)=>{
          if(RequestStatus.success === res?.status){
            this.Questions = res?.data            
            if(this.Questions.length < 5){
              this.router.navigate(['md', 'vendorTable']);
            }
          }
        })
    }
  }

  getVendorDetails() {
      if (!this.vendor) {
        const res = this.secureStoregeSerive.decryptAndGet(StorageKey.USER);
        let tmp = JSON.parse(res);
        this.vendor = tmp;
      }
    }
}
