import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule, TitleCasePipe } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
   standalone: true, // agar standalone
  imports: [CommonModule, BaseChartDirective] // ✅ CommonModule import karo
})
export class ReportsComponent implements OnInit {
  @ViewChild('reportContent') reportContent!: ElementRef;

  reportType: 'monthly' | 'yearly' = 'monthly';

  // Sample data
  monthlyData = [1200, 1500, 1300, 1700, 1400, 1800, 2000, 1900, 2200, 2100, 2300, 2500];
  yearlyData = [15000, 18000, 20000, 22000, 25000];

  chartOptions: ChartOptions = {
    responsive: true,
  };

  chartLabels: string[] = [];
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    if (this.reportType === 'monthly') {
      this.chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      this.chartData.labels = this.chartLabels;
      this.chartData.datasets[0].data = this.monthlyData;
    } else {
      this.chartLabels = ['2019', '2020', '2021', '2022', '2023'];
      this.chartData.labels = this.chartLabels;
      this.chartData.datasets[0].data = this.yearlyData;
    }
  }

  switchReport(type: 'monthly' | 'yearly') {
    this.reportType = type;
    this.loadChart();
  }

  generatePDF() {
    const data = this.reportContent.nativeElement;
    html2canvas(data).then((canvas: HTMLCanvasElement) => {
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`report_${this.reportType}.pdf`);
    });
  }
}
