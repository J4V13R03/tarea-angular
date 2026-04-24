import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductList } from "./product/product-list/product-list";
import { IProduct } from './product'; 
import { Product } from './product/product'; 
import { Weather } from './services/weather';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductList, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  datoRecibido = signal<any>('');
  showChildren = signal(true);
  protected readonly title = signal('Mi-app-mod');
  listFilter = signal<string>('');

  products = signal<IProduct[]>([]);
  weatherData = signal<any>(null);

  constructor(private productService: Product, private weatherService: Weather){ 
    console.log('Padre: constructor');
  }

  ngOnInit(): void {
    console.log('Padre: ngOnInit');
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log("Datos recibidos del backend:", data);
        if (data.ok) {
          this.products.set(data.productos);
        }
      },
      error: (error: any) => {
        console.error("Error al traer los productos", error);
      }
    });
  }

  borrarProducto(id: number): void {
    console.log('Padre: Borrando producto con ID:', id);
    this.productService.deleteProduct(id).subscribe({
      next: (res: any) => {
        console.log('Respuesta borrar:', res);
        this.cargarProductos();
      },
      error: (err) => console.error('Error al borrar', err)
    });
  }

  actualizarProducto(producto: IProduct): void {
  console.log('Enviando actualización al servidor...', producto);
  
  this.productService.updateProduct(producto.productId, producto).subscribe({
    next: (res: any) => {
      if (res && (res.ok || res.status === 'success')) {
        console.log('Actualización exitosa en el backend');
        this.cargarProductos(); 
      } else {
        console.error('El servidor no confirmó la actualización', res);
      }
    },
    error: (err) => {
      console.error('Error fatal al conectar con el servidor', err);
      alert('Error al editar: El backend no respondió correctamente');
    }
  });
}

  ngOnChanges(): void{
    console.log('Padre: ngOnChanges');
  }

  ngOnDestroy(): void{
    console.log('Padre: ngOnDestroy');
  }

  toggleChildren(): void {
    this.showChildren.update(value=> !value);
  }

  filteredProducts = computed(() => {
    const filter = this.listFilter().toLowerCase();
    return this.products().filter(product => 
      product.productName.toLowerCase().includes(filter)
    );
  });
}