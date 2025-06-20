import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Notification {
  id: string;
  tipo: 'ordine' | 'sistema' | 'avviso' | 'errore';
  titolo: string;
  messaggio: string;
  dataCreazione: Date;
  letto: boolean;
  priorita: 'alta' | 'media' | 'bassa';
  icona: string;
}

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css'],
  imports: [
    // altri moduli
   CommonModule,FormsModule
  ]
})
export class MessageCenterComponent implements OnInit {

  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  
  // Filtri
  selectedTipo: string = 'tutti';
  selectedStato: string = 'tutti';
  searchTerm: string = '';
  dataInizio: string = '';
  dataFine: string = '';

  // Contatori
  totalNotifications: number = 0;
  unreadCount: number = 0;

  tipiNotifica = [
    { value: 'tutti', label: 'Tutti i tipi' },
    { value: 'ordine', label: 'Ordini' },
    { value: 'sistema', label: 'Sistema' },
    { value: 'avviso', label: 'Avvisi' },
    { value: 'errore', label: 'Errori' }
  ];

  statiNotifica = [
    { value: 'tutti', label: 'Tutti gli stati' },
    { value: 'letto', label: 'Lette' },
    { value: 'non_letto', label: 'Non lette' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilters();
  }

  private loadMockData(): void {
    // Dati mock - qui integrerai le tue API
    this.notifications = [
      {
        id: 'NOT001',
        tipo: 'ordine',
        titolo: 'Ordine Eseguito',
        messaggio: 'L\'ordine ORD001 è stato eseguito con successo per 10.000,00 €',
        dataCreazione: new Date('2024-06-01T10:30:00'),
        letto: false,
        priorita: 'alta',
        icona: 'check-circle'
      },
      {
        id: 'NOT002',
        tipo: 'avviso',
        titolo: 'Margine Basso',
        messaggio: 'Il margine disponibile sul Portafoglio B è inferiore al 10%',
        dataCreazione: new Date('2024-06-02T14:15:00'),
        letto: true,
        priorita: 'media',
        icona: 'alert-triangle'
      },
      {
        id: 'NOT003',
        tipo: 'errore',
        titolo: 'Ordine Annullato',
        messaggio: 'L\'ordine ORD003 è stato annullato: fondi insufficienti',
        dataCreazione: new Date('2024-06-03T09:45:00'),
        letto: false,
        priorita: 'alta',
        icona: 'x-circle'
      },
      {
        id: 'NOT004',
        tipo: 'sistema',
        titolo: 'Manutenzione Programmata',
        messaggio: 'Manutenzione programmata del sistema dalle 02:00 alle 04:00',
        dataCreazione: new Date('2024-06-04T16:20:00'),
        letto: true,
        priorita: 'bassa',
        icona: 'settings'
      },
      {
        id: 'NOT005',
        tipo: 'ordine',
        titolo: 'Ordine in Attesa',
        messaggio: 'L\'ordine ORD004 è in attesa di conferma per 8.000,00 £',
        dataCreazione: new Date('2024-06-05T11:10:00'),
        letto: false,
        priorita: 'media',
        icona: 'clock'
      }
    ];

    this.updateCounters();
  }

  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      const matchTipo = this.selectedTipo === 'tutti' || notification.tipo === this.selectedTipo;
      const matchStato = this.selectedStato === 'tutti' || 
                        (this.selectedStato === 'letto' && notification.letto) ||
                        (this.selectedStato === 'non_letto' && !notification.letto);
      const matchSearch = !this.searchTerm || 
                         notification.titolo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                         notification.messaggio.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchData = true;
      if (this.dataInizio) {
        const startDate = new Date(this.dataInizio);
        matchData = matchData && notification.dataCreazione >= startDate;
      }
      if (this.dataFine) {
        const endDate = new Date(this.dataFine);
        endDate.setHours(23, 59, 59, 999);
        matchData = matchData && notification.dataCreazione <= endDate;
      }

      return matchTipo && matchStato && matchSearch && matchData;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTipo = 'tutti';
    this.selectedStato = 'tutti';
    this.searchTerm = '';
    this.dataInizio = '';
    this.dataFine = '';
    this.applyFilters();
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.letto = true;
      this.updateCounters();
      this.applyFilters();
    }
  }

  markAsUnread(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.letto = false;
      this.updateCounters();
      this.applyFilters();
    }
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.updateCounters();
    this.applyFilters();
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.letto = true);
    this.updateCounters();
    this.applyFilters();
  }

  private updateCounters(): void {
    this.totalNotifications = this.notifications.length;
    this.unreadCount = this.notifications.filter(n => !n.letto).length;
  }

  getTipoIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'ordine': 'trending-up',
      'sistema': 'settings',
      'avviso': 'alert-triangle',
      'errore': 'alert-circle'
    };
    return icons[tipo] || 'bell';
  }

  getPrioritaClass(priorita: string): string {
    const classes: { [key: string]: string } = {
      'alta': 'priority-high',
      'media': 'priority-medium',
      'bassa': 'priority-low'
    };
    return classes[priorita] || 'priority-medium';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}