import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async getAll(): Promise<ReadProductDto[]> {
    const products = await this.productsRepository.find();

    return products.map(
      (p) => new ReadProductDto(p.id, p.amountAvailable, p.cost, p.productName),
    );
  }

  async getAllFrom(sellerId: number): Promise<ReadProductDto[]> {
    const products = await this.productsRepository.findBy({
      seller: { id: sellerId },
    });

    return products.map(
      (p) => new ReadProductDto(p.id, p.amountAvailable, p.cost, p.productName),
    );
  }

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
      updateProductDto.id,
      sellerId,
    );

    product.productName = updateProductDto.productName;
    product.amountAvailable = updateProductDto.amountAvailable;
    product.cost = updateProductDto.cost;

    await this.productsRepository.save(product);

    return {
      id: product.id,
      amountAvailable: product.amountAvailable,
      cost: product.cost,
      productName: product.productName,
    };
  }

  async deleteProduct(sellerId: number, productId: number): Promise<void> {
    const product = await this.validateAndGetEntity(productId, sellerId);
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
