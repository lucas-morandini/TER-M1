import numpy as np
from collections import defaultdict

# Fonction pour obtenir les 5 derniers matchs entre deux équipes
def get_last_n_matches_from_dict(team1, team2, current_gameid = None, n_matches=5, confrontations=defaultdict(list)):
    key = tuple(sorted([team1, team2]))
    matches = confrontations.get(key, [])

    # Trouver l'indice du match courant dans la liste
    if current_gameid is None:
        # Si le gameid est None, on ne peut pas trouver l'indice
        return matches[-n_matches:] if len(matches) >= n_matches else matches
    
    index = next((i for i, match in enumerate(matches) if match['gameid'] == current_gameid), None)
    if index is None:
        # Le match n’est pas encore dans la liste → on est en train de le traiter
        # Donc on peut prendre directement les 5 derniers avant la fin de la liste
        return matches[-n_matches:]
    
    # Retourne les 5 matchs avant ce match
    return matches[max(0, index - n_matches):index]

def get_last_5_matches(team_name, current_gameid=None,n_matches=5, team_matches=defaultdict(list)):
    # Vérifier si l'équipe existe dans le dictionnaire
    if team_name not in team_matches:
        return []
    # Trouver l'indice du match courant dans la liste
    if current_gameid is None:
        # Si le gameid est None, on ne peut pas trouver l'indice
        return team_matches[team_name][-n_matches:] if len(team_matches[team_name]) >= n_matches else team_matches[team_name]
    index = next((i for i, match in enumerate(team_matches[team_name]) if match['gameid'] == current_gameid), None)
    if index is None:
        # Le match n’est pas encore dans la liste → on est en train de le traiter
        # Donc on peut prendre directement les 5 derniers avant la fin de la liste
        return team_matches[team_name][-n_matches:]
    # Retourne les 5 matchs avant ce match        
    return team_matches[team_name][max(0, index - n_matches):index]

# Calculer le taux de victoire sur les 5 derniers matchs pour chaque équipe
def get_last_5_matches_1v1_win_rate(team_1, team_2, current_gameid, confrontations=defaultdict(list)):
    last_5_matches = get_last_n_matches_from_dict(team_1, team_2, current_gameid, n_matches=8, confrontations=confrontations)
    if len(last_5_matches) == 0:
        return np.nan

    team_1_wins = 0
    for match in last_5_matches:
        if match['Blue_team_teamname'] == team_1:
            team_1_wins += match['Blue_team_result']
        else:
            team_1_wins += match['Red_team_result']
    return team_1_wins / len(last_5_matches)

# Calculer le ratio K/D sur les 5 derniers matchs pour chaque équipe
def get_last_5_matches_1v1_kd_ratio(team_1, team_2, current_gameid, confrontations=defaultdict(list)):
    last_5_matches = get_last_n_matches_from_dict(team_1, team_2, current_gameid,n_matches=8, confrontations=confrontations)
    if len(last_5_matches) == 0:
        return np.nan
    team_1_kills = 0
    team_1_deaths = 0
    for match in last_5_matches:
        if match['Blue_team_teamname'] == team_1:
            team_1_kills += match['Blue_team_kills']
            team_1_deaths += match['Blue_team_deaths']
        else:
            team_1_kills += match['Red_team_kills']
            team_1_deaths += match['Red_team_deaths']
    if team_1_deaths == 0:
        return team_1_kills
    return team_1_kills / team_1_deaths

# Calculer le nombre moyen de dragons tués sur les 5 derniers matchs pour chaque équipe
def get_last_5_matches_1v1_dragons(team_1, team_2, current_gameid, confrontations=defaultdict(list)):
    last_5_matches = get_last_n_matches_from_dict(team_1, team_2, current_gameid, n_matches=8, confrontations=confrontations)
    if len(last_5_matches) == 0:
        return np.nan
    team_1_dragons = 0
    for match in last_5_matches:
        if match['Blue_team_teamname'] == team_1:
            team_1_dragons += match['Blue_team_dragons']
        else:
            team_1_dragons += match['Red_team_dragons']
    return team_1_dragons

# Calculer le nombre moyen de barons tués sur les 5 derniers matchs pour chaque équipe
def get_last_5_matches_1v1_barons(team_1, team_2, current_gameid, confrontations=defaultdict(list)):
    last_5_matches = get_last_n_matches_from_dict(team_1, team_2, current_gameid, n_matches=8, confrontations=confrontations)
    if len(last_5_matches) == 0:
        return np.nan
    team_1_barons = 0
    for match in last_5_matches:
        if match['Blue_team_teamname'] == team_1:
            team_1_barons += match['Blue_team_barons']
        else:
            team_1_barons += match['Red_team_barons']
    return team_1_barons
# def get_last_n_matches_opponent_winrate(team_1, current_gameid=None, n_matches=5, n_opponent_matches=10):
#     matches = get_last_5_matches(team_1, current_gameid, n_matches=n_matches)
#     if not matches:
#         return np.nan

#     total_winrate = 0
#     valid_opponent_count = 0

#     for match in matches:
#         # Identifier l’adversaire
#         if match['Blue_team_teamname'] == team_1:
#             opponent = match['Red_team_teamname']
#         else:
#             opponent = match['Blue_team_teamname']

#         # Récupérer les matchs récents de l’adversaire
#         opp_matches = get_last_5_matches(opponent, current_gameid, n_matches=n_opponent_matches)
#         if not opp_matches:
#             continue

#         opp_wins = 0
#         for m in opp_matches:
#             if m['Blue_team_teamname'] == opponent:
#                 opp_wins += m['Blue_team_result']
#             else:
#                 opp_wins += m['Red_team_result']
        
#         winrate = opp_wins / len(opp_matches)
#         total_winrate += winrate
#         valid_opponent_count += 1

#     if valid_opponent_count == 0:
#         return np.nan

#     return total_winrate / valid_opponent_count