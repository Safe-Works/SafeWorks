import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { parse } from 'date-fns';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() rawJobsData: any;
  @Input() rawJobAdsData: any;
  public lineChartDataset: any = null;
  public lineChartOptions: ChartOptions = {};
  public dataLoaded: boolean = false;

  async ngOnInit() {
    this.setChartData();
  }

  async setChartData() {
    const lineDataset = this.setDateCategoryPriceDataset();

    this.lineChartDataset = {
      data: {
        labels: lineDataset.chartLabels,
        datasets: lineDataset.chartData
      }
    };
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: {
          ticks: {
            stepSize: 1,
            callback: (value) => {
              if (Number.isInteger(value)) {
                return value.toString();
              } else {
                return '';
              }
            }
          }
        }
      }
    };

    this.dataLoaded = true;
  }

  setDateCategoryPriceDataset() {
    const relatedJobs = this.relateJobsAndAds(this.rawJobsData, this.rawJobAdsData);
    const dateCategoryCounts: { [date: string]: { [category: string]: number } } = {};

    relatedJobs.forEach(job => {
      const category = job.jobAd.category.name;
      const createdDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date()).toLocaleDateString();

      if (!dateCategoryCounts[createdDate]) {
        dateCategoryCounts[createdDate] = {};
      }

      if (!dateCategoryCounts[createdDate][category]) {
        dateCategoryCounts[createdDate][category] = 0;
      }

      dateCategoryCounts[createdDate][category]++;
    });

    const categories = Object.keys(relatedJobs.reduce((acc, job) => { acc[job.jobAd.category.name] = true; return acc; }, {}));
    const chartData: any = [];

    categories.forEach(category => {
      const data: any = [];

      Object.entries(dateCategoryCounts).forEach(([date, categoryCounts]) => {
        data.push({
          x: date,
          y: categoryCounts[category] || 0
        });
      });

      chartData.push({
        label: category,
        data: data
      });
    });
    const chartLabels = Object.keys(dateCategoryCounts);

    return { chartData, chartLabels };
  }

  relateJobsAndAds(jobs: Array<any>, jobAds: Array<any>) {
    const relatedJobs = [];

    for (const job of jobs) {
      const relatedAdUid = job.advertisement.id;
      const relatedAd = jobAds.find(jobAd => jobAd.uid === relatedAdUid);

      if (relatedAd) {
        const relatedJob = { ...job, jobAd: relatedAd };
        relatedJobs.push(relatedJob);
      }
    }

    return relatedJobs;
  }

}
