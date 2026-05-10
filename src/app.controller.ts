import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  
  @Get('score')
  getScorePage(@Res() res: Response) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Saisie du Score - Jack'o</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background-color: #000000; color: white; font-family: sans-serif; }
            .glass { background: #1f2937; border: 1px solid #374151; }
        </style>
    </head>
    <body class="min-h-screen flex flex-col items-center justify-center p-4">
        
        <div class="max-w-md w-full glass rounded-3xl p-6 shadow-2xl">
            <div class="text-center mb-8">
                <div class="inline-block bg-purple-600/20 p-3 rounded-full mb-4">
                    <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
                </div>
                <h1 class="text-2xl font-bold text-white mb-2">Jack'o - Tournoi</h1>
                <p class="text-gray-400 text-sm" id="status-text">Recherche de votre match en cours...</p>
            </div>

            <div id="match-container" class="hidden">
                <div class="flex justify-between items-center mb-8">
                    <div class="flex-1 flex flex-col items-center">
                        <p id="teamA-name" class="font-bold text-lg mb-3 text-center text-gray-200 line-clamp-2 h-14">Équipe 1</p>
                        <input type="number" id="scoreA" class="w-24 h-24 text-center text-4xl font-black bg-gray-900 border-2 border-gray-600 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" min="0" max="13" placeholder="0">
                    </div>
                    
                    <div class="px-2">
                        <span class="text-lg font-black text-purple-500 bg-purple-500/10 px-3 py-1 rounded-lg">VS</span>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center">
                        <p id="teamB-name" class="font-bold text-lg mb-3 text-center text-gray-200 line-clamp-2 h-14">Équipe 2</p>
                        <input type="number" id="scoreB" class="w-24 h-24 text-center text-4xl font-black bg-gray-900 border-2 border-gray-600 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none" min="0" max="13" placeholder="0">
                    </div>
                </div>

                <button id="submit-btn" onclick="submitScore()" class="w-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] text-lg">
                    Envoyer le score
                </button>
            </div>

            <div id="success-container" class="hidden text-center py-8">
                <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 class="text-2xl font-bold text-white mb-3">Score envoyé !</h2>
                <p class="text-gray-400 leading-relaxed">L'organisateur vient de recevoir une notification sur son téléphone pour valider votre score.</p>
                <p class="text-gray-500 text-sm mt-8">Vous pouvez fermer cette page.</p>
            </div>
        </div>

        <script>
            // 1. Récupération des paramètres de l'URL (?t=123&m=456)
            const urlParams = new URLSearchParams(window.location.search);
            const tournamentId = urlParams.get('t');
            const matchId = urlParams.get('m');
            
            // L'API est sur la même adresse que cette page web
            const apiUrl = window.location.origin;

            async function loadMatch() {
                if (!tournamentId || !matchId) {
                    document.getElementById('status-text').innerText = "Erreur : Le lien du QR Code est invalide.";
                    return;
                }

                try {
                    // On récupère la liste des tournois pour trouver le match
                    const res = await fetch(\`\${apiUrl}/tournaments\`);
                    const tournaments = await res.json();
                    const tournament = tournaments.find(t => t.id == tournamentId);
                    
                    if (!tournament) throw new Error("Tournoi introuvable. Il a peut-être été supprimé.");

                    const match = tournament.matches.find(m => m.id == matchId);
                    if (!match) throw new Error("Match introuvable.");

                    // On affiche les vrais noms des équipes
                    document.getElementById('teamA-name').innerText = match.teamA.name;
                    document.getElementById('teamB-name').innerText = match.teamB.name;
                    
                    document.getElementById('status-text').innerText = "Saisissez le score final de la partie";
                    document.getElementById('match-container').classList.remove('hidden');

                } catch (e) {
                    document.getElementById('status-text').innerText = e.message;
                }
            }

            async function submitScore() {
                const scoreA = parseInt(document.getElementById('scoreA').value);
                const scoreB = parseInt(document.getElementById('scoreB').value);

                if (isNaN(scoreA) || isNaN(scoreB)) {
                    alert("Veuillez entrer les scores des deux équipes.");
                    return;
                }

                const btn = document.getElementById('submit-btn');
                btn.disabled = true;
                btn.innerHTML = "Envoi en cours...";
                btn.classList.add('opacity-50');

                try {
                    const res = await fetch(\`\${apiUrl}/tournaments/public/score\`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tournamentId: parseInt(tournamentId),
                            matchId: matchId, // Gardé en string pour plus de sécurité
                            token: "qr-validation",
                            team1Score: scoreA,
                            team2Score: scoreB
                        })
                    });

                    if (res.ok) {
                        document.getElementById('match-container').classList.add('hidden');
                        document.getElementById('status-text').classList.add('hidden');
                        document.getElementById('success-container').classList.remove('hidden');
                    } else {
                        throw new Error("Le serveur a refusé le score. Veuillez réessayer.");
                    }
                } catch (e) {
                    alert(e.message);
                    btn.disabled = false;
                    btn.innerHTML = "Envoyer le score";
                    btn.classList.remove('opacity-50');
                }
            }

            // Lancement au chargement de la page
            loadMatch();
        </script>
    </body>
    </html>
    `;

    res.type('text/html');
    res.send(htmlContent);
  }
}