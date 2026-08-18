import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarNoticiaDto } from './dto/criar-noticia.dto.js';
import { EditarNoticiaDto } from './dto/editar-noticia.dto.js';

@Injectable()
export class NoticiasService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    criarNoticia(data: CriarNoticiaDto) {
        return this.prisma.noticia.create({ data })
    }

    listarNoticias() {
        return this.prisma.noticia.findMany();
    }

    async buscarNoticia(id: number) {
        const noticia = await this.prisma.noticia.findUnique({
            where: { id },
        });

        if (!noticia) {
            throw new NotFoundException('Notícia não encontrada');
        }

        return noticia;
    }

    async editarNoticia(id: number, dto: EditarNoticiaDto) {
        await this.buscarNoticia(id);

        return this.prisma.noticia.update({
            where: { id },
            data: {
                titulo: dto.titulo,
                descricao: dto.descricao,
            },
        });
    }

    async excluirNoticia(id: number) {
        await this.buscarNoticia(id);

        await this.prisma.noticia.delete({
            where: { id },
        });
    }
}