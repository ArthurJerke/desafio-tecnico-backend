import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarNoticiaDto } from './dto/criar-noticia.dto.js';
import { EditarNoticiaDto } from './dto/editar-noticia.dto.js';
import { FiltroListaNoticiasDto } from './dto/filtro-lista-noticias-dto.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class NoticiasService {
    constructor(
        private readonly prisma: PrismaService,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) { }

    criarNoticia(data: CriarNoticiaDto) {
        return this.prisma.noticia.create({ data })
    }

    async listarNoticias(filtro: FiltroListaNoticiasDto) {
        const titulo = filtro.titulo?.trim() ? filtro.titulo.trim() : undefined;

        const descricao = filtro.descricao?.trim() ? filtro.descricao.trim() : undefined;

        const pagina = filtro.pagina ?? 1;
        const limite = filtro.limite ?? 10;

        const cacheKey = `noticias:${titulo ?? ''}:${descricao ?? ''}:${pagina}:${limite}`;

        const cached = await this.cacheManager.get(cacheKey);

        if (cached) {
            return cached;
        }

        const where = {
            titulo: titulo
                ? {
                    contains: titulo,
                    mode: 'insensitive' as const,
                }
                : undefined,

            descricao: descricao
                ? {
                    contains: descricao,
                    mode: 'insensitive' as const,
                }
                : undefined,
        };

        const skip = (pagina - 1) * limite;

        const [noticias, total] = await Promise.all([
            this.prisma.noticia.findMany({
                where,
                orderBy: {
                    id: 'desc',
                },
                skip,
                take: limite,
            }),

            this.prisma.noticia.count({
                where,
            }),
        ]);

        const resultado = {
            data: noticias,
            meta: {
                total,
                pagina,
                limite,
                totalPaginas: Math.ceil(total / limite),
            },
        };

        await this.cacheManager.set(cacheKey, resultado);

        return resultado;
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