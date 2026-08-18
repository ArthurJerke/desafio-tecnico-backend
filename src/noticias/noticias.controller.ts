import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { NoticiasService } from './noticias.service.js';
import { CriarNoticiaDto } from './dto/criar-noticia.dto.js';
import { EditarNoticiaDto } from './dto/editar-noticia.dto.js';
import { FiltroListaNoticiasDto } from './dto/filtro-lista-noticias-dto.js';

@Controller('noticias')
export class NoticiasController {

    constructor(private readonly noticiasService: NoticiasService) { }

    @Post()
    criarNoticia(@Body() criarNoticiaDto: CriarNoticiaDto) {
        return this.noticiasService.criarNoticia(criarNoticiaDto);
    }

    @Get()
    listarNoticias(@Query() filtro: FiltroListaNoticiasDto) {
        return this.noticiasService.listarNoticias(filtro);
    }

    @Get(':id')
    buscarNoticia(@Param('id', ParseIntPipe) id: number) {
        return this.noticiasService.buscarNoticia(id);
    }

    @Put(':id')
    editarNoticia(@Param('id', ParseIntPipe) id: number, @Body() editarNoticiaDto: EditarNoticiaDto) {
        return this.noticiasService.editarNoticia(id, editarNoticiaDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async excluirNoticia(@Param('id', ParseIntPipe) id: number) {
        await this.noticiasService.excluirNoticia(id);
    }
}