import { Component, Input } from '@angular/core';
import { IProduct } from '../../product';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'; 

@Component({
  selector: 'app-product-list',
  standalone: true, 
  imports: [NgxBootstrapIconsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @Input('datos') products: IProduct[] = [];

  imageWidth: number = 50;
  imageHeight: number = 50;
  imageMargin: number = 10;
  showImage: boolean = false;

  toggleImage(): void {
    this.showImage = !this.showImage;
  }
}