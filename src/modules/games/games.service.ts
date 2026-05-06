import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class GamesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Enregistrer une nouvelle partie (terminée ou en pause)
  async createGame(gameData: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('games')
      .insert([gameData])
      .select();

    if (error) throw error;
    return data;
  }

  // Récupérer l'historique complet des parties
  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Mettre à jour une partie (ex: passer de "en pause" à "terminée")
  async updateGame(id: number, updateData: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('games')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }
}