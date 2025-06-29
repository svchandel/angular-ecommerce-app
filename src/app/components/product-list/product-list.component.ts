import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductFilters, PaginationInfo } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  pagination: PaginationInfo = { offset: 0, limit: 10, total: 0 };
  
  // Filters
  searchQuery = '';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  selectedCategory: number | undefined;
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 20;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    this.productService.products$.subscribe(products => {
      this.products = products;
    });

    this.productService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.productService.pagination$.subscribe(pagination => {
      this.pagination = pagination;
    });
  }

  loadProducts(): void {
    const filters: ProductFilters = {
      offset: (this.currentPage - 1) * this.itemsPerPage,
      limit: this.itemsPerPage
    };

    if (this.searchQuery) filters.title = this.searchQuery;
    if (this.minPrice !== undefined) filters.price_min = this.minPrice;
    if (this.maxPrice !== undefined) filters.price_max = this.maxPrice;
    if (this.selectedCategory) filters.categoryId = this.selectedCategory;

    this.productService.loadProducts(filters);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.productService.sortByPrice(this.sortOrder === 'asc');
  }

  onPageChange(page: number): void {
    // Prevent navigating to pages with no items
    const totalPages = this.getTotalPages();
    if (page < 1 || page > totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.pagination.total / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      // Only show page numbers that have items
      const startIdx = (i - 1) * this.itemsPerPage;
      if (this.pagination.total > startIdx) {
        pages.push(i);
      }
    }
    return pages;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedCategory = undefined;
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.loadProducts();
  }
}
