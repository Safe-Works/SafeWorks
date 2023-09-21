import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserAuth} from "../../auth/User.Auth";
import {Router} from "@angular/router";
import {JobService} from "../../services/job.service";
import JobAdvertisement from "../../models/job-advertisement.model";
import Swal from 'sweetalert2/dist/sweetalert2.js';

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

    constructor(
        private userService: UserService,
        private userAuth: UserAuth,
        public router: Router,
        private jobService: JobService,
    ) {}

    ngOnInit(): void {
        this.getFavorites();
    }

    async getFavorites() {
        this.favoriteUsers = [];

        try {
            const response = await this.userService.GetUserInfo(this.userUid);
            const favoritesList = response.user.favorite_list;

            // Para cada ID na lista de favoritos, busca e adiciona no array
            for (const workerUid of favoritesList) {
                const userResponse = await this.userService.GetUserInfo(workerUid);
                const worker = userResponse.user;
                worker.showDetails = false;
                worker.delete = false;
                worker.workerUid = workerUid;
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
}
