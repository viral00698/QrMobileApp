import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/model/login';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {


  loginForm!: FormGroup;
  login!:Login
  constructor(private fb: FormBuilder , private auth:AuthenticationService) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required, Validators.minLength(3)]],
    });
  }
ngOnInit(): void {
}

onSubmit() {
  if (this.loginForm.valid) {
    this.login = new Login( );
    this.login.username = this.loginForm.get('username')?.value
    this.login.password = this.loginForm.get('password')?.value
    this.auth.login(this.login);
  } else {
    console.log('Form not valid');
  }
}

}
