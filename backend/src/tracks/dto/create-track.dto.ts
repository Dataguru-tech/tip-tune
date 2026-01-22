import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Genre {
  ROCK = 'rock',
  POP = 'pop',
  JAZZ = 'jazz',
  CLASSICAL = 'classical',
  ELECTRONIC = 'electronic',
  HIP_HOP = 'hip-hop',
  COUNTRY = 'country',
  R_B = 'r-b',
  METAL = 'metal',
  INDIE = 'indie',
  OTHER = 'other',
}

export class CreateTrackDto {
  @ApiProperty({
    description: 'Track title',
    example: 'My Awesome Track',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Artist name',
    example: 'John Doe',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  artist?: string;

  @ApiPropertyOptional({
    description: 'Track description',
    example: 'A great track about life',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Track genre',
    enum: Genre,
    example: Genre.ROCK,
  })
  @IsOptional()
  @IsEnum(Genre)
  genre?: string;

  @ApiPropertyOptional({
    description: 'Album name',
    example: 'My First Album',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  album?: string;

  @ApiPropertyOptional({
    description: 'Track duration in seconds',
    example: 180,
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Whether the track is public',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
