import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, Instrument, Portfolio, Order } from './../../models/';
import { OrderService, UserService, PortfolioService, InstrumentService } from '../../services';
import { OrderValidationResponse } from '../../models/OrderValidationResponse';
import { CheckLimitViewerComponent } from '../../components/check-limit-viewer/check-limit-viewer.component';




@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CheckLimitViewerComponent
  ]
})
export class OrderFormComponent implements OnInit {
  private portfolioService = inject(PortfolioService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private instrumentService = inject(InstrumentService);
  validationResponse: OrderValidationResponse | null = null;
  isValidating = false;
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

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.operators = data;
      },
      error: (err) => {
        console.error('Errore nel caricamento dei portfolio:', err);
      },
    });

    this.instrumentService.getAll().subscribe({
      next: (data) => {
        this.instruments = data;
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
    //this.orderForm = this.fb.group({
    //  id: [null],
    //  portfolioId: [null, [Validators.required]],
    //  isin: [null, [Validators.required]],
    //  side: ['', [Validators.required]],
    //  quantity: [null, [Validators.required, Validators.min(0.0001)]],
    //  price: [null, [Validators.min(0)]],
    //  currency: ['EUR', [Validators.required]],
    //  operationDate: ['', [Validators.required]],
    //  evaluationDate: ['', [Validators.required]]
    //});
    this.orderForm = this.fb.group({
      id: [null],
      portfolioId: [null, null],
      isin: [null, null],
      side: ['', null],
      quantity: [null],
      price: [null],
      currency: ['EUR', null],
      operationDate: ['', null],
      evaluationDate: ['', null]
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

  // Determina quando mostrare la sezione validazione
  shouldShowValidation(): boolean {
    return this.validationResponse !== null && !this.isViewMode;
  }

  // Controlla se si può eseguire la validazione
  canValidate(): boolean {
    return this.isFormValid() && !this.isViewMode;
  }

  // Controlla se si può salvare (form valido + controlli superati)
  canSave(): boolean {
    if (this.isViewMode) return false;
    
    const formValid = this.isFormValid();
    const checksValid = this.validationResponse?.valid ?? true; // Se non ci sono controlli, considera valido
    
    return formValid && checksValid;
  }

 // Esegue la validazione chiamando il backend
validateOrder(): void {
  if (!this.canValidate()) return;

  this.isValidating = true;

  const formData = this.orderForm.value;

  // Costruzione oggetti relazionati
  const selectedInstrument = this.instruments.find(i => i.isin === formData.isin);
  const selectedUser = this.operators.find(o => o.id === 2); // Hardcoded
  const selectedPortfolio = this.portfolios.find(p => p.id === +formData.portfolioId);

  // Costruzione ordine anche in view mode
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
    instrument: selectedInstrument!,
    user: selectedUser!,
    portfolio: selectedPortfolio!
  };

  // Se è in view mode chiude senza validare ma dopo aver costruito l'ordine
  if (this.isViewMode) {
    this.onClose();
    return;
  }

  if (!this.isFormValid()) {
    // Marca i campi per mostrare gli errori
    Object.keys(this.orderForm.controls).forEach(key => {
      this.orderForm.get(key)?.markAsTouched();
    });
    this.isValidating = false;
    return;
  }

  // Se tutto è ok, si procede con la validazione dell'ordine
  this.orderService.validateOrder(orderData).subscribe({
    next: (response: OrderValidationResponse) => {
      this.validationResponse = response;
      console.log('Validazione completata:', response);
    },
    error: (error) => {
      console.error('Errore durante la validazione:', error);
      this.validationResponse = null;
    },
    complete: () => {
      this.isValidating = false;
    }
  });
}



/**
 * Gestisce il salvataggio dell'ordine (versione unificata)
 */
onSave(): void {
  if (this.isViewMode) {
    this.onClose();
    return;
  }

  // Ignora la validazione del form Angular e procede comunque
  const formData = this.orderForm.value;

  // Costruisci l'oggetto Order con le relazioni e valori hardcoded
  const selectedInstrument = this.instruments.find(i => i.isin === formData.isin);
  const selectedUser = this.operators.find(o => o.id === 2); // Valore hardcoded mantenuto
  const selectedPortfolio = this.portfolios.find(p => p.id === +formData.portfolioId);

  // Controllo esistenza oggetti relazionati
  if (!selectedUser) {
    console.log('operators', this.operators);
    return;
  }
  if (!selectedPortfolio) {
    console.log('Portfolios disponibili:', this.portfolios);
    console.log('+formData.portfolioId:', +formData.portfolioId);
    return;
  }
  if (!selectedInstrument) {
    console.log('this.instruments:', this.instruments);
    console.log('formData.isin:', formData.isin);
    return;
  }

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
    instrument: selectedInstrument,
    user: selectedUser,
    portfolio: selectedPortfolio
  };

  // Chiama il backend per la validazione (mantenuto)

  if(this.isEditMode){
    this.orderService.updateOrder(orderData.id,orderData)

    this.onClose();
    return;
  }
   
  this.orderService.createOrder(orderData).subscribe({
    next: (response: OrderValidationResponse) => {
      console.log('Risposta ricevuta:', response);

      if (!response.valid) {
        console.warn('Ordine non valido:', response.errorMessages);
        response.checkResults.forEach((res, i) => {
          console.warn(`Controllo #${i + 1}:`, res);
        });

        // Mostra errore a utente (es: snackbar)
        // NIENTE emit o close
        return;
      }

      // Se valido, puoi ora emettere o chiamare un'azione successiva
      console.log('Ordine valido.');
      
      // Emetti il salvataggio e chiudi
      this.save.emit(orderData);
      this.onClose();
    },
    error: (error) => {
      console.error('Errore nella creazione dell\'ordine:', error.toISOString);
    }
  });
}


}