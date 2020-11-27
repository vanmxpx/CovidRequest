import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { LoginUser } from '../models/BL/login-user';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES } from '@cov/routes';
import { LocalStorgeKey as LocalStorageKey } from '../constants/local-storage-keys';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    cachedRequests: Array<HttpRequest<any>> = [];
    private url: string;
    private authorizedUser: LoginUser | null = null;
    jwtHelper: JwtHelperService;
    get authorized(): boolean {
        return this.authorizedUser !== null && this.authorizedUser.token && !this.tokenExpired;
    }
    get tokenExpired(): boolean {
        return this.jwtHelper.isTokenExpired(this.currentUser.token);
    }
    get currentUser(): LoginUser {
        return this.authorizedUser;
    }
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        @Inject('env') private env: any
    ) {
        this.jwtHelper = new JwtHelperService();
        this.url = env.host + '/api/auth';
        const jsonUser = localStorage.getItem(LocalStorageKey.CurrentUser);
        if (jsonUser) {
            this.authorizedUser = JSON.parse(jsonUser);
        }
    }

    public async ping(): Promise<boolean> {
        return true; // TODO: UNMOCK
        try {
            await this.http.get(this.url + '/ping').toPromise();
        } catch (error) {
            if (error.status && error.status === 401) {
                return false;
            }
        }
        return true;
    }

    public async loginByGoogle(token: string): Promise<LoginUser> {
        this.authorizedUser = {
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MDY1MTUyNjEsImV4cCI6MTYzODA1MTI2NSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.ykqBQoytzVWg_WOnicg7xxyPcuV5kSXvpxWbULT_OVc',
        };
        //= await this.http.post<LoginUser>(this.url + '/google', { token }).toPromise();

        if (!this.authorized) {
            throw new Error('User is not authorized');
        }

        localStorage.setItem(LocalStorageKey.CurrentUser, JSON.stringify(this.authorizedUser));

        return this.authorizedUser;
    }
    public async auth(login: string, password: string): Promise<LoginUser> {
        this.authorizedUser = await this.http.post<LoginUser>(this.url, { username: login, password }).toPromise();

        if (!this.authorized) {
            throw new Error('User is not authorized');
        }

        localStorage.setItem(LocalStorageKey.CurrentUser, JSON.stringify(this.authorizedUser));
        return this.authorizedUser;
    }

    public logout(returnUrl: string = null) {
        this.clearStoredData();
        this.authorizedUser = null;
        this.router.navigate([ROUTES.LOGIN], { queryParams: { returnUrl: returnUrl || this.route.pathFromRoot } });
    }
    clearStoredData() {
        localStorage.removeItem(LocalStorageKey.CurrentUser);
    }

    // public isAdmin() {
    //   return ROLES.ADMIN.includes(this.currentUser.role);
    // }

    public collectFailedRequest(request): void {
        this.cachedRequests.push(request);
      }
    public retryFailedRequests(): void {
        // retry the requests. this method can
        // be called after the token is refreshed
      }

}

