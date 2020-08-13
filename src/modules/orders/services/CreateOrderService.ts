import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('Customer does not exist', 400);
    }

    const checkProducts = await this.productsRepository.findAllById(products);
    if (checkProducts.length !== products.length) {
      throw new AppError('Some products does not exist');
    }

    checkProducts.forEach((product, index) => {
      if (product.quantity < products[index].quantity) {
        throw new AppError('Product is out of stock');
      }
    });
    await this.productsRepository.updateQuantity(products);
    const formattedProducts = checkProducts.map((product, index) => ({
      product_id: product.id,
      quantity: products[index].quantity,
      price: product.price,
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: formattedProducts,
    });

    return order;
  }
}

export default CreateOrderService;
