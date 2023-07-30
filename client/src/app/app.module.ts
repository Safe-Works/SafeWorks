import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '././services/user.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { NgxMaskModule } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from './components/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from "./footer/footer.component";
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { AllPostsComponent } from './components/posts/all-posts/all-posts.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './utils/paginator-ptbr-i8n';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MyPostsComponent } from './components/posts/my-posts/my-posts.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { ViewPostComponent } from './components/posts/view-post/view-post.component';
import { MatMenuModule } from '@angular/material/menu';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { EditPortfolioComponent } from './components/portfolio/edit-portfolio/edit-portfolio.component';
import { CardPostsComponent } from './sharedcomponents/card-posts/card-posts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileEditComponent,
    HeaderComponent,
    FooterComponent,
    CreatePostComponent,
    SearchModalComponent,
    AllPostsComponent,
    MyPostsComponent,
    EditPostComponent,
    ViewPostComponent,
    SearchModalComponent,
    PortfolioComponent,
    EditPortfolioComponent,
    CardPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    BsDropdownModule,
    MatMenuModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    UserService,
     { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
