import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product, ProductFilters, PaginationInfo } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.escuelajs.co/api/v1';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private paginationSubject = new BehaviorSubject<PaginationInfo>({
    offset: 0,
    limit: 10,
    total: 0
  });

  public products$ = this.productsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public pagination$ = this.paginationSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    
    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.price_min) params = params.set('price_min', filters.price_min.toString());
      if (filters.price_max) params = params.set('price_max', filters.price_max.toString());
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
      if (filters.offset !== undefined) params = params.set('offset', filters.offset.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(id: number, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, productData);
  }

  loadProducts(filters?: ProductFilters): void {
    this.getProducts(filters).subscribe({
      next: (products) => {
        this.productsSubject.next(products);
        this.loadingSubject.next(false);
        // Fetch total count for pagination
        this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe({
          next: (allProducts) => {
            this.paginationSubject.next({
              offset: filters?.offset || 0,
              limit: filters?.limit || 10,
              total: allProducts.length
            });
          },
          error: () => {
            // fallback: use current page length if total can't be fetched
            this.paginationSubject.next({
              offset: filters?.offset || 0,
              limit: filters?.limit || 10,
              total: products.length
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loadingSubject.next(false);
        this.productsSubject.next([]);
      }
    });
  }

  searchProducts(query: string): void {
    if (query.trim()) {
      this.loadProducts({ title: query });
    } else {
      this.loadProducts();
    }
  }

  filterByPrice(minPrice?: number, maxPrice?: number): void {
    const filters: ProductFilters = {};
    if (minPrice !== undefined) filters.price_min = minPrice;
    if (maxPrice !== undefined) filters.price_max = maxPrice;
    this.loadProducts(filters);
  }

  filterByCategory(categoryId: number): void {
    this.loadProducts({ categoryId });
  }

  sortByPrice(ascending: boolean = true): void {
    const currentProducts = this.productsSubject.value;
    const sortedProducts = [...currentProducts].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price;
    });
    this.productsSubject.next(sortedProducts);
  }

  getProductsWithPagination(offset: number, limit: number): void {
    this.loadProducts({ offset, limit });
  }
} 