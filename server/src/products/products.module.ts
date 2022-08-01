import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { VendingMachineController } from './vending-machine.controller';
import { VendingMachineService } from './vending-machine.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, UsersModule],
  providers: [ProductsService, VendingMachineService],
  controllers: [ProductsController, VendingMachineController],
})
export class ProductsModule {}
