import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NoticiasModule } from './noticias/noticias.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule.forRoot(), NoticiasModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
