import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserAuth } from '../../auth/User.Auth';
import { Router, NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ModalService } from '../search-modal/search-modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

    activeRoute: string = 'home';

    constructor(public userAuth: UserAuth, private router: Router, private modalService: ModalService) {}

    ngOnInit(): void {
        this.userAuth.authUserFromToken();
        // Verifica se a rota foi alterada e atribui qual está ativa
        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const tree = this.router.parseUrl(event.url);
                const urlSegments = tree.root.children['primary'].segments;
                if (urlSegments[0].path.length > 0) {
                    this.changeRoute(urlSegments[0].path);
                } else {
                    this.changeRoute('home');
                }
            });
    }

    changeRoute(routeName: string): void {
        this.activeRoute = routeName;
    }

    async logout() {
        this.userAuth.clearUser();
        await this.router.navigateByUrl('/login');
    }

    openModal() {
        this.modalService.openModal();
    }

}