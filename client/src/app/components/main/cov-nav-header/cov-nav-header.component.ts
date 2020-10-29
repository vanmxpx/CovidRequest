import { Component, OnInit } from '@angular/core';
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
  constructor(
    private profileRepository: ProfileRepository,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.profileImage = await this.profileRepository.getUserPhoto(this.authService.currentUser.personalInfoRef).toPromise();
  }

}
