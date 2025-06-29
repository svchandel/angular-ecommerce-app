import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, ProductVariant } from '../../models/product.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  selectedImageIndex = 0;
  quantity = 1;
  currentUser: User | null = null;
  isAdmin = false;
  isEditing = false;
  updateLoading = false;
  
  // Message handling
  successMessage = '';
  errorMessage = '';
  
  // Form for product variants
  productForm: FormGroup;
  
  // Form for admin product updates
  adminForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      variants: this.fb.array([]),
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.adminForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      images: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin';
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.clearMessages();
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.initializeVariantsForm();
        this.initializeAdminForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.showError('Failed to load product details');
      }
    });
  }

  initializeVariantsForm(): void {
    if (!this.product) return;

    const variantsArray = this.productForm.get('variants') as FormArray;
    variantsArray.clear();

    // Add size variant if needed
    if (this.product.category.name.toLowerCase().includes('clothing')) {
      variantsArray.push(this.fb.group({
        size: ['', Validators.required],
        color: [''],
        quantity: [1, [Validators.required, Validators.min(1)]]
      }));
    } else {
      variantsArray.push(this.fb.group({
        quantity: [1, [Validators.required, Validators.min(1)]]
      }));
    }
  }

  initializeAdminForm(): void {
    if (!this.product) return;

    this.adminForm.patchValue({
      title: this.product.title,
      price: this.product.price,
      description: this.product.description
    });

    const imagesArray = this.adminForm.get('images') as FormArray;
    imagesArray.clear();
    
    this.product.images.forEach(image => {
      imagesArray.push(this.fb.control(image));
    });
  }

  get variantsArray(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  get imagesArray(): FormArray {
    return this.adminForm.get('images') as FormArray;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  addToCart(): void {
    if (!this.product || !this.productForm.valid) return;

    const formValue = this.productForm.value;
    const quantity = formValue.quantity || 1;
    
    let variants: ProductVariant | undefined;
    if (formValue.variants && formValue.variants.length > 0) {
      const variant = formValue.variants[0];
      variants = {
        size: variant.size,
        color: variant.color,
        quantity: variant.quantity
      };
    }

    this.cartService.addToCart(this.product, quantity, variants);
    this.showSuccess('Product added to cart successfully!');
  }

  increaseQuantity(): void {
    const quantityControl = this.productForm.get('quantity');
    if (quantityControl) {
      const currentValue = quantityControl.value || 1;
      quantityControl.setValue(currentValue + 1);
    }
  }

  decreaseQuantity(): void {
    const quantityControl = this.productForm.get('quantity');
    if (quantityControl) {
      const currentValue = quantityControl.value || 1;
      if (currentValue > 1) {
        quantityControl.setValue(currentValue - 1);
      }
    }
  }

  getSelectedImage(): string {
    if (!this.product || !this.product.images.length) {
      return 'https://via.placeholder.com/500x400';
    }
    return this.product.images[this.selectedImageIndex] || this.product.images[0];
  }

  // Admin functions
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.clearMessages();
    if (this.isEditing) {
      this.initializeAdminForm();
    }
  }

  addImageUrl(): void {
    this.imagesArray.push(this.fb.control(''));
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
  }

  onImageUrlChange(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.imagesArray.at(index).setValue(target.value);
  }

  updateProduct(): void {
    if (!this.product || !this.adminForm.valid) return;

    this.updateLoading = true;
    this.clearMessages();
    const updateData = this.adminForm.value;

    this.productService.updateProduct(this.product.id, updateData).subscribe({
      next: (updatedProduct) => {
        this.product = updatedProduct;
        this.isEditing = false;
        this.updateLoading = false;
        this.initializeVariantsForm();
        this.showSuccess('Product updated successfully!');
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.updateLoading = false;
        this.showError('Failed to update product. Please try again.');
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.clearMessages();
    this.initializeAdminForm();
  }

  // Message handling methods
  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
