import { Component, OnInit } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModalService } from '../search-modal/search-modal.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    activeRoute: string = 'home';
    isDropdownOpen: boolean = false;
    constructor(public userAuth: UserAuth, private router: Router, private modalService: ModalService) { }

    ngOnInit(): void {
        this.userAuth.authUserFromToken();
        // Verifica se a rota foi alterada e atribui qual está ativa
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const tree = this.router.parseUrl(event.url);
                const urlSegments = tree.root.children['primary']?.segments;
                let route = '';
                if (!urlSegments) {
                    return this.changeRoute('home');
                }
                for (const segment of urlSegments) {
                    route += segment.path + '/';
                }
                if (route.length > 0) {
                    route = route.slice(0, -1);
                    this.changeRoute(route);
                }

            });
    }
    openDropdown() {
        this.isDropdownOpen = true;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    changeRoute(routeName: string): void {
        this.activeRoute = routeName;
    }

    redirectToHomePage() {
        this.router.navigateByUrl('/');
    }

    dropdownStyle = {
        'right.px': -10
    };

    async logout() {
        this.userAuth.clearUser();
        await this.router.navigateByUrl('/login');
    }

    openModal() {
        this.modalService.openModal();
    }

}