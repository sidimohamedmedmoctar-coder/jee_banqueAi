import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  DashboardService,
  StatsDTO,
  MonthlyOperationDTO,
  TopCustomerDTO,
} from '../../services/dashboard';

const MONTH_LABELS = [
  'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
  'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
];

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // ── Stat cards ──────────────────────────────────────────────────────────
  stats: StatsDTO = { totalCustomers: 0, totalAccounts: 0, totalOperations: 0, totalBalance: 0 };
  selectedYear = new Date().getFullYear();
  years: number[] = [];

  // ── Pie chart : accounts by type ────────────────────────────────────────
  pieData: ChartData<'pie', number[], string> = {
    labels: ['Courants (CA)', 'Épargne (SA)'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#0d6efd', '#198754'],
      hoverBackgroundColor: ['#0b5ed7', '#157347'],
    }],
  };
  pieOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  // ── Bar chart : operations per month ────────────────────────────────────
  barData: ChartData<'bar', number[], string> = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: 'Débit',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(220, 53, 69, 0.7)',
        borderColor: '#dc3545',
        borderWidth: 1,
      },
      {
        label: 'Crédit',
        data: Array(12).fill(0),
        backgroundColor: 'rgba(25, 135, 84, 0.7)',
        borderColor: '#198754',
        borderWidth: 1,
      },
    ],
  };
  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  // ── Horizontal bar chart : top customers ────────────────────────────────
  topCustomers: TopCustomerDTO[] = [];
  hbarData: ChartData<'bar', number[], string> = {
    labels: [],
    datasets: [{
      label: 'Solde total (MAD)',
      data: [],
      backgroundColor: [
        'rgba(13,110,253,0.75)', 'rgba(25,135,84,0.75)', 'rgba(255,193,7,0.75)',
        'rgba(220,53,69,0.75)', 'rgba(13,202,240,0.75)',
      ],
      borderRadius: 4,
    }],
  };
  hbarOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true } },
  };

  // ── Line chart : monthly evolution (credit - debit = net) ───────────────
  lineData: ChartData<'line', number[], string> = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: 'Crédit',
        data: Array(12).fill(0),
        borderColor: '#198754',
        backgroundColor: 'rgba(25,135,84,0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Débit',
        data: Array(12).fill(0),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220,53,69,0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } },
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 4; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loadStats();
    this.loadAccountsByType();
    this.loadOperationsPerMonth();
    this.loadTopCustomers();
  }

  onYearChange(): void {
    this.loadOperationsPerMonth();
  }

  // ── Loaders ──────────────────────────────────────────────────────────────

  private loadStats(): void {
    this.dashboardService.getStats().subscribe(s => { this.stats = s; this.cdr.detectChanges(); });
  }

  private loadAccountsByType(): void {
    this.dashboardService.getAccountsByType().subscribe(data => {
      this.pieData = {
        ...this.pieData,
        datasets: [{
          ...this.pieData.datasets[0],
          data: [data['CURRENT'] ?? 0, data['SAVING'] ?? 0],
        }],
      };
      this.cdr.detectChanges();
    });
  }

  private loadOperationsPerMonth(): void {
    this.dashboardService.getOperationsPerMonth(this.selectedYear).subscribe(
      (rows: MonthlyOperationDTO[]) => {
        const debits  = Array(12).fill(0);
        const credits = Array(12).fill(0);
        rows.forEach(r => {
          debits[r.month - 1]  = r.debit;
          credits[r.month - 1] = r.credit;
        });

        this.barData = {
          ...this.barData,
          datasets: [
            { ...this.barData.datasets[0], data: debits  },
            { ...this.barData.datasets[1], data: credits },
          ],
        };

        this.lineData = {
          ...this.lineData,
          datasets: [
            { ...this.lineData.datasets[0], data: credits },
            { ...this.lineData.datasets[1], data: debits  },
          ],
        };
        this.cdr.detectChanges();
      }
    );
  }

  private loadTopCustomers(): void {
    this.dashboardService.getTopCustomers().subscribe(data => {
      this.topCustomers = data;
      this.hbarData = {
        ...this.hbarData,
        labels: data.map(c => c.customerName),
        datasets: [{
          ...this.hbarData.datasets[0],
          data: data.map(c => c.totalBalance),
        }],
      };
      this.cdr.detectChanges();
    });
  }
}
