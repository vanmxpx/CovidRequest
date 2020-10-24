import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CovGeneratorComponent } from './components/main/cov-generator/cov-generator.component';
import { MainComponent } from './components/main/main.component';
import { ROUTES } from './routes';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [{
        path: ROUTES.ROOT,
        component: MainComponent,
        // canActivate: [AuthGuard],
        // children: [
        //     {
        //         path: ROUTES.GENERATOR,
        //         component: CovGeneratorComponent,
        //         //loadChildren: () => import('./components/main/cov-generator/cov-generator.module').then(m => m.CovGeneratorModule),
        //     },
        //     { path: '', redirectTo: ROUTES.GENERATOR, pathMatch: 'full' },
        // ]
    },
    { path: ROUTES.LOGIN, component: LoginComponent },
    { path: '**', redirectTo: ROUTES.ROOT, pathMatch: 'full' },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
