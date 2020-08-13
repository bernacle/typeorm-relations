import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import AppError from '@shared/errors/AppError';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
      customer_id: customer.id,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
    });

    await this.ormRepository.save(order);
    delete order.customer_id;

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      relations: ['order_products'],
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }
}

export default OrdersRepository;
