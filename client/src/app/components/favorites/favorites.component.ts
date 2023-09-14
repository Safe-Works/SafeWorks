import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserAuth} from "../../auth/User.Auth";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";


@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
    isLoading: boolean = false;
    favoriteUsers: any[] = [];
    userUid: string = this.userAuth.currentUser?.uid ?? '';

    constructor(
        private userService: UserService,
        private userAuth: UserAuth,
        public router: Router,
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
        //this.ngOnInit();
        // window.location.reload()
        this.getFavorites()
        this.isLoading = false;

    }
}
