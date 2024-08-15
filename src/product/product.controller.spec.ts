import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Product 1', description: 'Description 1', imageUrl: 'url1', price: 99.99 },
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Product 1', description: 'Description 1', imageUrl: 'url1', price: 99.99 }),
    create: jest.fn().mockResolvedValue({ id: 2, name: 'New Product', description: 'New Description', imageUrl: 'url2', price: 199.99 }),
    update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Product', description: 'Updated Description', imageUrl: 'url1', price: 109.99 }),
    delete: jest.fn().mockResolvedValue({ id: 1, name: 'Product 1', description: 'Description 1', imageUrl: 'url1', price: 99.99 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Product 1', description: 'Description 1', imageUrl: 'url1', price: 99.99 },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({
        id: 1, name: 'Product 1', description: 'Description 1', imageUrl: 'url1', price: 99.99
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const createProductDto = { name: 'New Product', description: 'New Description', imageUrl: 'url2', price: 199.99 };
      const result = await controller.create(createProductDto);
      expect(result).toEqual({
        id: 2, name: 'New Product', description: 'New Description', imageUrl: 'url2', price: 199.99
      });
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const updateProductDto = { name: 'Updated Product', description: 'Updated Description', imageUrl: 'url1', price: 109.99 };
      const result = await controller.update(1, updateProductDto);
      expect(result).toEqual({
        id: 1, name: 'Updated Product', description: 'Updated Description', imageUrl: 'url1', price: 109.99
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);
      await expect(controller.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should remove a product by id', async () => {
      await controller.delete(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(null);
      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
