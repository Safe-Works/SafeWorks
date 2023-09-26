import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { parse } from 'date-fns';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() rawData: any;
  public barChartDataset: any = null;
  public barChartOptions: ChartOptions = {};
  public dataLoaded: boolean = false;

  async ngOnInit() {
    this.setChartData(this.rawData);
  }

  private getCurrentMonth(): number {
    return new Date().getMonth();
  }

  private getLastMonth(currentMonth: number): number {
    return (currentMonth - 1 + 12) % 12
  }

  private getJobCreatedDate(created: string): Date {
    return parse(created, 'dd/MM/yyyy HH:mm:ss', new Date());
  }

  async setChartData(rawData: any) {
    // Reduce all jobAds data created this month to count by district
    const currentMonthDistrictCounts = rawData.jobs.reduce((acc: any, job: any) => {
      const currentMonth = this.getCurrentMonth();
      const jobCreatedDate = this.getJobCreatedDate(job.created);
      if (jobCreatedDate.getMonth() === currentMonth && job.deleted === null) {
        const district = job.district.name;
        acc[district] = (acc[district] || 0) + 1;
      }
      return acc;
    }, {});
    // Map the reduced current month jobAds data to count the number of district and set the labels
    const currentMonthMap = Object.keys(currentMonthDistrictCounts).map(district => ({
      district,
      count: currentMonthDistrictCounts[district]
    }));

    // Reduce all jobAds data created last month to count by district
    const lastMonthDistrictCounts = rawData.jobs.reduce((acc: any, job: any) => {
      const currentMonth = this.getCurrentMonth();
      const lastMonth = this.getLastMonth(currentMonth);
      const jobCreatedDate = this.getJobCreatedDate(job.created);
      if (jobCreatedDate.getMonth() === lastMonth && job.deleted === null) {
        const district = job.district.name;
        acc[district] = (acc[district] || 0) + 1;
      }
      return acc;
    }, {});
    // Map the reduced last month jobAds data to count the number of district and set the labels
    const lastMonthMap = Object.keys(lastMonthDistrictCounts).map(district => ({
      district,
      count: lastMonthDistrictCounts[district]
    }));

    const currentMonthdataCount = currentMonthMap.map(data => data.count);
    const lastMonthDataCount = lastMonthMap.map(data => data.count);
    const dataLabels = currentMonthMap.map(data => data.district);

    const barChartDataset = {
      data: {
        datasets: [
          {
            label: 'Mês atual',
            data: currentMonthdataCount,
            backgroundColor: '#2C3E50',
            hoverBackgroundColor: '#56799C',
            borderColor: '#56799C'
          },
          {
            label: 'Mês passado',
            data: lastMonthDataCount,
            backgroundColor: '#FFA500',
            hoverBackgroundColor: '#FFBA00',
            borderColor: '#FFBA00'
          },
        ],
        labels: dataLabels
      },
      options: {
        barValueSpacing: 1,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }]
        }
      }
    }
    this.barChartDataset = barChartDataset.data;
    this.barChartOptions = {
      scales: {
        yAxes: {
          ticks: {
            stepSize: 1
          }
        }
      },
      responsive: true,
      maintainAspectRatio: true,
    };
    this.dataLoaded = true;
  }
}
