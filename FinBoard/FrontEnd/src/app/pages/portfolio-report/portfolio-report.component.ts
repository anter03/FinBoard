import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { User, Instrument, Portfolio, Order } from './../../models/';
import { OrderService } from '../../services/';

Chart.register(...registerables);

export interface PortfolioSummary {
  portfolio_name: string;
  portfolio_id: number;
  total_orders: number;
  total_value: number;
  executed_orders: number;
  pending_orders: number;
  currency: string;
}

export interface InstrumentSummary {
  instrument_name: string;
  isin: string;
  total_quantity: number;
  total_value: number;
  currency: string;
  instrument_type: string;
  country: string;
  rating: string;
}

export interface OrderStats {
  totalOrders: number;
  executedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  draftOrders: number;
  totalValue: number;
}

@Component({
  selector: 'app-portfolio-report',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './portfolio-report.component.html',
  styleUrls: ['./portfolio-report.component.css']
})
export class PortfolioReportComponent implements OnInit, OnChanges {
  @Input() orders: Order[] = [];
  
  portfolioSummary: PortfolioSummary[] = [];
  instrumentSummary: InstrumentSummary[] = [];
  orderStats: OrderStats = {
    totalOrders: 0,
    executedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    draftOrders: 0,
    totalValue: 0
  };

