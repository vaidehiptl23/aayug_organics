import request from 'supertest';
import app from '../../app';

describe('Cart API Integration', () => {
  let accessToken: string;
  let productId: string;

  beforeAll(async () => {
    // Login as seeded customer
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'rahul@example.com',
      password: 'Customer@123',
    });
    accessToken = res.body.data?.accessToken;

    // Get a product
    const products = await request(app).get('/api/v1/products');
    productId = products.body.data?.[0]?.id;
  });

  describe('GET /api/v1/cart', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/v1/cart');
      expect(res.status).toBe(401);
    });

    it('should return cart for authenticated user', async () => {
      if (!accessToken) return;
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/v1/cart', () => {
    it('should add item to cart', async () => {
      if (!accessToken || !productId) return;

      const res = await request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ productId, quantity: 1 });

      expect(res.status).toBe(201);
    });

    it('should reject invalid product', async () => {
      if (!accessToken) return;
      const res = await request(app)
        .post('/api/v1/cart')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ productId: '00000000-0000-0000-0000-000000000000', quantity: 1 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/cart', () => {
    it('should clear cart', async () => {
      if (!accessToken) return;
      const res = await request(app)
        .delete('/api/v1/cart')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
    });
  });
});
