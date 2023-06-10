import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth/Auth.Guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { ViewPostComponent } from './components/posts/view-post/view-post.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit/:id', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'jobs/create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'jobs', component: ViewPostComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
