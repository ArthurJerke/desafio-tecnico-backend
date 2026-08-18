import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltroListaNoticiasDto {
    @IsString()
    @IsOptional()
    titulo?: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @Type(() => Number)
    @IsOptional()
    pagina?: number;

    @Type(() => Number)
    @IsOptional()
    limite?: number;
}