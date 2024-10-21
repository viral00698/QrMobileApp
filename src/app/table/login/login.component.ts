import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  login!:any
  constructor(private fb: FormBuilder ) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // this.login = new Login( );
      // this.login.username = this.loginForm.get('username')?.value
      // this.login.password = this.loginForm.get('password')?.value
      // this.auth.login(this.login);
    } else {
      console.log('Form not valid');
    }
  }
}
