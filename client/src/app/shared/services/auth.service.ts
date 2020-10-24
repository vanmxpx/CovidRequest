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
        return this.authorizedUser !== null && this.authorizedUser.token !== undefined && this.tokenExpired;
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
        @Inject('host') private host: string
    ) {
        this.jwtHelper = new JwtHelperService();
        this.url = host + '/api/auth/';
        const jsonUser = localStorage.getItem(LocalStorageKey.CurrentUser);
        if (jsonUser) {
            this.authorizedUser = JSON.parse(jsonUser);
        }
    }

    public async ping(): Promise<boolean> {
        return true; // TODO: UNMOCK
        try {
            await this.http.get(this.url + 'ping').toPromise();
        } catch (error) {
            if (error.status && error.status === 401) {
                return false;
            }
        }
        return true;
    }

    public async auth(login: string, password: string): Promise<LoginUser> {
        this.authorizedUser = await this.http.post<LoginUser>(this.url, { username: login, password }).toPromise();
        this.authorizedUser.login = login;

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

