import { Test, TestingModule } from '@nestjs/testing';
import { NoticiasService } from './noticias.service.js';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service.js';
import { jest } from '@jest/globals';

describe('NoticiasService', () => {
  let service: NoticiasService;

  const prismaMock = {
    noticia: {
      create: jest.fn<() => Promise<any>>(),
      findMany: jest.fn<() => Promise<any>>(),
      findUnique: jest.fn<() => Promise<any>>(),
      count: jest.fn<() => Promise<any>>(),
      update: jest.fn<() => Promise<any>>(),
      delete: jest.fn<() => Promise<any>>(),
    },
  };

  const cacheMock = {
    get: jest.fn<() => Promise<any>>(),
    set: jest.fn<() => Promise<any>>(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticiasService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheMock,
        },
      ],
    }).compile();

    service = module.get<NoticiasService>(NoticiasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarNoticia', () => {
    it('deve criar uma notícia', async () => {
      const dados = {
        titulo: 'Notícia de teste',
        descricao: 'Descrição da notícia',
      };

      const noticiaCriada = {
        id: 1,
        ...dados,
      };

      prismaMock.noticia.create.mockResolvedValue(noticiaCriada);

      const resultado = await service.criarNoticia(dados);

      expect(resultado).toEqual(noticiaCriada);

      expect(prismaMock.noticia.create).toHaveBeenCalledWith({
        data: dados,
      });
    });
  });

  describe('buscarNoticia', () => {
    it('deve retornar uma notícia existente', async () => {
      const noticia = {
        id: 1,
        titulo: 'Notícia de teste',
        descricao: 'Descrição',
      };

      prismaMock.noticia.findUnique.mockResolvedValue(noticia);

      const resultado = await service.buscarNoticia(1);

      expect(resultado).toEqual(noticia);

      expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar NotFoundException quando a notícia não existir', async () => {
      prismaMock.noticia.findUnique.mockResolvedValue(null);

      await expect(
        service.buscarNoticia(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listarNoticias', () => {
    it('deve listar notícias com paginação', async () => {
      const noticias = [
        {
          id: 2,
          titulo: 'Notícia 2',
          descricao: 'Descrição 2',
        },
        {
          id: 1,
          titulo: 'Notícia 1',
          descricao: 'Descrição 1',
        },
      ];

      prismaMock.noticia.findMany.mockResolvedValue(noticias);
      prismaMock.noticia.count.mockResolvedValue(12);
      cacheMock.get.mockResolvedValue(undefined);

      const resultado = await service.listarNoticias({
        pagina: 2,
        limite: 5,
      });

      expect(resultado).toEqual({
        data: noticias,
        meta: {
          total: 12,
          pagina: 2,
          limite: 5,
          totalPaginas: 3,
        },
      });

      expect(prismaMock.noticia.findMany).toHaveBeenCalledWith({
        where: {
          titulo: undefined,
          descricao: undefined,
        },
        orderBy: {
          id: 'desc',
        },
        skip: 5,
        take: 5,
      });

      expect(prismaMock.noticia.count).toHaveBeenCalledWith({
        where: {
          titulo: undefined,
          descricao: undefined,
        },
      });
    });

    it('deve retornar o resultado do cache quando existir', async () => {
      const resultadoCache = {
        data: [
          {
            id: 1,
            titulo: 'Notícia em cache',
            descricao: 'Descrição',
          },
        ],
        meta: {
          total: 1,
          pagina: 1,
          limite: 10,
          totalPaginas: 1,
        },
      };

      cacheMock.get.mockResolvedValue(resultadoCache);

      const resultado = await service.listarNoticias({});

      expect(resultado).toEqual(resultadoCache);

      expect(cacheMock.get).toHaveBeenCalledWith(
        'noticias:::1:10',
      );

      expect(prismaMock.noticia.findMany).not.toHaveBeenCalled();
      expect(prismaMock.noticia.count).not.toHaveBeenCalled();
    });
  });

  describe('editarNoticia', () => {
    it('deve editar uma notícia existente', async () => {
      const noticia = {
        id: 1,
        titulo: 'Título antigo',
        descricao: 'Descrição antiga',
      };

      const dto = {
        titulo: 'Título novo',
        descricao: 'Descrição nova',
      };

      prismaMock.noticia.findUnique.mockResolvedValue(noticia);

      const noticiaAtualizada = {
        id: 1,
        ...dto,
      };

      prismaMock.noticia.update.mockResolvedValue(noticiaAtualizada);

      const resultado = await service.editarNoticia(1, dto);

      expect(resultado).toEqual(noticiaAtualizada);

      expect(prismaMock.noticia.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          titulo: dto.titulo,
          descricao: dto.descricao,
        },
      });
    });
  });

  describe('excluirNoticia', () => {
    it('deve excluir uma notícia existente', async () => {
      const noticia = {
        id: 1,
        titulo: 'Notícia',
        descricao: 'Descrição',
      };

      prismaMock.noticia.findUnique.mockResolvedValue(noticia);
      prismaMock.noticia.delete.mockResolvedValue(noticia);

      await service.excluirNoticia(1);

      expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(prismaMock.noticia.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar NotFoundException ao tentar excluir notícia inexistente', async () => {
      prismaMock.noticia.findUnique.mockResolvedValue(null);

      await expect(
        service.excluirNoticia(999),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.noticia.delete).not.toHaveBeenCalled();
    });
  });
});
