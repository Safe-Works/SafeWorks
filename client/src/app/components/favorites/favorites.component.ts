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

    deleteFavorite(workerUid: string) {
        this.userService.deleteFavorite(this.userUid, workerUid);
        window.location.reload()

    }
}
