import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { MatchesModule } from './modules/matches/matches.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Rend le .env accessible partout
    SupabaseModule,
    TournamentsModule,
    MatchesModule,
  ],
})
export class AppModule {}