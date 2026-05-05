import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { shuffleArray } from '../../utils/array.util'; // Import de notre fonction isolée

@Injectable()
export class TournamentsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createBrackets(players: string[]) {
    const supabase = this.supabaseService.getClient();
    
    // 1. Mélanger les joueurs de manière aléatoire
    const shuffledPlayers = shuffleArray(players);
    
    // 2. Créer l'entrée du Tournoi dans Supabase
    const { data: tournament, error: tournamentError } = await supabase
      .from('tournaments')
      .insert([{ name: `Tournoi du ${new Date().toLocaleDateString('fr-FR')}` }])
      .select() // .select() permet de récupérer l'ID généré par Supabase
      .single();

    if (tournamentError) {
      console.error(tournamentError);
      throw new InternalServerErrorException('Erreur lors de la création du tournoi.');
    }

    // 3. Préparer les Matchs à insérer en typant explicitement le tableau
    const matchesToInsert: { tournament_id: string; status: string }[] = [];

    // 4. Insérer tous les matchs d'un coup dans Supabase
    if (matchesToInsert.length > 0) {
      const { error: matchError } = await supabase
        .from('matches')
        .insert(matchesToInsert);
        
      if (matchError) {
         console.error(matchError);
         throw new InternalServerErrorException('Erreur lors de la création des matchs.');
      }
    }

    // 5. Renvoyer un résumé propre au téléphone mobile
    return {
      success: true,
      message: 'Tournoi généré et sauvegardé avec succès !',
      tournamentId: tournament.id,
      matchesCreated: matchesToInsert.length,
      matchups: shuffledPlayers // On renvoie l'ordre pour vérification
    };
  }
}