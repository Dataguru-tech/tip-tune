import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new track with audio file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create track with audio file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Audio file (MP3, WAV, FLAC)',
        },
        title: {
          type: 'string',
          description: 'Track title',
          example: 'My Awesome Track',
        },
        artist: {
          type: 'string',
          description: 'Artist name',
          example: 'John Doe',
        },
        description: {
          type: 'string',
          description: 'Track description',
        },
        genre: {
          type: 'string',
          enum: ['rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'country', 'r-b', 'metal', 'indie', 'other'],
          description: 'Track genre',
        },
        album: {
          type: 'string',
          description: 'Album name',
        },
        duration: {
          type: 'number',
          description: 'Track duration in seconds',
        },
        isPublic: {
          type: 'boolean',
          description: 'Whether the track is public',
          default: false,
        },
      },
      required: ['file', 'title'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Track created successfully',
    type: Track,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data or file' })
  async create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Track> {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    return this.tracksService.create(createTrackDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({ status: 200, description: 'List of all tracks', type: [Track] })
  findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public tracks' })
  @ApiResponse({ status: 200, description: 'List of public tracks', type: [Track] })
  findPublic(): Promise<Track[]> {
    return this.tracksService.findPublic();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tracks by title, artist, or album' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiResponse({ status: 200, description: 'Search results', type: [Track] })
  search(@Query('q') query: string): Promise<Track[]> {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }
    return this.tracksService.search(query);
  }

  @Get('artist/:artist')
  @ApiOperation({ summary: 'Get tracks by artist' })
  @ApiResponse({ status: 200, description: 'Tracks by artist', type: [Track] })
  findByArtist(@Param('artist') artist: string): Promise<Track[]> {
    return this.tracksService.findByArtist(artist);
  }

  @Get('genre/:genre')
  @ApiOperation({ summary: 'Get tracks by genre' })
  @ApiResponse({ status: 200, description: 'Tracks by genre', type: [Track] })
  findByGenre(@Param('genre') genre: string): Promise<Track[]> {
    return this.tracksService.findByGenre(genre);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a track by ID' })
  @ApiResponse({ status: 200, description: 'Track details', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a track' })
  @ApiResponse({ status: 200, description: 'Track updated successfully', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: Partial<CreateTrackDto>,
  ): Promise<Track> {
    return this.tracksService.update(id, updateTrackDto);
  }

  @Patch(':id/play')
  @ApiOperation({ summary: 'Increment track play count' })
  @ApiResponse({ status: 200, description: 'Play count incremented', type: Track })
  @ApiResponse({ status: 404, description: 'Track not found' })
  incrementPlayCount(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.tracksService.incrementPlayCount(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a track' })
  @ApiResponse({ status: 200, description: 'Track deleted successfully' })
  @ApiResponse({ status: 404, description: 'Track not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.tracksService.remove(id);
  }
}
