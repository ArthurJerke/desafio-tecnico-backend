import { IsNotEmpty, IsString } from 'class-validator';

export class CriarNoticiaDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;
}