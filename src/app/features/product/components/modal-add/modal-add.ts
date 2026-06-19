import { Component, output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product as ProductService } from '../../services/product';

@Component({
  selector: 'app-modal-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-add.html',
  styleUrl: './modal-add.css',
})
export class ModalAdd implements OnInit {
  close = output<void>();
  save = output<any>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      productName: ['', Validators.required],
      productCode: ['', Validators.required],
      releaseDate: ['', Validators.required],
      price: [0, Validators.required],
      starRating: [0, Validators.required],
      description: ['', Validators.required]
    });
    this.form.valueChanges.subscribe(() => {
      console.log('¿Es válido el formulario?:', this.form.valid);
      console.log('Errores por campo:', this.form.controls);
    });
  }

  onSave() {
    console.log('Valores del formulario antes de enviar:', this.form.value);
    this.productService.saveProduct(this.form.value).subscribe({
      next: (res: any) => {
        console.log('Producto guardado exitosamente', res);
        this.ocultarModal();
      },
      error: (err: any) => {
        console.error('Error al guardar el producto', err);
        alert('Error al conectar con el servidor para guardar el producto.');
      }
    });
  }

  ocultarModal() {
    this.close.emit();
  }
}