import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartItems: CartItem[] = [];

  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  addToCart(product: Product, quantity: number = 1, variants?: ProductVariant): void {
    const existingItemIndex = this.cartItems.findIndex(item => 
      item.product.id === product.id && 
      JSON.stringify(item.variants) === JSON.stringify(variants)
    );

    if (existingItemIndex > -1) {
      this.cartItems[existingItemIndex].quantity += quantity;
    } else {
      this.cartItems.push({
        product,
        quantity,
        variants
      });
    }

    this.cartItemsSubject.next(this.cartItems);
    this.saveCartToStorage();
  }

  removeFromCart(index: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      this.cartItems.splice(index, 1);
      this.cartItemsSubject.next(this.cartItems);
      this.saveCartToStorage();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    if (index >= 0 && index < this.cartItems.length) {
      if (quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.cartItems[index].quantity = quantity;
        this.cartItemsSubject.next(this.cartItems);
        this.saveCartToStorage();
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next(this.cartItems);
    localStorage.removeItem('cart');
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getCartTotalWithTax(taxRate: number = 0.1): number {
    const subtotal = this.getCartTotal();
    return subtotal + (subtotal * taxRate);
  }

  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }
} 