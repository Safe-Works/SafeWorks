import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '././services/user.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { NgxMaskModule} from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile/profile-edit/profile-edit.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FooterComponent} from "./footer/footer.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileEditComponent,
    NavbarComponent,
    FooterComponent
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
    MatSnackBarModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
