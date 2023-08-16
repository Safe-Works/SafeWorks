import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth/Auth.Guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { AllPostsComponent } from './components/posts/all-posts/all-posts.component';
import { MyPostsComponent} from './components/posts/my-posts/my-posts.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { ViewPostComponent } from './components/posts/view-post/view-post.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'profile/edit/:id', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'jobs/create', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'jobs', component: AllPostsComponent, canActivate: [AuthGuard] },
  { path: 'jobs/myjobs', component: MyPostsComponent, canActivate: [AuthGuard] },
  { path: 'jobs/edit/:id', component: EditPostComponent, canActivate: [AuthGuard] },
  { path: 'jobs/view/:id', component: ViewPostComponent, canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true, useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
