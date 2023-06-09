import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPortfolioComponent } from './edit-portfolio.component';
import {ActivatedRoute} from "@angular/router";
import {OnInit} from "@angular/core";

export class PortfolioEditComponent implements OnInit {
  uid: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    // Restante da lógica para editar o portfólio com o UID obtido
  }
}

describe('EditPortfolioComponent', () => {
  let component: EditPortfolioComponent;
  let fixture: ComponentFixture<EditPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPortfolioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
