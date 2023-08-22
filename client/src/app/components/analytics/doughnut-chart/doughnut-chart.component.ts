import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  constructor(private analyticsService: AnalyticsService) { }

  async ngOnInit() {
    this.setChartData(this.rawData);
  }

  @Input() rawData: any;
  public pieChartDataset: any = null;
  public pieChartOptions: ChartOptions = {};
  public dataLoaded: boolean = false;

  public setChartData(rawData: any) {
    const categoryCounts = rawData.jobs.reduce((acc: any, job: any) => {
      const category = job.category.name;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    const pieChartMap = Object.keys(categoryCounts).map(category => ({
      category,
      count: categoryCounts[category]
    }));

    const dataCount = pieChartMap.map(data => data.count);
    const dataLabels = pieChartMap.map(data => data.category);
    const pieChartDataset = {
      data: {
        datasets: [{
          data: dataCount,
        }],
        labels: dataLabels
      },
      options: {
        legend: {
          position: 'bottom',
          display: false
        },
        cutoutPercentage: 80
      }
    }
    this.pieChartDataset = pieChartDataset.data;
    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          display: true
        }
      }
    };
    this.dataLoaded = true;
  }

  public optionsClick() {
    alert('click');
  }

}
