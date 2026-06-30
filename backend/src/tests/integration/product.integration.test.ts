import request from 'supertest';
import app from '../../app';

describe('Product API Integration', () => {
  describe('GET /api/v1/products', () => {
    it('should return products list', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await request(app).get('/api/v1/products?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.limit).toBe(5);
    });

    it('should support category filter', async () => {
      const res = await request(app).get('/api/v1/products?category=ghee');
      expect(res.status).toBe(200);
    });

    it('should support search', async () => {
      const res = await request(app).get('/api/v1/products?search=ghee');
      expect(res.status).toBe(200);
    });

    it('should support price sorting', async () => {
      const res = await request(app).get('/api/v1/products?sort=price_asc');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/products/:id', () => {
    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/v1/products/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/categories', () => {
    it('should return categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
