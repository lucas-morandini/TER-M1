import numpy as np
from collections import defaultdict
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from src.utils import get_last_5_matches, get_last_5_matches_1v1_win_rate, get_last_5_matches_1v1_kd_ratio, get_last_5_matches_1v1_dragons, get_last_5_matches_1v1_barons
import pandas as pd
import joblib

def predict_winner_proba(team_1, team_2, model, scaler, confrontations=defaultdict(list), team_matches=defaultdict(list)):
    current_gameid = None
    # Get the last 5 matches between the two teams
    last_5_matches_team_1 = get_last_5_matches(team_1, n_matches=10, team_matches=team_matches)
    last_5_matches_team_2 = get_last_5_matches(team_2, n_matches=10, team_matches=team_matches)

    df_to_predict = pd.DataFrame({
        'blue_team_recent_win_rate': np.mean([match['Blue_team_result'] for match in last_5_matches_team_1]),
        'red_team_recent_win_rate': np.mean([match['Red_team_result'] for match in last_5_matches_team_2]),
        'blue_team_recent_kd_ratio': np.mean([match['Blue_team_kills'] / (match['Blue_team_deaths'] + 1e-6) for match in last_5_matches_team_1]),
        'red_team_recent_kd_ratio': np.mean([match['Red_team_kills'] / (match['Red_team_deaths'] + 1e-6) for match in last_5_matches_team_2]),
        'blue_team_recent_dragons': np.mean([match['Blue_team_dragons'] for match in last_5_matches_team_1]),
        'red_team_recent_dragons': np.mean([match['Red_team_dragons'] for match in last_5_matches_team_2]),
        'blue_team_recent_barons': np.mean([match['Blue_team_barons'] for match in last_5_matches_team_1]),
        'red_team_recent_barons': np.mean([match['Red_team_barons'] for match in last_5_matches_team_2]),
        'blue_team_recent_1v1_win_rate': [get_last_5_matches_1v1_win_rate(team_1, team_2, current_gameid, confrontations)],
        'red_team_recent_1v1_win_rate': [get_last_5_matches_1v1_win_rate(team_2, team_1, current_gameid, confrontations)],
        'blue_team_recent_1v1_kd_ratio': [get_last_5_matches_1v1_kd_ratio(team_1, team_2, current_gameid, confrontations)],
        'red_team_recent_1v1_kd_ratio': [get_last_5_matches_1v1_kd_ratio(team_2, team_1, current_gameid, confrontations)],
        'blue_team_recent_1v1_dragons': [get_last_5_matches_1v1_dragons(team_1, team_2, current_gameid, confrontations)],
        'red_team_recent_1v1_dragons': [get_last_5_matches_1v1_dragons(team_2, team_1, current_gameid, confrontations)],
        'blue_team_recent_1v1_barons': [get_last_5_matches_1v1_barons(team_1, team_2, current_gameid, confrontations)],
        'red_team_recent_1v1_barons': [get_last_5_matches_1v1_barons(team_2, team_1, current_gameid, confrontations)],
        'blue_team_last3_win_rate': np.mean([match['Blue_team_result'] for match in last_5_matches_team_1[-3:]]),
        'red_team_last3_win_rate': np.mean([match['Red_team_result'] for match in last_5_matches_team_2[-3:]]),
        'blue_team_last3_kd_ratio': np.mean([match['Blue_team_kills'] / (match['Blue_team_deaths'] + 1e-6) for match in last_5_matches_team_1[-3:]]),
        'red_team_last3_kd_ratio': np.mean([match['Red_team_kills'] / (match['Red_team_deaths'] + 1e-6) for match in last_5_matches_team_2[-3:]]),
        'blue_team_kd_ratio_std_20': np.std([match['Blue_team_kills'] / (match['Blue_team_deaths'] + 1e-6) for match in last_5_matches_team_1[-20:]]),
        'red_team_kd_ratio_std_20': np.std([match['Red_team_kills'] / (match['Red_team_deaths'] + 1e-6) for match in last_5_matches_team_2[-20:]]),
        'blue_team_kills_std_20': np.std([match['Blue_team_kills'] for match in last_5_matches_team_1[-20:]]),
        'red_team_kills_std_20': np.std([match['Red_team_kills'] for match in last_5_matches_team_2[-20:]]),
        'blue_team_deaths_std_20': np.std([match['Blue_team_deaths'] for match in last_5_matches_team_1[-20:]]),
        'red_team_deaths_std_20': np.std([match['Red_team_deaths'] for match in last_5_matches_team_2[-20:]]),
        'blue_team_dragons_std_20': np.std([match['Blue_team_dragons'] for match in last_5_matches_team_1[-20:]]),
        'red_team_dragons_std_20': np.std([match['Red_team_dragons'] for match in last_5_matches_team_2[-20:]]),
        'blue_team_barons_std_20': np.std([match['Blue_team_barons'] for match in last_5_matches_team_1[-20:]]),
        'red_team_barons_std_20': np.std([match['Red_team_barons'] for match in last_5_matches_team_2[-20:]]),
    })

    # Remplacer les NaN par 0
    df_to_predict = df_to_predict.fillna(0)
    df_to_predict = df_to_predict.replace([np.inf, -np.inf], 0)
    # Normaliser les données
    # df_to_predict = scaler.transform(df_to_predict)
    # Prédire les probabilités de victoire pour chaque équipe
    proba_team_1 = model.predict_proba(df_to_predict)[:, 1]
    proba_team_2 = model.predict_proba(df_to_predict)[:, 0]
    return proba_team_1[0], proba_team_2[0]

def predict_odds(team_1, team_2, model_path,scaler_path, confrontations=defaultdict(list), team_matches=defaultdict(list)):
    if model_path.endswith('.json'):
        model = XGBClassifier(
            n_estimators=200,
            max_depth=3,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=1.0,   # Pénalisation L1 → sparse model
            reg_lambda=2.0,  # Pénalisation L2 → réduit les gros poids
            random_state=42,
            use_label_encoder=False,
            eval_metric='logloss'
        )
        model.load_model(model_path)
    else:
        model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    p1a, p2a = predict_winner_proba(team_1, team_2, model, scaler, confrontations, team_matches)
    p1b, p2b = predict_winner_proba(team_2, team_1, model, scaler, confrontations, team_matches)

    # Moyenne des prédictions symétriques
    proba_team_1 = (p1a + p2b) / 2
    proba_team_2 = (p2a + p1b) / 2

    # marge maudite de 5%
    proba_team_1 = proba_team_1 * 1.05
    proba_team_2 = proba_team_2 * 1.05

    # Calcul des cotes
    odds_team_1 = 1 / proba_team_1
    odds_team_2 = 1 / proba_team_2
    return odds_team_1, odds_team_2