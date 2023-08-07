import { Component } from '@angular/core';
import JobAdvertisement from 'src/app/models/job-advertisement.model';
import { UserAuth } from '../../../auth/User.Auth';
import { JobService } from 'src/app/services/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent {
  jobId = "";
  isLoading = false;
  isError = false;
  defaultPicUrl = "../../assets/default-pic.png"
  jobInfo = {} as JobAdvertisement;
  slides: any[] = new Array(3).fill({ id: -1, src: '', title: '', subtitle: '' });
  constructor(private userAuth: UserAuth, private router: Router, private jobService: JobService, private _snackBar: MatSnackBar, private route: ActivatedRoute) {

  }
  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    this.loadJobInfo();
  }
  loadJobInfo() {
    this.isLoading = true;
    if (this.jobId) {
      this.jobService.GetById(this.jobId).subscribe(
        (response) => {
          this.jobInfo = response.job;
          if (!this.jobInfo.media || this.jobInfo.media?.length < 1) {
            this.jobInfo.media = [];
            this.jobInfo.media.push(this.defaultPicUrl);
          }
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isError = true;
          this.isLoading = false;
        }
      );
    }

  }
  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }
}
