import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { Profile } from '@cov/shared/models/BL/profile';
import { AuthService } from '@cov/shared/services';
import { ProfileRepository } from '@cov/shared/services/repositories/profile.repository';

@Component({
  selector: 'cov-nav-header',
  templateUrl: './cov-nav-header.component.html',
  styleUrls: ['./cov-nav-header.component.scss']
})
export class CovNavHeaderComponent implements OnInit {
  profileImage: string = null;
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private profileRepository: ProfileRepository,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.profileImage = await this.profileRepository.getUserPhoto(this.authService.currentUser.personalInfoRef).toPromise();
   
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login () {
    this.loading = true;
        this.authService.loginByGoogle;
  }
}