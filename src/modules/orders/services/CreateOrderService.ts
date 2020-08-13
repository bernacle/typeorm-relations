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
      throw new AppError('Customer does not exist', 404);
    }
    await this.productsRepository.updateQuantity(products);

    const fullProducts = await this.productsRepository.findAllById(products);
    const formattedProducts = fullProducts.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: product.price,
    }));

    const orderDTO = {
      customer,
      products: formattedProducts,
    } as ICreateOrderDTO;

    const order = await this.ordersRepository.create(orderDTO);

    return order;
  }
}

export default CreateOrderService;
