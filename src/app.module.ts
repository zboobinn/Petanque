import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { MatchesModule } from './modules/matches/matches.module';
import { GamesModule } from './modules/games/games.module';

// 1. NOUVEAU : On importe le contrôleur
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Rend le .env accessible partout
    SupabaseModule,
    TournamentsModule,
    MatchesModule,
    GamesModule,
  ],
  // 2. NOUVEAU : On le déclare pour que NestJS l'active !
  controllers: [AppController],
})
export class AppModule {}