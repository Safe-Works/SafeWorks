import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserAuth} from "../../auth/User.Auth";
import {Router} from "@angular/router";

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
    favoriteUsers: any[] = [];

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
            const response = await this.userService.GetUserInfo(this.userAuth.currentUser?.uid ?? '');
            const favoritesList = response.user.favorite_list;

            // Para cada ID na lista de favoritos, busca e adiciona no array
            for (const userId of favoritesList) {
                const userResponse = await this.userService.GetUserInfo(userId);
                const user = userResponse.user;
                user.showDetails = false;
                user.id = userId;
                this.favoriteUsers.push(user);
            }
        } catch (error) {
            console.error(error);
        }
    }

    redirectToUserDetails(userId: string) {
        this.router.navigate(['/profile', userId]);
    }
}
