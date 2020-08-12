import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import ListProductsService from '@modules/products/services/ListProductsService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { price, name, quantity } = request.body;
    const createProduct = container.resolve(CreateProductService);
    const product = await createProduct.execute({
      name,
      quantity,
      price,
    });

    return response.json(product);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const listProducts = container.resolve(ListProductsService);

    const products = await listProducts.execute();

    return response.json(products);
  }
}
