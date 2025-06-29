import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  loading = false;
  orderPlaced = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if cart is empty
    if (this.cartService.isCartEmpty()) {
      this.router.navigate(['/cart']);
      return;
    }

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });

    // Pre-fill form with user data
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.checkoutForm.patchValue({
        email: currentUser.email,
        firstName: currentUser.name.split(' ')[0] || '',
        lastName: currentUser.name.split(' ').slice(1).join(' ') || ''
      });
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      
      // Simulate order processing
      setTimeout(() => {
        this.loading = false;
        this.orderPlaced = true;
        this.cartService.clearCart();
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        switch (controlName) {
          case 'cardNumber':
            return 'Please enter a valid 16-digit card number';
          case 'expiryDate':
            return 'Please enter a valid expiry date (MM/YY)';
          case 'cvv':
            return 'Please enter a valid CVV';
          default:
            return 'Please enter a valid value';
        }
      }
    }
    return '';
  }

  getCartTotalWithTax(taxRate: number = 0.1): number {
    return this.cartService.getCartTotalWithTax(taxRate);
  }

  getTaxAmount(taxRate: number = 0.1): number {
    return this.cartTotal * taxRate;
  }

  getShippingCost(): number {
    return this.cartTotal > 100 ? 0 : 10;
  }

  getFinalTotal(): number {
    return this.getCartTotalWithTax() + this.getShippingCost();
  }
}
