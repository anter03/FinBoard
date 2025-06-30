import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Questo importa ngModel
import { OrderFormComponent } from '../../components/order-form/order-form.component'; // <--- Questo importa ngModel
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core'
import { HttpClientModule } from '@angular/common/http';
import { Order,OrderFilters,Portfolio} from '../../models/';
import { OrderService,PortfolioService } from '../../services/';
import { C } from '@angular/cdk/keycodes';




@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  imports: [CommonModule,FormsModule,MatDialogModule,HttpClientModule],
  styleUrls: ['./orders-management.component.css']
})
export class OrdersManagementComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private orderService = inject(OrderService);
  
  


//ordini
  orders: Order[] = []
  filteredOrders: Order[] = [];
  
  isLoading: boolean = false;
  
filters: OrderFilters = {
  id: null,
  isin: null,
  quantity: null,
  portfolio: null,
  operationDateFrom: null,
  operationDateTo: null,
  valueDateFrom: null,
  valueDateTo: null,
  status: null,
  currency: null,
  side: null
};


  portfolioOptions: Portfolio[] = [];

  statoOptions = ['EXECUTED', 'PENDING', 'CANCELLED'];
  divisaOptions = ['EUR', 'USD', 'GBP', 'JPY'];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];


    console.log(this.filteredOrders);
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
  this.normalizeFilters();

  this.isLoading = true;
  this.orderService.filterOrders(this.filters).subscribe({
    next: (orders) => {
      this.filteredOrders = orders;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error fetching filtered orders:', error);
      this.isLoading = false;
    }
    
  });
  console.log('Order object:', JSON.stringify(this.filteredOrders, null, 2));
}

   normalizeFilters() {
  

  for (const key in this.filters) {
    if (this.filters[key as keyof OrderFilters] === "") {
      this.filters[key as keyof OrderFilters] = null;
    }
  }

}



clearFilters(): void {
  this.filters = {
    id: null,
    isin: null,
    quantity: null,
    portfolio: null,
    operationDateFrom: null,
    operationDateTo: null,
    valueDateFrom: null,
    valueDateTo: null,
    status: null,
    currency: null,
    side: null
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
    console.log('Visualizza ordine');
  console.log(order);
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '1600px',
      maxWidth: '250vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'custom-dialog-container', 
      data: {
        order: order,
        isViewMode: true
      }
    });
  }

  editOrder(order: Order): void {
    console.log('Modifica ordine:', order);
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '1200px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'custom-dialog-container', 
      data: {
        order: order,
        isEditMode: true
      }
    });
  }

  getStatusClass(stato: string): string {
    switch (stato.toLowerCase()) {
      case 'EXECUTED':
        return 'status-success';
      case 'PENDING':
        return 'status-pending';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

deleteOrder(order: Order): void {
  const confirmed = window.confirm(`Sei sicuro di voler eliminare l'ordine ${order.id}?`);
  if (confirmed) {
    // Chiamata al servizio per eliminare l'ordine
    this.orderService.hardDelete(order.id).subscribe(() => {
      console.log('Ordine eliminato');
    });
  }
}


  formatCurrency(amount: number, currency: string): string {
    if(currency == null)
      return  '';

    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT').format(new Date(date));
  }



}