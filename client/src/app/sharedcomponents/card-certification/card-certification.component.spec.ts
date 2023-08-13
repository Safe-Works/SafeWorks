import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCertificationComponent } from './card-certification.component';

describe('CardCertificationComponent', () => {
  let component: CardCertificationComponent;
  let fixture: ComponentFixture<CardCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardCertificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
