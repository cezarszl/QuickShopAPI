import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { PrismaService } from '../prisma.service';
import { CartItem } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('CartItemService', () => {
  let service: CartItemService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: PrismaService,
          useValue: {
            cartItem: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              delete: jest.fn().mockResolvedValue({
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
              findMany: jest.fn().mockResolvedValue([
                {
                  id: 1,
                  userId: 1,
                  productId: 1,
                  quantity: 2,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', async () => {
      const result = await service.addItem(1, 1, 2);
      expect(result).toEqual({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          productId: 1,
          quantity: 2,
        },
      });
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      const result = await service.removeItem(1);
      expect(result).toBeUndefined();
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(prisma.cartItem, 'delete').mockRejectedValue(new Error('Item not found'));
      await expect(service.removeItem(999)).rejects.toThrow('CartItem with ID 999 not found');
    });
  });

  describe('updateQuantity', () => {
    it('should update the quantity of an item in the cart', async () => {
      const result = await service.updateQuantity(1, 3);
      expect(result).toEqual({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 3,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 3 },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      jest.spyOn(prisma.cartItem, 'update').mockRejectedValue(new Error('Item not found'));
      await expect(service.updateQuantity(999, 3)).rejects.toThrow('CartItem with ID 999 not found');
    });
  });

  describe('getCartItems', () => {
    it('should return all items in the cart for a user', async () => {
      const result = await service.getCartItems(1);
      expect(result).toEqual([
        {
          id: 1,
          userId: 1,
          productId: 1,
          quantity: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });
  });
});
