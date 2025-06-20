import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Questo importa ngModel
import { OrderFormComponent } from '../../components/order-form/order-form.component'; // <--- Questo importa ngModel
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core'
import { HttpClientModule } from '@angular/common/http';
//import { PortfolioService } from '../../services/portfolio.service';
import { Portfolio } from '../../models/Portfolio';
import { Order} from '../../models/Order';
import { OrderService } from '../../services/order.service';
import { PortfolioService } from '../../services/portfolio.service';



//
//export interface Order {
//  id: string;
//  isin: string;
//  nominale: number;
//  portafoglio: string;
//  dataOperazione: Date;
//  dataValuta: Date;
//  stato: string;
//  divisa: string;
//  tipo:string;
//}

export interface OrderFilters {
  id: string;
  isin: string;
  nominale: string;
  portafoglio: string;
  dataOperazione: string;
  dataValuta: string;
  stato: string;
  divisa: string;
}

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  imports: [CommonModule,FormsModule,MatDialogModule,HttpClientModule],
  styleUrls: ['./orders-management.component.css']
})
export class OrdersManagementComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private orderService = inject(OrderService);
  
  
  
  
  // orders: Order[] = [
  //   {
  //     id: 'ORD001',
  //     isin: 'IT0003128367',
  //     nominale: 10000,
  //     tipo: 'acq',
  //     portafoglio: 'Portfolio A',
  //     dataOperazione: new Date('2024-06-01'),
  //     dataValuta: new Date('2024-06-03'),
  //     stato: 'Eseguito',
  //     divisa: 'EUR'
  //   },
  //   {
  //     id: 'ORD002',
  //     isin: 'US0378331005',
  //     nominale: 5000,
  //     tipo: 'ven',
  //     portafoglio: 'Portfolio B',
  //     dataOperazione: new Date('2024-06-02'),
  //     dataValuta: new Date('2024-06-04'),
  //     stato: 'Pending',
  //     divisa: 'USD'
  //   },
  //   {
  //     id: 'ORD003',
  //     isin: 'DE0007164600',
  //     nominale: 15000,
  //       tipo: 'acq',
  //     portafoglio: 'Portfolio A',
  //     dataOperazione: new Date('2024-06-03'),
  //     dataValuta: new Date('2024-06-05'),
  //     stato: 'Annullato',
  //     divisa: 'EUR'
  //   },
  //   {
  //     id: 'ORD004',
  //     isin: 'GB0009252882',
  //     nominale: 8000,
  //       tipo: 'acq',
  //     portafoglio: 'Portfolio C',
  //     dataOperazione: new Date('2024-06-04'),
  //     dataValuta: new Date('2024-06-06'),
  //     stato: 'Eseguito',
  //     divisa: 'GBP'
  //   },
  //   {
  //     id: 'ORD005',
  //     isin: 'FR0000120321',
  //     nominale: 12000,
  //       tipo: 'acq',
  //     portafoglio: 'Portfolio B',
  //     dataOperazione: new Date('2024-06-05'),
  //     dataValuta: new Date('2024-06-07'),
  //     stato: 'Pending',
  //     divisa: 'EUR'
  //   }
  // ];

//ordini
  orders: Order[] = []
  filteredOrders: Order[] = [];
  
  isLoading: boolean = false;
  
  filters: OrderFilters = {
    id: '',
    isin: '',
    nominale: '',
    portafoglio: '',
    dataOperazione: '',
    dataValuta: '',
    stato: '',
    divisa: ''
  };

  portfolioOptions: Portfolio[] = [];

  statoOptions = ['Eseguito', 'Pending', 'Annullato'];
  divisaOptions = ['EUR', 'USD', 'GBP', 'JPY'];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];


    this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.portfolioOptions = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei portfolio:', err);
      },
    });

    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...this.orders]; 
      },
      error: (err) => {
        console.error('Errore nel caricamento dei portfolio:', err);
      },
    });
  }

  searchOrders(): void {
    this.isLoading = true;
    
    // Simula una chiamata API
    setTimeout(() => {
      this.filteredOrders = this.orders.filter(order => {
        return this.matchesFilters(order);
      });
      this.isLoading = false;
    }, 500);
  }

private matchesFilters(order: Order): boolean {
  // Filtra per ID
  if (this.filters.id && !order.id.toString().includes(this.filters.id)) {
    return false;
  }

  // Filtra per ISIN (ora in order.instrument.isin)
  if (this.filters.isin && !order.instrument?.isin?.toLowerCase().includes(this.filters.isin.toLowerCase())) {
    return false;
  }

  // Filtra per Nominale (ora quantity)
  if (this.filters.nominale && order.quantity.toString() !== this.filters.nominale) {
    return false;
  }

  // Filtra per Portafoglio (ora order.portfolio.name)
  if (this.filters.portafoglio && order.portfolio?.name !== this.filters.portafoglio) {
    return false;
  }

  // Filtra per Data Operazione (ora operationDate)
  if (this.filters.dataOperazione) {
    const filterDate = new Date(this.filters.dataOperazione);
    const orderDate = new Date(order.operationDate);
    if (orderDate.toDateString() !== filterDate.toDateString()) {
      return false;
    }
  }

  // Filtra per Data Valuta (ora evaluationDate)
  if (this.filters.dataValuta) {
    const filterDate = new Date(this.filters.dataValuta);
    const orderDate = new Date(order.evaluationDate);
    if (orderDate.toDateString() !== filterDate.toDateString()) {
      return false;
    }
  }

  // Filtra per Stato (ora status)
  if (this.filters.stato && order.status !== this.filters.stato) {
    return false;
  }

  // Filtra per Divisa (ora in order.instrument.currency)
  if (this.filters.divisa && order.instrument?.currency !== this.filters.divisa) {
    return false;
  }

  return true;
}

  clearFilters(): void {
    this.filters = {
      id: '',
      isin: '',
      nominale: '',
      portafoglio: '',
      dataOperazione: '',
      dataValuta: '',
      stato: '',
      divisa: ''
    };
    this.filteredOrders = [...this.orders];
  }

newOrder(): void {
  console.log('Creazione nuovo ordine');

  const dialogRef = this.dialog.open(OrderFormComponent, {
    width: '1200px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    disableClose: true,
    panelClass: 'custom-dialog-container', 
    data: {
      order: null,
      isEditMode: false
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Ordine salvato', result);
      // eventualmente aggiorna lista ordini
    } else {
      console.log('Modale chiusa senza salvare');
    }
  });
}

  viewOrder(order: Order): void {
    console.log('Visualizza ordine:', order);
    // Qui implementerai la logica per visualizzare l'ordine
  }

  editOrder(order: Order): void {
    console.log('Modifica ordine:', order);
    // Qui implementerai la logica per modificare l'ordine
  }

  getStatusClass(stato: string): string {
    switch (stato.toLowerCase()) {
      case 'eseguito':
        return 'status-success';
      case 'pending':
        return 'status-pending';
      case 'annullato':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT').format(new Date(date));
  }
}