import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { parse } from "date-fns";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Workers
  public allUsersData: any;
  public totalActiveWorkers: number = 0;
  public workersPercentIncrease: number = 0;
  public workersPercentIcon: boolean = true;

  // Jobs Profits
  public jobsProfitPercentIncrease: string = '0';
  public jobsProfitPercentIcon: boolean = true;
  public currentMonthProfit: string = '0';
  public lastMonthProfit: string = '0';

  // JobAds
  public allJobAdsData: any;
  public totalActiveJobAds: number = 0;
  public jobAdsPercentIncrease: string = '0';
  public jobAdsPercentIcon: boolean = true;

  // JobContracts
  public allJobsData: any;
  public paginatedJobsData: any;
  public totalActiveJobs: number = 0;
  public jobsPercentIncrease: number = 0;
  public jobsPercentIcon: boolean = true;

  constructor(private analyticsService: AnalyticsService) { }

  async ngOnInit() {
    await this.setAllJobAdsData();
    await this.setAllJobsData();
    await this.setAllUsersData();
  }

  private async setAllUsersData() {
    this.allUsersData = await this.analyticsService.GetAllUsers();
    this.setTotalActiveWorkers();
  }

  private async setAllJobAdsData() {
    this.allJobAdsData = await this.analyticsService.GetAllJobAds();
    this.setTotalActiveJobAds();
  }

  private async setAllJobsData() {
    this.allJobsData = await this.analyticsService.GetAllJobs();
    this.paginatedJobsData = await this.analyticsService.GetAllJobsPaginated(10, 1);
    this.setTotalActiveJobs();
    this.setTotalJobsProfit();
  }

  private setTotalActiveWorkers(): void {
    const currentMonth = new Date().getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;
    
    const totalActiveWorkers = this.allUsersData.users.filter((user: any) => {
      return user.worker !== null;
    });
    this.totalActiveWorkers = totalActiveWorkers.length;

    const currentMonthWorkers = this.allJobsData.jobs.filter((user: any) => {
      const userCreationDate = parse(user.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return userCreationDate.getMonth() === currentMonth && user.worker;
    });

    const lastMonthWorkers = this.allJobsData.jobs.filter((user: any) => {
      const userCreationDate = parse(user.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return userCreationDate.getMonth() === lastMonth && user.worker;;
    });

    const currentMonthJobCount = currentMonthWorkers.length;
    const lastMonthJobCount = lastMonthWorkers.length;

    const workersPercentIncrease = ((currentMonthJobCount - lastMonthJobCount) / lastMonthJobCount) * 100;
    if (workersPercentIncrease === Infinity) {
      this.workersPercentIncrease = 0;
    } else {
      if (workersPercentIncrease > 0) {
        this.workersPercentIncrease = workersPercentIncrease;
        this.workersPercentIcon = true;
      } else {
        this.workersPercentIncrease = workersPercentIncrease;
        this.workersPercentIcon = false;
      }
    }
  }

  private setTotalJobsProfit(): void {
    const currentMonth = new Date().getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;

    let currentMonthProfit: number = 0;
    let lastMonthProfit: number = 0;

    // Filter the jobs to calcule and set the current month total profit
    this.allJobsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      if (jobDate.getMonth() === currentMonth && !job.canceled) {
        currentMonthProfit += job.price;
      }
      return jobDate.getMonth() === currentMonth && !job.canceled;
    });
    this.currentMonthProfit = currentMonthProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Filter the jobs to calcule and set the last month total profit
    this.allJobsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      if (jobDate.getMonth() === currentMonth && !job.canceled) {
        lastMonthProfit += job.price;
      }
      return jobDate.getMonth() === lastMonth && !job.canceled;;
    });
    this.lastMonthProfit = lastMonthProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Compare the current and last month profits to set the percent of increase or decrease
    const jobsProfitPercentIncrease = ((currentMonthProfit - lastMonthProfit) / lastMonthProfit) * 100;
    if (jobsProfitPercentIncrease === Infinity) {
      this.jobsProfitPercentIncrease = '0';
    } else {
      if (jobsProfitPercentIncrease > 0) {
        this.jobsProfitPercentIncrease = jobsProfitPercentIncrease.toFixed(2);
        this.jobsProfitPercentIcon = true;
      } else {
        this.jobsProfitPercentIncrease = jobsProfitPercentIncrease.toFixed(2);
        this.jobsProfitPercentIcon = false;
      }
    }
  }

  private setTotalActiveJobAds(): void {
    this.totalActiveJobAds = this.allJobAdsData.jobs.length;
    
    const currentMonth = new Date().getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;

    const currentMonthJobs = this.allJobAdsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return jobDate.getMonth() === currentMonth && !job.expired;
    });

    const lastMonthJobs = this.allJobAdsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return jobDate.getMonth() === lastMonth && !job.expired;;
    });

    const currentMonthJobCount = currentMonthJobs.length;
    const lastMonthJobCount = lastMonthJobs.length;

    const jobAdsPercentIncrease = ((currentMonthJobCount - lastMonthJobCount) / lastMonthJobCount) * 100;
    if (jobAdsPercentIncrease === Infinity) {
      this.jobAdsPercentIncrease = '0';
    } else {
      if (jobAdsPercentIncrease > 0) {
        this.jobAdsPercentIncrease = jobAdsPercentIncrease.toFixed(2);
        this.jobAdsPercentIcon = true;
      } else {
        this.jobAdsPercentIncrease = jobAdsPercentIncrease.toFixed(2);
        this.jobAdsPercentIcon = false;
      }
    }
  }

  private setTotalActiveJobs(): void {
    this.totalActiveJobs = this.allJobsData.jobs.length;
    
    const currentMonth = new Date().getMonth();
    const lastMonth = (currentMonth - 1 + 12) % 12;

    const currentMonthJobs = this.allJobsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return jobDate.getMonth() === currentMonth && !job.canceled;
    });

    const lastMonthJobs = this.allJobsData.jobs.filter((job: any) => {
      const jobDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date());
      return jobDate.getMonth() === lastMonth && !job.canceled;;
    });

    const currentMonthJobCount = currentMonthJobs.length;
    const lastMonthJobCount = lastMonthJobs.length;

    const jobsPercentIncrease = ((currentMonthJobCount - lastMonthJobCount) / lastMonthJobCount) * 100;
    if (jobsPercentIncrease === Infinity) {
      this.jobsPercentIncrease = 0;
    } else {
      if (jobsPercentIncrease > 0) {
        this.jobsPercentIncrease = jobsPercentIncrease;
        this.jobsPercentIcon = true;
      } else {
        this.jobsPercentIncrease = jobsPercentIncrease;
        this.jobsPercentIcon = false;
      }
    }
  }
}