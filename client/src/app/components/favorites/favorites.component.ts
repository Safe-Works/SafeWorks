import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserAuth} from "../../auth/User.Auth";
import {Router} from "@angular/router";
import {JobService} from "../../services/job.service";
import JobAdvertisement from "../../models/job-advertisement.model";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
    isLoading: boolean = false;
    favoriteUsers: any[] = [];
    userUid: string = this.userAuth.currentUser?.uid ?? '';
    jobs: JobAdvertisement[] = [];
    totalJobs: number = 0;
    currentPage: number = 1;
    pageSize: number = 10;
    photoUrl: string = '';

    constructor(
        private userService: UserService,
        private userAuth: UserAuth,
        public router: Router,
        private jobService: JobService,
        private _snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.getFavorites();
    }

    async getFavorites() {
        this.favoriteUsers = [];

        try {
            const response = await this.userService.GetUserInfo(this.userUid);
            const favoritesList = response.user.favorite_list;

            for (const workerUid of favoritesList) {
                const userResponse = await this.userService.GetUserInfo(workerUid);
                const worker = userResponse.user;
                worker.showDetails = false;
                worker.delete = false;
                worker.workerUid = workerUid;

                if (worker.photo_url) {
                    worker.photoUrl = worker.photo_url;
                } else {
                    worker.photoUrl = 'https://www.pngitem.com/pimgs/m/551-5510463_default-user-image-png-transparent-png.png';
                }

                this.favoriteUsers.push(worker);
            }
        } catch (error) {
            console.error(error);
        }
    }

    redirectToUserDetails(workerUid: string) {
        this.router.navigate(['/profile', workerUid]);
    }

    async deleteFavorite(workerUid: string) {
        this.isLoading = true;
        await this.userService.deleteFavorite(this.userUid, workerUid);
        this.getFavorites()
        this.isLoading = false;
        this.openSnackBar("Usuário removido dos favoritos", "OK", "snackbar-success")
    }

    async getJobs(workerUid: string) {
        this.isLoading = true;
        try {
            const data = await this.jobService.GetJobsByWorkerId(this.currentPage, this.pageSize, workerUid).toPromise();
            this.jobs = data.jobs;
            this.totalJobs = data.total;
            this.isLoading = false;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            Swal.fire(
                'Erro!',
                'Ocorreu um erro ao buscar seus anúncios.',
                'error'
            )
            this.isLoading = false;
        }
    }

    openSnackBar(message: string, action: string, className: string) {
        this._snackBar.open(message, action, {
            duration: 20000,
            panelClass: [className],
        });
    }
}
