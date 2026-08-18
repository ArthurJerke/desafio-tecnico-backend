import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NoticiasModule } from './noticias/noticias.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60_000,
    }),
    ConfigModule.forRoot(),
    NoticiasModule,
    PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
