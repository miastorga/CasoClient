import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { VentasService } from './services/ventas.service';
import { Venta, VentaDTO } from './models/venta';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmCaptionComponent,
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    ReactiveFormsModule,
    HlmToasterComponent,
    HlmSpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private ventaService = inject(VentasService)
  listaVentas: Venta[] = []
  selectedVentaId: number | null = null;

  editForm: FormGroup
  addForm: FormGroup

  constructor(private formBuilder: FormBuilder) {
    this.editForm = this.formBuilder.group({
      compania: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      cantidad: [0, [Validators.required]],
      precio: [0, [Validators.required]],
    })

    this.addForm = this.formBuilder.group({
      compania: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      cantidad: [0, [Validators.required]],
      precio: [0, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllVentas()
  }

  getAllVentas() {
    this.ventaService.getAllVentas().subscribe({
      next: data => {
        if (data.length > 0) {
          this.listaVentas = data;
        }
      },
      error: error => {
        console.log(error)
        this.showToast('Ha ocurrido un error al mostrar las ventas')
      }
    });
  }

  onDeleteVenta(id: number) {
    this.ventaService.removeVenta(id).subscribe({
      next: () => {
        this.getAllVentas()
        this.showToast('Venta eliminada de manera exitosamente')
      },
      error: error => {
        console.log(error)
        this.showToast('Ha ocurrido un error')
      }
    });
  }

  onEditVenta(venta: Venta) {
    this.selectedVentaId = venta.id;
    this.editForm.patchValue({
      compania: venta.compania,
      producto: venta.producto,
      cantidad: venta.cantidad,
      precio: venta.precio
    });
  }

  onUpdateVenta() {
    if (this.editForm.valid && this.selectedVentaId !== null) {
      const updatedVenta: VentaDTO = this.editForm.value;
      this.ventaService.updateVenta(this.selectedVentaId, updatedVenta).subscribe({
        next: () => {
          this.getAllVentas();
          this.editForm.reset();
          this.showToast('Venta actualiza de manera exitosa')
        },
        error: error => {
          console.log(error)
          this.showToast('Ha ocurrido un error')
        }
      });
    }
  }

  onAddVenta() {
    if (this.addForm.valid) {
      const nuevaVenta: VentaDTO = this.addForm.value;
      this.ventaService.createVenta(nuevaVenta).subscribe({
        next: () => {
          this.getAllVentas();
          this.addForm.reset();
          this.showToast('Venta creada de manera exitosa')
        },
        error: error => {
          console.log(error)
          this.showToast('Ha ocurrido un error')
        }
      });
    }
  }

  showToast(mensaje: string) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    toast(`${mensaje}`,
      {
        description: `${formattedDate}`,
        action: {
          label: 'cerrar',
          onClick: () => console.log('Undo')
        }
      }
    )
  }

  hasErrorsAdd(controlName: string, errorType: string) {
    return this.addForm.get(controlName)?.hasError(errorType) && this.addForm.get(controlName)?.touched;
  }

  hasErrorsEdit(controlName: string, errorType: string) {
    return this.editForm.get(controlName)?.hasError(errorType) && this.editForm.get(controlName)?.touched;
  }
}
