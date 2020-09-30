import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { VersionModel } from '../../models/BL/version';

@Injectable({
    providedIn: 'root'
})
export class VersionRepository {

    constructor(
        private http: HttpClient,
        @Inject('host') private host: string
    ) {
    }

    public getVersion(): Observable<VersionModel>{
        return this.http.get<VersionModel>(`${this.host}/api/version/`);
    }

}
