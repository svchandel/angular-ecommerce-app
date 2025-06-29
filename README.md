# E-Commerce Store - Angular Application

A modern, responsive e-commerce website built with Angular 18, featuring product listings, shopping cart functionality, user authentication, and a complete checkout process.

## 🚀 Features

### Core Functionality
- **Product Listing**: Display products with images, names, and prices
- **Product Details**: Detailed product view with image gallery and variant selection
- **Shopping Cart**: Add, update, and remove items with persistent storage
- **User Authentication**: Login/Register with JWT token management
- **Checkout Process**: Protected checkout with form validation
- **Responsive Design**: Mobile-first design using Bootstrap

### Technical Features
- **Angular 18**: Latest Angular framework with standalone components
- **Reactive Forms**: Form validation and handling with FormArrays
- **HTTP Interceptors**: Automatic JWT token management
- **Route Guards**: Protected routes for authenticated users
- **State Management**: Service-based state management
- **API Integration**: REST API integration with error handling
- **Local Storage**: Cart persistence across sessions

### Admin Features
- **Product Management**: Edit product details (title, price, description)
- **Image Management**: Add, remove, and update product images via URLs
- **Real-time Updates**: Update products directly from the product detail page
- **Admin Access Control**: Admin-only functionality with role-based permissions

## 🛠️ Technologies Used

- **Frontend**: Angular 18, TypeScript, HTML5, CSS3
- **UI Framework**: Bootstrap 5, Bootstrap Icons
- **State Management**: RxJS Observables and BehaviorSubjects
- **HTTP Client**: Angular HttpClient with interceptors
- **Forms**: Angular Reactive Forms with validation
- **Routing**: Angular Router with guards

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Angular CLI** (version 18 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200/`

### 4. Build for Production
```bash
ng build
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Navigation header
│   │   ├── product-list/     # Product listing page
│   │   ├── product-detail/   # Product detail page
│   │   ├── cart/            # Shopping cart
│   │   ├── login/           # User login
│   │   ├── register/        # User registration
│   │   └── checkout/        # Checkout process
│   ├── services/
│   │   ├── product.service.ts    # Product API operations
│   │   ├── cart.service.ts       # Cart state management
│   │   └── auth.service.ts       # Authentication operations
│   ├── models/
│   │   ├── product.model.ts      # Product interfaces
│   │   └── user.model.ts         # User interfaces
│   ├── guards/
│   │   └── auth.guard.ts         # Route protection
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # JWT token interceptor
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.css
└── main.ts
```

## 🔧 Configuration

### API Configuration
The application uses the following API endpoints:

- **Base URL**: `https://api.escuelajs.co/api/v1`
- **Products**: `/products`
- **Authentication**: `/auth/login`, `/auth/profile`
- **Users**: `/users`

### Environment Variables
Create an `environment.ts` file in `src/environments/` if you need to customize API endpoints:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api.escuelajs.co/api/v1'
};
```

## 🎯 Key Features Explained

### 1. Product Listing
- Fetches products from API with pagination
- Implements filtering by title, price range, and category
- Sorting functionality (price low to high, high to low)
- Responsive grid layout

### 2. Product Details
- Dynamic form arrays for product variants (size, color)
- Image gallery with thumbnail navigation
- Quantity selection with validation
- Add to cart functionality

### 3. Shopping Cart
- Persistent cart storage using localStorage
- Real-time cart updates
- Quantity modification and item removal
- Cart total calculation with tax

### 4. Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes with guards
- User profile management

### 5. Checkout Process
- Multi-step checkout form
- Form validation with error messages
- Order summary with tax calculation
- Protected checkout (requires authentication)

### 6. Admin Features
- Role-based access control
- Product editing interface
- Image URL management
- Real-time form validation
- API integration for updates

## 🔐 Authentication

### Demo Credentials
For testing purposes, you can use these demo credentials:

**User Account:**
- **Email**: john@mail.com
- **Password**: changeme

**Admin Account:**
- **Email**: admin@mail.com  
- **Password**: admin123

### User Registration
- Email availability checking
- Password confirmation validation
- Automatic avatar generation

## 🎨 Styling

The application uses:
- **Bootstrap 5** for responsive layout and components
- **Bootstrap Icons** for consistent iconography
- **Custom CSS variables** for theming
- **CSS Grid/Flexbox** for responsive design

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

Key responsive features:
- Mobile-first approach
- Collapsible navigation
- Responsive product grid
- Touch-friendly interface

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Deploy to Static Hosting
The built application can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

## 📝 API Documentation

The application integrates with the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh-token` - Refresh JWT token

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `GET /products?title=...` - Filter by title
- `GET /products?price_min=...&price_max=...` - Filter by price range

### Users
- `POST /users` - Create new user
- `POST /users/is-available` - Check email availability
- `GET /users` - Get all users
- `GET /users/:id` - Get single user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for errors
2. Verify API connectivity
3. Ensure all dependencies are installed
4. Check the Angular CLI version compatibility

## 🔄 Updates

To update the application:

```bash
npm update
ng update @angular/core @angular/cli
```

---

**Note**: This is a demonstration application. For production use, implement proper security measures, error handling, and data validation.
