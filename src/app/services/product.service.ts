import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductApi, toProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductApi[]>(this.apiUrl)
      .pipe(map((products) => products.map(toProduct)));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<ProductApi>(`${this.apiUrl}/${id}`)
      .pipe(map(toProduct));
  }
}