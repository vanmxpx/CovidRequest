
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@cov/shared/services';
import { NotificationsService } from '@cov/shared/services/notifications.service';
import { Inject } from '@angular/core';

@Component({
    selector: 'cov-google-auth-button',
    templateUrl: './google-auth-button.component.html',
    styleUrls: ['./google-auth-button.component.scss']
})
export class GoogleAuthButtonComponent implements OnInit {

    public gapiSetup: boolean = false; // marks if the gapi library has been loaded
    public authInstance: gapi.auth2.GoogleAuth;
    public error: string;
    public user: gapi.auth2.GoogleUser;
    @Output() authRequested: EventEmitter<gapi.auth2.GoogleAuth> = new EventEmitter<gapi.auth2.GoogleAuth>();

    constructor(
        private authService: AuthService,
        private notifications: NotificationsService,
        @Inject('env') private env: any
    ) {

    }

    async ngOnInit() {
        if (await this.checkIfUserAuthenticated()) {
            this.user = this.authInstance.currentUser.get();
        }
    }

    async initGoogleAuth(): Promise<void> {
        //  Create a new Promise where the resolve function is the callback
        // passed to gapi.load
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi loaded
        // and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: this.env.googleClientId })
                .then(auth => {
                    this.gapiSetup = true;
                    this.authInstance = auth;
                });
        });
    }

    async authenticate() { // Promise<gapi.auth2.GoogleUser> {
        // Initialize gapi if not done yet
        if (!this.gapiSetup) {
            await this.initGoogleAuth();
        }

        this.authRequested.emit(this.authInstance);
    }

    async checkIfUserAuthenticated(): Promise<boolean> {
        // Initialize gapi if not done yet
        if (!this.gapiSetup) {
            await this.initGoogleAuth();
        }

        return this.authInstance.isSignedIn.get();
    }
}
