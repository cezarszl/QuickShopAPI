import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              findMany: jest.fn().mockResolvedValue([
                { id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 },
                { id: 2, name: 'Product 2', description: 'Description 2', price: 199.99 },
              ]),
              findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 }),
              create: jest.fn().mockResolvedValue({ id: 3, name: 'New Product', description: 'New Description', price: 299.99 }),
              delete: jest.fn().mockResolvedValue({ id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 }),
              update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Product', description: 'Updated Description', price: 199.99 }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = await service.findAll();
      expect(products).toEqual([
        { id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 199.99 },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const product = await service.findOne(1);
      expect(product).toEqual({
        id: 1, name: 'Product 1', description: 'Description 1', price: 99.99
      });
    });

    it('should handle product not found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow('Product with ID 999 not found');
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const newProduct = { name: 'New Product', description: 'New Description', imageUrl: 'url', price: 299.99 };
      const result = await service.create(newProduct);
      expect(result).toEqual({
        id: 3, name: 'New Product', description: 'New Description', price: 299.99
      });
    });
  });

  describe('delete', () => {
    it('should remove a product by id', async () => {
      await service.delete(1);
      expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle product not found', async () => {
      (prisma.product.delete as jest.Mock).mockRejectedValue(new Error('Product not found'));
      await expect(service.delete(999)).rejects.toThrow('Product with ID 999 not found');
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const updatedData = { name: 'Updated Product', description: 'Updated Description', price: 199.99 };
      const result = await service.update(1, updatedData);
      expect(result).toEqual({
        id: 1, name: 'Updated Product', description: 'Updated Description', price: 199.99
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
    });

    it('should handle product not found during update', async () => {
      (prisma.product.update as jest.Mock).mockRejectedValue(new Error('Product not found'));
      await expect(service.update(999, { name: 'Updated Product' })).rejects.toThrow('Product with ID 999 not found');
    });
  });
});
