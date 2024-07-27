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
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { BaseAppDtoResponse } from 'src/app/shared/dtos/responses/shared/base.dto';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  Roles: any = ['Admin', 'Author', 'Reader'];
  signupForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notificationS: NotificationService
  ) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      username: this.fb.control('', Validators.required),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
      password_confirmation: this.fb.control('', Validators.required),
      phone: this.fb.control('', Validators.required),
      roles: this.fb.control('', Validators.required),
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.notificationS.dispatchSuccessMessage('submitting register Form');
      const {
        firstName,
        lastName,
        email,
        password,
        password_confirmation,
        username,
        phone,
        roles,
      } = this.signupForm.value;

      // TODO call the auth service

      this.auth
        .signUp({
          firstName,
          lastName,
          email,
          password,
          password_confirmation,
          username,
          phone,
          roles,
        })
        .subscribe({
          next: (res) => {
            if (res && res.success) {
              this.notificationS.dispatchSuccessMessage('register successful');
              console.log(res);
              if (res.full_messages) {
                // alert(res.full_messages[0]);
                this.notificationS.dispatchSuccessMessage(res.full_messages[0]);
              }
              this.router.navigate(['/auth/login']);
            } else {
              this.notificationS.dispatchErrorMessage(
                'Failed registration process'
              );
            }
          },
          error: (err) => {
            if (err.error) {
              const error = err.error as BaseAppDtoResponse;
              error.full_messages = err.error.full_messages;
              this.notificationS.dispatchErrorMessage(
                err.error.full_messages[0]
              );
            }
            return [err];
          },
        });
    }
  }
}
