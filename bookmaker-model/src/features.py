# Charger les données nettoyées
import pandas as pd
import numpy as np
from collections import defaultdict
from src.utils import get_last_5_matches_1v1_win_rate, get_last_5_matches_1v1_kd_ratio, get_last_5_matches_1v1_dragons, get_last_5_matches_1v1_barons

def load_data():
    df = pd.read_csv("data/matches_clean.csv")
    # Trier le dataset par date pour s'assurer que les calculs de performance récente sont corrects
    df['Blue_team_date'] = pd.to_datetime(df['Blue_team_date'], format='%Y-%m-%d %H:%M:%S')

    df.sort_values(by='Blue_team_date', inplace=True)

    confrontations = defaultdict(list)
    team_matches = defaultdict(list)
    df = df.dropna(subset=['Blue_team_teamname', 'Red_team_teamname'])

    for _, row in df.iterrows():
        team_matches[row['Blue_team_teamname']].append(row)
        team_matches[row['Red_team_teamname']].append(row)
        key = tuple(sorted([row['Blue_team_teamname'], row['Red_team_teamname']]))
        confrontations[key].append(row)
    return df, confrontations, team_matches

def create_features(df, confrontations, team_matches):
    # Calculer le taux de victoire sur les 5 derniers matchs pour chaque équipe
    df['blue_team_recent_win_rate'] = df.groupby('Blue_team_teamname')['Blue_team_result'].transform(lambda x: x.rolling(window=15, min_periods=1).mean())
    df['red_team_recent_win_rate'] = df.groupby('Red_team_teamname')['Red_team_result'].transform(lambda x: x.rolling(window=15, min_periods=1).mean())

    print("Taux de victoire sur les 5 derniers matchs calculé.")

    # Calculer le ratio K/D sur les 5 derniers matchs pour chaque équipe
    df['blue_team_recent_kd_ratio'] = df.groupby('Blue_team_teamname').apply(lambda x: (x['Blue_team_kills'] / (x['Blue_team_deaths'] + 1e-6)).rolling(window=15, min_periods=1).mean()).reset_index(level=0, drop=True)
    df['red_team_recent_kd_ratio'] = df.groupby('Red_team_teamname').apply(lambda x: (x['Red_team_kills'] / (x['Red_team_deaths'] + 1e-6)).rolling(window=15, min_periods=1).mean()).reset_index(level=0, drop=True)

    print("Ratio K/D sur les 5 derniers matchs calculé.")

    # Calculer le nombre moyen de dragons tués sur les 5 derniers matchs pour chaque équipe
    df['blue_team_recent_dragons'] = df.groupby('Blue_team_teamname')['Blue_team_dragons'].transform(lambda x: x.rolling(window=20, min_periods=1).mean())
    df['red_team_recent_dragons'] = df.groupby('Red_team_teamname')['Red_team_dragons'].transform(lambda x: x.rolling(window=20, min_periods=1).mean())

    print("Nombre moyen de dragons tués sur les 5 derniers matchs calculé.")

    # Calculer le nombre moyen de barons tués sur les 5 derniers matchs pour chaque équipe
    df['blue_team_recent_barons'] = df.groupby('Blue_team_teamname')['Blue_team_barons'].transform(lambda x: x.rolling(window=20, min_periods=1).mean())
    df['red_team_recent_barons'] = df.groupby('Red_team_teamname')['Red_team_barons'].transform(lambda x: x.rolling(window=20, min_periods=1).mean())

    print("Nombre moyen de barons tués sur les 5 derniers matchs calculé.")

    df['blue_team_last3_win_rate'] = df.groupby('Blue_team_teamname')['Blue_team_result'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())
    df['red_team_last3_win_rate'] = df.groupby('Red_team_teamname')['Red_team_result'].transform(lambda x: x.rolling(window=3, min_periods=1).mean())

    print("Taux de victoire sur les 3 derniers matchs calculé.")

    # Calculer le ratio K/D sur les 3 derniers matchs pour chaque équipe
    df['blue_team_last3_kd_ratio'] = df.groupby('Blue_team_teamname').apply(lambda x: (x['Blue_team_kills'] / (x['Blue_team_deaths'] + 1e-6)).rolling(window=3, min_periods=1).mean()).reset_index(level=0, drop=True)
    df['red_team_last3_kd_ratio'] = df.groupby('Red_team_teamname').apply(lambda x: (x['Red_team_kills'] / (x['Red_team_deaths'] + 1e-6)).rolling(window=3, min_periods=1).mean()).reset_index(level=0, drop=True)

    print("Ratio K/D sur les 3 derniers matchs calculé.")

    # Ecart-type des kills, deaths, dragons et barons sur les 20 derniers matchs

    df['blue_team_kd_ratio_std_20'] = df.groupby('Blue_team_teamname').apply(lambda x: (x['Blue_team_kills'] / (x['Blue_team_deaths'] + 1e-6)).rolling(window=20, min_periods=1).std()).reset_index(level=0, drop=True)
    df['red_team_kd_ratio_std_20'] = df.groupby('Red_team_teamname').apply(lambda x: (x['Red_team_kills'] / (x['Red_team_deaths'] + 1e-6)).rolling(window=20, min_periods=1).std()).reset_index(level=0, drop=True)

    df['blue_team_kills_std_20'] = df.groupby('Blue_team_teamname')['Blue_team_kills'].transform(lambda x: x.rolling(window=20, min_periods=1).std())
    df['red_team_kills_std_20'] = df.groupby('Red_team_teamname')['Red_team_kills'].transform(lambda x: x.rolling(window=20, min_periods=1).std())

    df['blue_team_deaths_std_20'] = df.groupby('Blue_team_teamname')['Blue_team_deaths'].transform(lambda x: x.rolling(window=20, min_periods=1).std())
    df['red_team_deaths_std_20'] = df.groupby('Red_team_teamname')['Red_team_deaths'].transform(lambda x: x.rolling(window=20, min_periods=1).std())

    df['blue_team_dragons_std_20'] = df.groupby('Blue_team_teamname')['Blue_team_dragons'].transform(lambda x: x.rolling(window=20, min_periods=1).std())
    df['red_team_dragons_std_20'] = df.groupby('Red_team_teamname')['Red_team_dragons'].transform(lambda x: x.rolling(window=20, min_periods=1).std())

    df['blue_team_barons_std_20'] = df.groupby('Blue_team_teamname')['Blue_team_barons'].transform(lambda x: x.rolling(window=20, min_periods=1).std())
    df['red_team_barons_std_20'] = df.groupby('Red_team_teamname')['Red_team_barons'].transform(lambda x: x.rolling(window=20, min_periods=1).std())

    print("Ecart-type des kills, deaths, dragons et barons, kd sur les 20 derniers matchs calculé.")

    # df['blue_team_opponent_avg_winrate_last10'] = df.apply(lambda row: get_last_n_matches_opponent_winrate(row['Blue_team_teamname'], row['gameid'], n_matches=10), axis=1)
    # df['red_team_opponent_avg_winrate_last10'] = df.apply(lambda row: get_last_n_matches_opponent_winrate(row['Red_team_teamname'], row['gameid'], n_matches=10), axis=1)

    # print("Taux de victoire moyen de l'adversaire sur les 10 derniers matchs calculé.")

    # Utiliser des transformations vectorisées pour calculer les caractéristiques
    df['blue_team_recent_1v1_win_rate'] = df.apply(lambda row: get_last_5_matches_1v1_win_rate(row['Blue_team_teamname'], row['Red_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)
    df['red_team_recent_1v1_win_rate'] = df.apply(lambda row: get_last_5_matches_1v1_win_rate(row['Red_team_teamname'], row['Blue_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)

    print("Taux de victoire sur les 5 derniers matchs calculé. (1v1)")

    df['blue_team_recent_1v1_kd_ratio'] = df.apply(lambda row: get_last_5_matches_1v1_kd_ratio(row['Blue_team_teamname'], row['Red_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)
    df['red_team_recent_1v1_kd_ratio'] = df.apply(lambda row: get_last_5_matches_1v1_kd_ratio(row['Red_team_teamname'], row['Blue_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)

    print("Ratio K/D sur les 5 derniers matchs calculé. (1v1)")

    df['blue_team_recent_1v1_dragons'] = df.apply(lambda row: get_last_5_matches_1v1_dragons(row['Blue_team_teamname'], row['Red_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)
    df['red_team_recent_1v1_dragons'] = df.apply(lambda row: get_last_5_matches_1v1_dragons(row['Red_team_teamname'], row['Blue_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)

    print("Nombre moyen de dragons tués sur les 5 derniers matchs calculé. (1v1)")

    df['blue_team_recent_1v1_barons'] = df.apply(lambda row: get_last_5_matches_1v1_barons(row['Blue_team_teamname'], row['Red_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)
    df['red_team_recent_1v1_barons'] = df.apply(lambda row: get_last_5_matches_1v1_barons(row['Red_team_teamname'], row['Blue_team_teamname'], row['gameid'], confrontations=confrontations), axis=1)

    print("Nombre moyen de barons tués sur les 5 derniers matchs calculé. (1v1)")

    # # Sauvegarder le dataset avec les nouvelles caractéristiques
    df.to_csv('../data/dataset_with_recent_performance.csv', index=False)

def main():
    pass
    