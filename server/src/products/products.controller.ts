import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { SellerGuard } from 'src/auth/seller.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ReadProductDto } from './dto/read-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  getAll(): Promise<ReadProductDto[]> {
    return this.productsService.getAll();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  get(@Param('id') id: number): Promise<ReadProductDto> {
    return this.productsService.getProduct(id);
  }

  @Post('create')
  @UseGuards(AuthGuard(), SellerGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: JwtPayload,
  ): Promise<ReadProductDto> {
    return this.productsService.createProduct(user.id, createProductDto);
  }

  @Put('update')
  @UseGuards(AuthGuard(), SellerGuard)
  update(
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: JwtPayload,
  ): Promise<ReadProductDto> {
    return this.productsService.updateProduct(user.id, updateProductDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), SellerGuard)
  delete(@Param('id') id: number, @GetUser() user: JwtPayload): Promise<void> {
    return this.productsService.deleteProduct(user.id, id);
  }
}
