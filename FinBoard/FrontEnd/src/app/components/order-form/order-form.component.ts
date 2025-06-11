import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';


// Interfaces
interface Portfolio {
  id: number;
  name: string;
}

interface Titolo {
  id: number;
  name: string;
  isin: string;
}

interface Order {
  id?: number;
  user_id: number;
  portfolio_id: number;
  titolo_id: number;
  order_type: 'BUY' | 'SELL';
  quantity: number;
  executed_quantity?: number;
  price?: number;
  countervalue?: number;
  currency: string;
  status: 'DRAFT' | 'PENDING' | 'VALIDATED' | 'SENT' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  exchange_rate_used?: number;
  notes?: string;
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
    imports: [
    // altri moduli
    ReactiveFormsModule,CommonModule
  ]
})
export class OrderFormComponent implements OnInit {

  // Inputs
  @Input() order: Order | null = null;
  @Input() isEditMode: boolean = false;
  @Input() portfolios: Portfolio[] = [];
  @Input() titoli: Titolo[] = [];
  
  // Outputs
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  // Form
  orderForm!: FormGroup;

constructor(
  private fb: FormBuilder,
  public dialogRef: MatDialogRef<OrderFormComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { order: Order | null; isEditMode: boolean }
) {
  this.initializeForm();
}

  ngOnInit(): void {
    // Se siamo in modalità edit e abbiamo un ordine, popoliamo il form
    if (this.isEditMode && this.order) {
      this.orderForm.patchValue(this.order);
    }
  }

  /**
   * Inizializza il form reattivo
   */
  private initializeForm(): void {
    this.orderForm = this.fb.group({
      id: [null],
      user_id: [null],
      portfolio_id: [null, [Validators.required]],
      titolo_id: [null, [Validators.required]],
      order_type: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.0001)]],
      executed_quantity: [0],
      price: [null, [Validators.min(0)]],
      countervalue: [null, [Validators.min(0)]],
      currency: ['', [Validators.required]],
      status: ['DRAFT'],
      exchange_rate_used: [null, [Validators.min(0)]],
      notes: ['']
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
        return `${fieldName} è obbligatorio`;
      }
      if (field.errors['min']) {
        return `${fieldName} deve essere maggiore di ${field.errors['min'].min}`;
      }
    }
    return '';
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
    if (this.isFormValid()) {
      const formData = this.orderForm.value;
      this.save.emit(formData);
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
      executed_quantity: 0,
      status: 'DRAFT'
    });
  }
}