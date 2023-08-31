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
            callback: (value) => `R$ ${(+value).toFixed(2).replace(/\d(?=(\d{3})+\b)/g, '$&,').replace('.', ',')}`
          }
        }
      }
    };

    this.dataLoaded = true;
  }

  setDateCategoryPriceDataset() {
    const relatedJobs = this.relateJobsAndAds(this.rawJobsData, this.rawJobAdsData);
    const datePriceMap: { [date: string]: { [category: string]: number } } = {};

    relatedJobs.forEach(job => {
      const category = job.jobAd.category.name;
      const createdDate = parse(job.created, 'dd/MM/yyyy HH:mm:ss', new Date()).toLocaleDateString();

      if (!datePriceMap[createdDate]) {
        datePriceMap[createdDate] = {};
      }

      if (!datePriceMap[createdDate][category]) {
        datePriceMap[createdDate][category] = 0;
      }

      datePriceMap[createdDate][category] += job.contract_price;
    });

    const categories = Object.keys(relatedJobs.reduce((acc, job) => { acc[job.jobAd.category.name] = true; return acc; }, {}));
    const chartData: any = [];

    categories.forEach(category => {
      const data: any = [];

      Object.entries(datePriceMap).forEach(([date, categoryPrices]) => {
        data.push({
          x: date,
          y: categoryPrices[category] || 0
        });
      });

      chartData.push({
        label: category,
        data: data
      });
    });
    const chartLabels = Object.keys(datePriceMap);

    return { chartData, chartLabels };
  }

  relateJobsAndAds(jobs: Array<any>, jobAds: Array<any>) {
    const relatedJobs = [];

    for (const job of jobs) {
      const relatedAdUid = job.advertisement[0];
      const relatedAd = jobAds.find(jobAd => jobAd.uid === relatedAdUid);

      if (relatedAd) {
        const relatedJob = { ...job, jobAd: relatedAd };
        relatedJobs.push(relatedJob);
      }
    }

    return relatedJobs;
  }

}
