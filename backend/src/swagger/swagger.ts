import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aayug Organics API',
      version: '1.0.0',
      description:
        'Production-ready REST API for Aayug Organics e-commerce platform. ' +
        'Provides endpoints for authentication, products, orders, payments, and more.',
      contact: {
        name: 'Aayug Organics',
        email: 'contact@aayugorganics.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Development server',
      },
      {
        url: `https://api.aayugorganics.com${env.API_PREFIX}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        PaginationMeta: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['CUSTOMER', 'ADMIN'] },
            isEmailVerified: { type: 'boolean' },
            profileImage: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            sku: { type: 'string' },
            brand: { type: 'string' },
            price: { type: 'number' },
            discountPrice: { type: 'number' },
            stockQuantity: { type: 'integer' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'] },
            avgRating: { type: 'number' },
            totalReviews: { type: 'integer' },
            images: { type: 'array', items: { $ref: '#/components/schemas/ProductImage' } },
            category: { $ref: '#/components/schemas/Category' },
          },
        },
        ProductImage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            url: { type: 'string' },
            isPrimary: { type: 'boolean' },
            altText: { type: 'string' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string' },
            status: { type: 'string' },
            subtotal: { type: 'number' },
            grandTotal: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication and authorization' },
      { name: 'Users', description: 'User profile and address management' },
      { name: 'Products', description: 'Product catalog and management' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Cart', description: 'Shopping cart operations' },
      { name: 'Wishlist', description: 'Wishlist management' },
      { name: 'Orders', description: 'Order management and checkout' },
      { name: 'Coupons', description: 'Discount coupons' },
      { name: 'Reviews', description: 'Product reviews and ratings' },
      { name: 'Dashboard', description: 'Admin dashboard and analytics' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
