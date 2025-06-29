import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  cartItemCount = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  updateQuantity(index: number, newQuantity: number): void {
    this.cartService.updateQuantity(index, newQuantity);
  }

  onQuantityChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);
    if (!isNaN(newQuantity)) {
      this.updateQuantity(index, newQuantity);
    }
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getCartTotalWithTax(taxRate: number = 0.1): number {
    return this.cartService.getCartTotalWithTax(taxRate);
  }

  getTaxAmount(taxRate: number = 0.1): number {
    return this.cartTotal * taxRate;
  }

  isCartEmpty(): boolean {
    return this.cartService.isCartEmpty();
  }
}