  // Chart data
  portfolioChartData: any;
  statusChartData: any;
  instrumentTypeChartData: any;
  countryChartData: any;
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 12 } }
      }
    }
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
  };

  // NUOVO: Iniezione del servizio nel costruttore
  constructor(private orderService: OrderService) {}

  // MODIFICATO: Logica di ngOnInit per gestire il caricamento autonomo dei dati
  ngOnInit() {
    // Se gli ordini non sono stati forniti dall'esterno (via @Input),
    // il componente li carica autonomamente.
    if (!this.orders || this.orders.length === 0) {
      this.fetchOrders();
    } else {
      // Altrimenti, se i dati sono già presenti, li processa.
      this.processData();
    }
  }

  ngOnChanges() {
    // ngOnChanges gestisce gli aggiornamenti se i dati vengono passati tramite @Input
    if (this.orders && this.orders.length > 0) {
      this.processData();
    }
  }

  // NUOVO: Metodo per incapsulare la logica di chiamata al servizio
  private fetchOrders() {
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        // Una volta ricevuti i dati, avvia l'elaborazione per popolare report e grafici
        this.processData(); 
      },
      error: (err) => {
        console.error('Errore nel caricamento degli ordini:', err);
        // Potresti voler impostare una variabile per mostrare un messaggio di errore nell'HTML
      },
    });
  }

  private processData() {
    // Se non ci sono ordini, esci per evitare errori
    if (!this.orders || this.orders.length === 0) {
      return;
    }
    this.calculateOrderStats();
    this.calculatePortfolioSummary();
    this.calculateInstrumentSummary();
    this.prepareChartData();
  }

  private calculateOrderStats() {
    this.orderStats = {
      totalOrders: this.orders.length,
      executedOrders: this.orders.filter(o => o.status === 'EXECUTED').length,
      pendingOrders: this.orders.filter(o => o.status === 'PENDING').length,
      cancelledOrders: this.orders.filter(o => o.status === 'CANCELLED').length,
      draftOrders: this.orders.filter(o => o.status === 'DRAFT').length,
      totalValue: 0
    };

    this.orderStats.totalValue = this.orders
      .filter(o => o.status === 'EXECUTED' && o.price !== null)
      .reduce((sum, order) => {
        const value = order.price! * order.quantity;
        return order.side === 'BUY' ? sum + value : sum - 0; //COSI' ECLUDO LE VENDITE DAL REPORT
        //return order.side === 'BUY' ? sum + value : sum - value;
      }, 0);
  }

  private calculatePortfolioSummary() {
    const portfolioMap = new Map<number, PortfolioSummary>();
    
    this.orders.forEach(order => {
      const portfolioId = order.portfolio.id;
      
      if (!portfolioMap.has(portfolioId)) {
        portfolioMap.set(portfolioId, {
          portfolio_id: portfolioId,
          portfolio_name: order.portfolio.name,
          total_orders: 0,
          total_value: 0,
          executed_orders: 0,
          pending_orders: 0,
          currency: order.currency
        });
      }
      
      const summary = portfolioMap.get(portfolioId)!;
      summary.total_orders++;
      
      if (order.status === 'EXECUTED' && order.price !== null) {
        summary.executed_orders++;
        const value = order.price * order.quantity;
        //summary.total_value += order.side === 'BUY' ? value : -value;
        summary.total_value += order.side === 'BUY' ? value : -0; //escludo vendite
      } else if (order.status === 'PENDING') {
        summary.pending_orders++;
      }
    });
    
    this.portfolioSummary = Array.from(portfolioMap.values());
  }

  private calculateInstrumentSummary() {
    const instrumentMap = new Map<string, InstrumentSummary>();
    
    this.orders.forEach(order => {
      if (order.status === 'EXECUTED' && order.price !== null) {
        const key = order.instrument.isin || order.instrument.id.toString();
        if (!instrumentMap.has(key)) {
          instrumentMap.set(key, {
            instrument_name: order.instrument.name,
            isin: order.instrument.isin || 'N/A',
            total_quantity: 0,
            total_value: 0,
            currency: order.currency,
            instrument_type: order.instrument.instrumentTypeDescription,
            country: order.instrument.country || 'N/D',
            rating: order.instrument.rating || 'N/A'
          });
        }
        
        const summary = instrumentMap.get(key)!;
        if (order.side === 'BUY') {
          summary.total_quantity += order.quantity;
          summary.total_value += order.price * order.quantity;
        } 
        
      }
    });
    
    this.instrumentSummary = Array.from(instrumentMap.values()).filter(i => i.total_quantity > 0);
  }

  private prepareChartData() {
    this.preparePortfolioChartData();
    this.prepareStatusChartData();
    this.prepareInstrumentTypeChartData();
    this.prepareCountryChartData();
  }
  
  //... [il resto dei metodi 'prepareChartData', 'getRatingClass', 'formatCurrency', etc. rimane invariato] ...
  private preparePortfolioChartData() {
    const portfolioLabels = this.portfolioSummary.map(p => p.portfolio_name);
    const portfolioValues = this.portfolioSummary.map(p => p.total_value);
    
    this.portfolioChartData = {
      labels: portfolioLabels,
      datasets: [{
        data: portfolioValues,
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }

  private prepareStatusChartData() {
    const statusCounts = {
      'EXECUTED': this.orderStats.executedOrders,
      'PENDING': this.orderStats.pendingOrders,
      'CANCELLED': this.orderStats.cancelledOrders,
      'DRAFT': this.orderStats.draftOrders
    };

    this.statusChartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c', '#95a5a6'],
        borderWidth: 1
      }]
    };
  }

  private prepareInstrumentTypeChartData() {
    const typeMap = new Map<string, number>();
    this.orders.forEach(order => {
      if (order.status === 'EXECUTED' && order.price !== null) {
        const value = order.price * order.quantity;
        const adjustedValue = order.side === 'BUY' ? value : -0; //escludo vendite
        const type = order.instrument.instrumentTypeDescription;
        typeMap.set(type, (typeMap.get(type) || 0) + adjustedValue);
      }
    });

    this.instrumentTypeChartData = {
      labels: Array.from(typeMap.keys()),
      datasets: [{
        data: Array.from(typeMap.values()),
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }
  
  private prepareCountryChartData() {
    const countryMap = new Map<string, number>();
    this.instrumentSummary.forEach(instrument => {
      const country = instrument.country || 'N/D';
      const value = instrument.total_value;
      countryMap.set(country, (countryMap.get(country) || 0) + value);
    });

    this.countryChartData = {
      labels: Array.from(countryMap.keys()),
      datasets: [{
        data: Array.from(countryMap.values()),
        backgroundColor: [
          'rgba(52, 152, 219, 0.8)', 'rgba(231, 76, 60, 0.8)', 'rgba(46, 204, 113, 0.8)',
          'rgba(243, 156, 18, 0.8)', 'rgba(155, 89, 182, 0.8)', 'rgba(26, 188, 156, 0.8)',
          'rgba(52, 73, 94, 0.8)'
        ],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    };
  }

  getRatingClass(rating: string): string {
    if (!rating || rating === 'N/A') return 'rating-none';
    const r = rating.toUpperCase();
    if (r.startsWith('AAA') || r.startsWith('AA')) return 'rating-high';
    if (r.startsWith('A') || r.startsWith('BBB')) return 'rating-medium';
    return 'rating-low';
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('it-IT').format(value);
  }
}
