import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { CompaniesModule } from './companies/companies.module';
import { CitiesModule } from './cities/cities.module';
import { DistrictsModule } from './districts/districts.module';
import { ActiveFieldsModule } from './active-fields/active-fields.module';
import mongooseDelete from 'mongoose-delete';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(mongooseDelete, { overrideMethods: 'all' });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CaslModule,
    CompaniesModule,
    CitiesModule,
    DistrictsModule,
    ActiveFieldsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
