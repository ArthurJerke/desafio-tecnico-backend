import { IsNotEmpty, IsString } from 'class-validator';

export class EditarNoticiaDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;
}