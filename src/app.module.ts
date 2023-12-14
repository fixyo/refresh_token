import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'refresh_token',
      host: 'localhost',
      username: 'root',
      password: '111111',
      port: 3306,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      synchronize: true,
      logging: true,
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    JwtModule.register({
      global: true,
      secret: 'ec',
      signOptions: {
        expiresIn: '30m',
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
