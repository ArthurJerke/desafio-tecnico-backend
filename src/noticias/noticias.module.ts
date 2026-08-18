import { Module } from '@nestjs/common';
import { NoticiasController } from './noticias.controller.js';
import { NoticiasService } from './noticias.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [NoticiasController],
  providers: [NoticiasService]
})
export class NoticiasModule { }
