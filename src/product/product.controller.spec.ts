import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              { id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 },
              { id: 2, name: 'Product 2', description: 'Description 2', price: 199.99 },
            ]),
            findOne: jest.fn().mockResolvedValue({
              id: 1, name: 'Product 1', description: 'Description 1', price: 99.99
            }),
            create: jest.fn().mockResolvedValue({
              id: 1, name: 'New Product', description: 'New Description', price: 299.99
            }),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await productController.findAll();
      expect(result).toEqual([
        { id: 1, name: 'Product 1', description: 'Description 1', price: 99.99 },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 199.99 },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single product by id', async () => {
      const result = await productController.findOne(1);
      expect(result).toEqual({
        id: 1, name: 'Product 1', description: 'Description 1', price: 99.99
      });
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const newProduct = { name: 'New Product', description: 'New Description', price: 299.99 };
      const result = await productController.create(newProduct);
      expect(result).toEqual({
        id: 1, name: 'New Product', description: 'New Description', price: 299.99
      });
    });
  });
});
