import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ReadUserDto } from '../users/dto/read-user.dto';
import { UpdateUserCredentialsDto } from '../users/dto/update-user-credentials.dto';
import { HashingService } from '../users/hashing.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { Login } from './login.entity';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashingService: HashingService,
    private jwtService: JwtService,
    @InjectRepository(Login) private loginRepository: Repository<Login>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private dataSource: DataSource,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return await this.usersService.create(createUserDto);
  }

  async signIn(
    credentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.getByUsername(credentials.username);

    if (
      user &&
      (await this.hashingService.verify(
        credentials.plainPassword,
        user.password,
      ))
    ) {
      const payload: JwtPayload = {
        id: user.id,
        role: user.role,
      };

      const { accessToken } = await this.signToken(payload);
      const { refreshToken } = await this.createLogin(user.id);

      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException('Incorrect username or password');
  }

  async signToken(payload: JwtPayload) {
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  private async createLogin(userId: number): Promise<{ refreshToken: string }> {
    try {
      // eslint-disable-next-line no-var
      var queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = new User();
      user.id = userId;

      const login = new Login();
      login.user = user;
      login.lastRefreshDate = new Date();
      await queryRunner.manager.getRepository(Login).save(login);

      const { refreshToken, refreshJwt } = await this.generateRefreshToken(
        userId,
        login.id,
      );

      queryRunner.manager.getRepository(RefreshToken).save(refreshToken);

      await queryRunner.commitTransaction();

      return { refreshToken: refreshJwt };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async revokeToken(refreshToken: string): Promise<void> {
    const token = await this.refreshTokenRepository.findOneBy({
      token: refreshToken,
    });
    await this.loginRepository.delete({ id: token.login.id });
  }

  async revokeAllForUser(userId: number) {
    await this.loginRepository
      .createQueryBuilder('login')
      .delete()
      .where('login.userId = :userId', { userId })
      .execute();
  }

  async refreshTokens(
    refreshJwt: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      this.jwtService.verify(refreshJwt);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const tokenFromDb = await this.refreshTokenRepository.findOneBy({
      token: refreshJwt,
    });

    if (tokenFromDb == null) {
      throw new UnauthorizedException();
    }

    const refreshJwtPayload = this.jwtService.decode(refreshJwt);
    const userId = refreshJwtPayload['userId'];
    const loginId = refreshJwtPayload['loginId'];

    if (!tokenFromDb.isActive || tokenFromDb.validUntil < new Date()) {
      await this.loginRepository.delete({ id: loginId });
      throw new UnauthorizedException();
    }

    try {
      // eslint-disable-next-line no-var
      var queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      tokenFromDb.isActive = false;
      tokenFromDb.login.lastRefreshDate = new Date();

      const { refreshToken: newRefreshToken, refreshJwt: newRefreshJwt } =
        await this.generateRefreshToken(userId, loginId);

      const refreshTokenRepo = queryRunner.manager.getRepository(RefreshToken);
      await refreshTokenRepo.save(tokenFromDb);
      await refreshTokenRepo.save(newRefreshToken);

      const user = await queryRunner.manager
        .getRepository(User)
        .findOneBy({ id: userId });

      await queryRunner.commitTransaction();

      const { accessToken } = await this.signToken({
        id: user.id,
        role: user.role,
      });

      return { accessToken, refreshToken: newRefreshJwt };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      queryRunner.release();
    }
  }

  async updateCredentials(
    loggedInUserId: number,
    credentials: UpdateUserCredentialsDto,
  ): Promise<ReadUserDto> {
    return await this.usersService.updateCredentials(
      loggedInUserId,
      credentials,
    );
  }

  async deleteUser(loggedInUserId: number): Promise<void> {
    return await this.usersService.delete(loggedInUserId);
  }

  private async generateRefreshToken(
    userId: number,
    loginId: number,
  ): Promise<{ refreshToken: RefreshToken; refreshJwt: string }> {
    const refreshJwt = await this.jwtService.sign(
      { userId, loginId },
      { expiresIn: '2 days' },
    );

    const login = new Login();
    login.id = loginId;

    const refreshToken = new RefreshToken();
    refreshToken.token = refreshJwt;
    refreshToken.isActive = true;
    refreshToken.login = login;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 2);

    refreshToken.validUntil = validUntil;
    return { refreshToken, refreshJwt };
  }
}
