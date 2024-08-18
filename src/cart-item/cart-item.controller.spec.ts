import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartItem } from '@prisma/client';

describe('CartItemController', () => {
  let controller: CartItemController;
  let service: CartItemService;

  const mockCartItemService = {
    addItem: jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    removeItem: jest.fn().mockResolvedValue(undefined),
    updateQuantity: jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      productId: 1,
      quantity: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    getCartItems: jest.fn().mockResolvedValue([
      {
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        { provide: CartItemService, useValue: mockCartItemService },
      ],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
    service = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItem', () => {
    it('should add a new item to the cart', async () => {
      const result = await controller.addItem(1, 1, 2);
      expect(result).toEqual({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 2,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.addItem).toHaveBeenCalledWith(1, 1, 2);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the cart', async () => {
      await controller.removeItem(1);
      expect(service.removeItem).toHaveBeenCalledWith(1);
    });
  });

  describe('updateQuantity', () => {
    it('should update the quantity of an item in the cart', async () => {
      const result = await controller.updateQuantity(1, 3);
      expect(result).toEqual({
        id: 1,
        userId: 1,
        productId: 1,
        quantity: 3,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(service.updateQuantity).toHaveBeenCalledWith(1, 3);
    });
  });

  describe('getCartItems', () => {
    it('should return all items in the cart for a user', async () => {
      const result = await controller.getCartItems(1);
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
      expect(service.getCartItems).toHaveBeenCalledWith(1);
    });
  });
});
