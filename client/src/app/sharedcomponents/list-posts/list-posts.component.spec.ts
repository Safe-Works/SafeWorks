import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPostsComponent } from './list-posts.component';
import JobAdvertisement from 'src/app/models/job-advertisement.model';

describe('CardPostsComponent', () => {
  let component: CardPostsComponent<JobAdvertisement>;
  let fixture: ComponentFixture<CardPostsComponent<JobAdvertisement>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
