# Environment Setup Guide

## Backend (.env file)

Create a `.env` file in the backend directory with:

```env
# Database Configuration
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
DB_SERVER=your_mongodb_cluster_url
DB_DATABASE=laptop_ecommerce

# JWT Configuration
JWT_SECRET=laptop-ecommerce-jwt-secret-key-2025-very-long-and-secure

# Server Configuration
PORT=3001

# Cloudinary Configuration (for image upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# VNPay Configuration (for payment)
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Frontend (.env.local file)

Create a `.env.local` file in the frontend directory with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# VNPay Configuration (same as backend)
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
```

## Quick Setup for Development

For development, you can use these test values:

```env
# Backend .env
DB_USER=testuser
DB_PASS=testpass123
DB_SERVER=cluster0.mongodb.net
DB_DATABASE=laptop_ecommerce_dev
JWT_SECRET=laptop-ecommerce-jwt-secret-key-2025-very-long-and-secure-development
PORT=3001
```

```env
# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
``` 