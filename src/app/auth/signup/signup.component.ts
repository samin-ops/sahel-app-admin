import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { BaseAppDtoResponse } from 'src/app/shared/dtos/responses/shared/base.dto';
import { catchError, map } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notificationS: NotificationService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: this.fb.control('',Validators.required),
      lastName: this.fb.control('',Validators.required),
      username: this.fb.control('',Validators.required),
      email: this.fb.control('',Validators.required),
      phone: this.fb.control('',Validators.required),
      password:this.fb.control('',Validators.required),
      password_confirmation:this.fb.control('',Validators.required),
     // roles: this.fb.control('', Validators.required)
    });
  }

  onSubmit() {
     if (this.registerForm.valid) {
      this.notificationS.dispatchSuccessMessage('submitting register Form');
       const userData = this.registerForm.value;
       this.auth.register(userData)
       .pipe(map(res => {
         if (res && res.success) {
           this.notificationS.dispatchSuccessMessage('register successful');
           console.log(res);
           if (res.full_messages) {
             // alert(res.full_messages[0]);
             this.notificationS.dispatchSuccessMessage(res.full_messages[0]);
           }
          this.router.navigate(['/auth/login']);
        } else {
          this.notificationS.dispatchErrorMessage('Failed registration process');
         }
         // this.loadingService.isLoading.next(false);
       }), catchError(err => {
         if (err.error) {
          const error = err.error as BaseAppDtoResponse;
          error.full_messages = err.error.full_messages;
           this.notificationS.dispatchErrorMessage(error.full_messages[0]);
         }
         return [err];
       })).subscribe(res => {
         console.log(res);
       });

     } else {
       alert('Invalid form');
     }
  } 
  }

