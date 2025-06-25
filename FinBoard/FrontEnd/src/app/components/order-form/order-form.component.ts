import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from './../../models/Order';
import { Portfolio } from './../../models/Portfolio';
import { Instrument } from './../../models/Instrument';
import { User } from './../../models/User';
import { PortfolioService } from '../../services/portfolio.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class OrderFormComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private orderService = inject(OrderService);
  // Inputs
  @Input() order: Order | null = null;
  @Input() isEditMode: boolean = false;
  @Input() isViewMode: boolean = false;
  @Input() portfolios: Portfolio[] = [];
  @Input() instruments: Instrument[] = [];
  @Input() operators: User[] = [];
  
  // Outputs
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  // Form
  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      order: Order | null; 
      isEditMode: boolean; 
      isViewMode: boolean;
      portfolios: Portfolio[];
      instruments: Instrument[];
      operators: User[];
    }
  ) {
    // Inizializza le liste dai dati passati
    if (this.data) {
      this.order = this.data.order;
      this.isEditMode = this.data.isEditMode || false;
      this.isViewMode = this.data.isViewMode || false;
      this.portfolios = this.data.portfolios || [];
      this.instruments = this.data.instruments || [];
      this.operators = this.data.operators || [];
    }

      this.portfolioService.getAll().subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei portfolio:', err);
      },
    });
    
    this.initializeForm();
  }



  ngOnInit(): void {
    // Se siamo in modalità edit/view e abbiamo un ordine, popoliamo il form
          console.log(this.order);
    if ((this.isEditMode || this.isViewMode) && this.order) {

      this.orderForm.patchValue({
        id: this.order.id,
        portfolioId: this.order.portfolio?.id,
        isin: this.order.instrument?.isin,
        operatorId: this.order.user?.id,
        side: this.order.side,
        quantity: this.order.quantity,
        price: this.order.price,
        status: this.order.status,
        currency: this.order.currency,
        operationDate: this.order.operationDate ? this.formatDateForInput(this.order.operationDate) : '',
        evaluationDate: this.order.evaluationDate ? this.formatDateForInput(this.order.evaluationDate) : ''
      });
    }

    // Se è in modalità visualizzazione, disabilita tutti i campi
    if (this.isViewMode) {
      this.orderForm.disable();
    }
  }

  /**
   * Formatta una data per l'input HTML date
   */
  private formatDateForInput(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return new Date(date).toISOString().split('T')[0];
    }
    return '';
  }

  /**
   * Inizializza il form reattivo
   */
  private initializeForm(): void {
    this.orderForm = this.fb.group({
      id: [null],
      portfolioId: [null, [Validators.required]],
      isin: [null, [Validators.required]],
      side: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.0001)]],
      price: [null, [Validators.min(0)]],
      currency: ['EUR', [Validators.required]],
      operationDate: ['', [Validators.required]],
      evaluationDate: ['', [Validators.required]]
    });
  }

  /**
   * Verifica se il form è valido
   */
  isFormValid(): boolean {
    return this.orderForm.valid;
  }

  /**
   * Ottieni i controlli del form per facilitare l'accesso negli errori
   */
  get formControls() {
    return this.orderForm.controls;
  }

  /**
   * Verifica se un campo ha errori
   */
  hasError(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Ottieni il messaggio di errore per un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} è obbligatorio`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} deve essere maggiore di ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  /**
   * Ottieni l'etichetta del campo
   */
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'portfolioId': 'Portafoglio',
      'instrumentId': 'Strumento',
      'operatorId': 'Operatore',
      'side': 'Tipo Operazione',
      'quantity': 'Quantità',
      'price': 'Prezzo',
      'currency': 'Valuta',
      'operationDate': 'Data Operazione',
      'evaluationDate': 'Data Valutazione'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Gestisce la chiusura della modale
   */
  onClose(): void {
    this.close.emit();
    this.dialogRef.close();
  }

  /**
   * Gestisce il salvataggio dell'ordine
   */
onSave(): void {
  if (this.isViewMode) {
    this.onClose();
    return;
  }

  if (this.isFormValid()) {
    const formData = this.orderForm.value;
    
    // Costruisci l'oggetto Order con le relazioni e seguendo la struttura delle tue interfacce
    const orderData: Order = {
      id: formData.id,
      createdAt: this.order?.createdAt || new Date().toISOString(),
      deleted: false,
      executedAt: this.order?.executedAt || null,
      price: formData.price,
      quantity: formData.quantity,
      side: formData.side,
      status: formData.status,
      currency: formData.currency,
      operationDate: new Date(formData.operationDate),
      evaluationDate: new Date(formData.evaluationDate),
      instrument: this.instruments.find(i => i.id === formData.instrumentId)!,
      user: this.operators.find(o => o.id === formData.operatorId)!,
      portfolio: this.portfolios.find(p => p.id === formData.portfolioId)!
    };

    // Chiamata al servizio per creare l'ordine
    this.orderService.createOrder(orderData).subscribe({
      next: (createdOrder: Order) => {
        // Successo: emetti l'ordine creato e chiudi il dialog
        this.save.emit(createdOrder);
        this.dialogRef.close(createdOrder);
      },
      error: (error) => {
        // Gestisci l'errore (es. mostra un messaggio di errore)
        console.error('Errore nella creazione dell\'ordine:', error);
        // Qui potresti mostrare un toast/snackbar con l'errore
      }
    });
  } else {
    // Marca tutti i campi come touched per mostrare gli errori
    Object.keys(this.orderForm.controls).forEach(key => {
      this.orderForm.get(key)?.markAsTouched();
    });
  }
}

  /**
   * Gestisce l'annullamento
   */
  onCancel(): void {
    this.cancel.emit();
    this.onClose();
  }

  /**
   * Reset del form
   */
  resetForm(): void {
    this.orderForm.reset();
    this.orderForm.patchValue({
      status: 'DRAFT',
      currency: 'EUR'
    });
  }

  /**
   * Ottieni il titolo della modale
   */
  getModalTitle(): string {
    if (this.isViewMode) return 'Visualizza Ordine';
    if (this.isEditMode) return 'Modifica Ordine';
    return 'Nuovo Ordine';
  }

  /**
   * Ottieni il testo del pulsante di salvataggio
   */
  getSaveButtonText(): string {
    if (this.isViewMode) return 'Chiudi';
    if (this.isEditMode) return 'Aggiorna';
    return 'Salva';
  }
}