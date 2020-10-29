import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '@cov/shared/models/BL/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileRepository {
    private url: string;
    constructor(
        private http: HttpClient,
        @Inject('env') private env: any
    ) {
        this.url = this.env.host + '/api/profile';
    }

    public getUserPhoto(profileId: number): Observable<string>{
        return this.http.get(`${this.url}/${profileId}/photo`, {responseType: 'text'});
    }

    public getUserProfile(profileId: number): Observable<Profile>{
        return this.http.get<Profile>(`${this.url}/${profileId}`);
    }

}
