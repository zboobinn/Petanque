import { Controller, Post, Body, Get } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments') // Le préfixe de la route sera /tournaments
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // Route pour générer un nouveau tournoi (POST /tournaments/generate)
  @Post('generate')
  async generateTournament(@Body() playersData: { players: string[] }) {
    return this.tournamentsService.createBrackets(playersData.players);
  }

  // Route pour récupérer l'historique des tournois (GET /tournaments)
  @Get()
  async getAllTournaments() {
    return { message: 'Ici, nous récupérerons la liste des tournois depuis Supabase' };
  }
}