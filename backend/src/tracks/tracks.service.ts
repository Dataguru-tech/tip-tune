import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TracksService {
  private readonly logger = new Logger(TracksService.name);

  constructor(
    @InjectRepository(Track)
    private tracksRepository: Repository<Track>,
    private storageService: StorageService,
  ) {}

  async create(createTrackDto: CreateTrackDto, file: Express.Multer.File): Promise<Track> {
    try {
      // Save file first
      const fileResult = await this.storageService.saveFile(file);
      const fileInfo = await this.storageService.getFileInfo(fileResult.filename);

      // Create track record
      const track = this.tracksRepository.create({
        ...createTrackDto,
        filename: fileResult.filename,
        url: fileResult.url,
        streamingUrl: await this.storageService.getStreamingUrl(fileResult.filename),
        fileSize: BigInt(fileInfo.size),
        mimeType: fileInfo.mimeType,
      });

      const savedTrack = await this.tracksRepository.save(track);
      this.logger.log(`Track created successfully: ${savedTrack.id}`);
      
      return savedTrack;
    } catch (error) {
      this.logger.error(`Failed to create track: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPublic(): Promise<Track[]> {
    return this.tracksRepository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.tracksRepository.findOne({ where: { id } });
    
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    
    return track;
  }

  async update(id: string, updateTrackDto: Partial<CreateTrackDto>): Promise<Track> {
    const track = await this.findOne(id);
    
    Object.assign(track, updateTrackDto);
    
    const updatedTrack = await this.tracksRepository.save(track);
    this.logger.log(`Track updated successfully: ${id}`);
    
    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);
    
    try {
      // Delete file from storage
      await this.storageService.deleteFile(track.filename);
      
      // Delete track record
      await this.tracksRepository.remove(track);
      
      this.logger.log(`Track deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete track: ${error.message}`);
      throw error;
    }
  }

  async incrementPlayCount(id: string): Promise<Track> {
    const track = await this.findOne(id);
    
    track.playCount += 1;
    
    const updatedTrack = await this.tracksRepository.save(track);
    
    return updatedTrack;
  }

  async findByArtist(artist: string): Promise<Track[]> {
    return this.tracksRepository.find({
      where: { artist },
      order: { createdAt: 'DESC' },
    });
  }

  async findByGenre(genre: string): Promise<Track[]> {
    return this.tracksRepository.find({
      where: { genre },
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Track[]> {
    return this.tracksRepository
      .createQueryBuilder('track')
      .where('track.title ILIKE :query', { query: `%${query}%` })
      .orWhere('track.artist ILIKE :query', { query: `%${query}%` })
      .orWhere('track.album ILIKE :query', { query: `%${query}%` })
      .orderBy('track.createdAt', 'DESC')
      .getMany();
  }
}
