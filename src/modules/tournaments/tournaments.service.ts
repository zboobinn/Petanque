import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { TournamentsGateway } from './tournaments.gateway'; // Import du WebSocket

@Injectable()
export class TournamentsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly tournamentsGateway: TournamentsGateway // Injection du WebSocket
  ) {}

  async create(tournamentData: any) {
    const client = this.supabaseService.getClient();
    // On s'assure d'initialiser un tableau vide pour les scores en attente
    const { data, error } = await client
      .from('tournaments')
      .insert([{ ...tournamentData, pending_scores: [] }])
      .select();

    if (error) throw error;
    return data;
  }

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.from('tournaments').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async update(id: number, updateData: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.from('tournaments').update(updateData).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async remove(id: number) {
    const client = this.supabaseService.getClient();
    const { error } = await client.from('tournaments').delete().eq('id', id);
    if (error) throw error;
    return { deleted: true };
  }

  // --- NOUVEAU : SOUMISSION DE SCORE VIA LE WEB (QR CODE) ---
  async submitPublicScore(body: { tournamentId: number, matchId: string, token: string, team1Score: number, team2Score: number }) {
    const client = this.supabaseService.getClient();
    
    // 1. On récupère le tournoi
    const { data: tournament, error } = await client.from('tournaments').select('*').eq('id', body.tournamentId).single();
    if (error || !tournament) throw new NotFoundException("Tournoi introuvable");

    // 2. On ajoute le score en attente
    const pendingScores = tournament.pending_scores || [];
    const newPendingScore = {
      id: Math.random().toString(36).substring(2, 9), // ID unique pour cette demande
      matchId: body.matchId,
      team1Score: body.team1Score,
      team2Score: body.team2Score,
      status: 'waiting',
      submittedAt: new Date().toISOString()
    };

    pendingScores.push(newPendingScore);

    // 3. On sauvegarde dans Supabase
    const { error: updateError } = await client.from('tournaments').update({ pending_scores: pendingScores }).eq('id', body.tournamentId);
    if (updateError) throw updateError;

    // 4. NOTIFICATION EN TEMPS RÉEL (WEBSOCKET)
    // C'est ce qui fait apparaître la cloche instantanément sur l'appli !
    this.tournamentsGateway.notifyNewScore(body.tournamentId);

    return { success: true, message: "Score soumis à l'organisateur pour validation." };
  }

  // --- NOUVEAU : VALIDATION DU SCORE PAR L'ORGANISATEUR (MOBILE) ---
  async resolvePendingScore(id: number, pendingScoreId: string, action: 'approve' | 'reject') {
    const client = this.supabaseService.getClient();
    const { data: tournament, error } = await client.from('tournaments').select('*').eq('id', id).single();
    if (error || !tournament) throw new NotFoundException("Tournoi introuvable");

    // On retire le score de la file d'attente
    const updatedPending = (tournament.pending_scores || []).filter((ps: any) => ps.id !== pendingScoreId);

    // On met à jour la base de données
    const { data, error: updateError } = await client
      .from('tournaments')
      .update({ pending_scores: updatedPending })
      .eq('id', id)
      .select();

    if (updateError) throw updateError;
    
    // Note: Si action === 'approve', c'est ton app mobile qui enverra en même temps 
    // la mise à jour officielle des matchs via la fonction update classique.
    return data;
  }
}