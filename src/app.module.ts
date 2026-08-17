import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticiasModule } from './noticias/noticias.module';

@Module({
  imports: [NoticiasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
