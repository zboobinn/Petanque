import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  create(@Body() tournamentData: any) {
    return this.tournamentsService.create(tournamentData);
  }

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.tournamentsService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }

  // --- NOUVELLES ROUTES POUR LE SYSTEME DE QR CODE ---

  // Route publique pour la page web
  @Post('public/score')
  submitPublicScore(@Body() body: { tournamentId: number, matchId: string, token: string, team1Score: number, team2Score: number }) {
    return this.tournamentsService.submitPublicScore(body);
  }

  // Route privée pour ton application mobile
  @Post(':id/resolve-score')
  resolveScore(
    @Param('id') id: string, 
    @Body() body: { pendingScoreId: string, action: 'approve' | 'reject' }
  ) {
    return this.tournamentsService.resolvePendingScore(+id, body.pendingScoreId, body.action);
  }
}