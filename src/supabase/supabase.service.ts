import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    // On s'assure que les variables sont bien présentes
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Les variables Supabase sont manquantes dans le fichier .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Cette méthode permet d'accéder au client Supabase depuis n'importe quel autre service
  getClient(): SupabaseClient {
    return this.supabase;
  }
}