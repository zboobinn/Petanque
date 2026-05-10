import { Module } from '@nestjs/common';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { TournamentsGateway } from './tournaments.gateway';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService, TournamentsGateway]
})
export class TournamentsModule {}
