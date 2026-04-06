import { Component, signal, computed } from '@angular/core';
import { IProduct } from './product';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false, 

  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Empresa ACME');
  
  listFilter = signal(''); 

  products = signal<IProduct[]>([
    {
      productID: 1,
      productName: "Figura de accion de Asta",
      productCode:  "PROD001",
      releaseDate: "2024-06-01",
      price: 82000,
      description: "Figura de accion de Asta de Black Clover...",
      starRating: 4.5,
      imageUrl: "AstaFigura.png"
    },
    {
      productID: 2,
      productName: "Black clover - Manga Tomo 32",
      productCode:  "PROD002",
      releaseDate: "2024-06-01",
      price: 10000,
      description: "Tomo 32 del manga de Black clover",
      starRating: 4,
      imageUrl: "Tomo32.png"
    },
    {
      productID: 3,
      productName: "Black clover - Funko Pop de Asta",
      productCode:  "PROD003",
      releaseDate: "2024-04-20",
      price: 25000,
      description: "Funko Pop de Asta de Black Clover",
      starRating: 4,
      imageUrl: "figuraAsta.png"
    }
  ]);

  filteredProducts = computed(() => 
    this.products().filter(p => 
      p.productName.toLowerCase().includes(this.listFilter().toLowerCase())
    )
  );
}