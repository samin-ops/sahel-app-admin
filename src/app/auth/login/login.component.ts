import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private user!: User;
  public loginForm!: FormGroup;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private usersService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.usersService.getUser().subscribe((user) => {
      this.user = user;
      if (!user) {
        this.router.navigateByUrl('/home');
      }
    });
    this.loginForm = this.fb.group({
      username: ['', [Validators.required /* Validators.email*/]],
      password: ['', [Validators.required /*Validators.minLength(8) */]],
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      this.usersService.login(data).subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.notificationService.dispatchErrorMessage('Invalid form');
    }
  }
}
