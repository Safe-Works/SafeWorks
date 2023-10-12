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
import { FooterComponent } from "./components/footer/footer.component";
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
import { CardPostsComponent } from './sharedcomponents/list-posts/list-posts.component';
import { CardPostComponent } from './sharedcomponents/card-post/card-post.component';
import { CardCertificationComponent } from './sharedcomponents/card-certification/card-certification.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { DashboardComponent } from './components/analytics/dashboard/dashboard.component';
import { DoughnutChartComponent } from './components/analytics/doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './components/analytics/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/analytics/line-chart/line-chart.component';
import { JobsStatusComponent } from './components/analytics/jobs-status/jobs-status.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ContractsComponent } from './components/contracts/contracts.component';

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
    CardPostsComponent,
    CardPostComponent,
    CardCertificationComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    DoughnutChartComponent,
    BarChartComponent,
    LineChartComponent,
    JobsStatusComponent,
    FavoritesComponent,
    ContractsComponent,
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
    CollapseModule.forRoot(),
    NgChartsModule
  ],
  providers: [
    UserService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
    { provide: NgChartsConfiguration, useValue: { generateColors: true }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
