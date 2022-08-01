import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async createProduct(
    sellerId: number,
    createProductDto: CreateProductDto,
  ): Promise<ReadProductDto> {
    const seller = new User();
    seller.id = sellerId;
    const product = new Product();
    product.amountAvailable = createProductDto.amountAvailable;
    product.cost = createProductDto.cost;
    product.productName = createProductDto.productName;
    product.seller = seller;
    await this.productsRepository.save(product);

    return {
      id: product.id,
      amountAvailable: product.amountAvailable,
      cost: product.cost,
      productName: product.productName,
    };
  }

  async getProduct(id: number): Promise<ReadProductDto> {
    const product = await this.validateAndGetEntity(id);

    return {
      id: product.id,
      amountAvailable: product.amountAvailable,
      cost: product.cost,
      productName: product.productName,
    };
  }

  async updateProduct(
    sellerId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ReadProductDto> {
    const product = await this.validateAndGetEntity(
      sellerId,
      updateProductDto.id,
    );

    return {
      id: product.id,
      amountAvailable: product.amountAvailable,
      cost: product.cost,
      productName: product.productName,
    };
  }

  async deleteProduct(sellerId: number, productId: number): Promise<void> {
    const product = await this.validateAndGetEntity(sellerId, productId);
    await this.productsRepository.remove(product);
  }

  private async validateAndGetEntity(
    productId: number,
    sellerId?: number,
  ): Promise<Product> {
    const filter =
      sellerId != null
        ? { seller: { id: sellerId }, id: productId }
        : { id: productId };

    const product = await this.productsRepository.findOneBy(filter);

    if (product == null) {
      throw new NotFoundException();
    }

    return product;
  }
}
