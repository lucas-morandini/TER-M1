import numpy as np
from collections import defaultdict
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.under_sampling import RandomUnderSampler
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')
import joblib

def generate_train():
    df = pd.read_csv("../data/dataset_with_recent_performance.csv")
    relevant_features = [
        'blue_team_recent_win_rate',
        'red_team_recent_win_rate',
        'blue_team_recent_kd_ratio',
        'red_team_recent_kd_ratio',
        'blue_team_recent_dragons',
        'red_team_recent_dragons',
        'blue_team_recent_barons',
        'red_team_recent_barons',
        'blue_team_last3_win_rate',
        'red_team_last3_win_rate',
        'blue_team_last3_kd_ratio',
        'red_team_last3_kd_ratio',
        'blue_team_kd_ratio_std_20',
        'red_team_kd_ratio_std_20',
        'blue_team_kills_std_20',
        'red_team_kills_std_20',
        'blue_team_deaths_std_20',
        'red_team_deaths_std_20',
        'blue_team_dragons_std_20',
        'red_team_dragons_std_20',
        'blue_team_barons_std_20',
        'red_team_barons_std_20',
        # 'blue_team_opponent_avg_winrate_last10',  # décommenter si utilisé
        # 'red_team_opponent_avg_winrate_last10',   # décommenter si utilisé
        'blue_team_recent_1v1_win_rate',
        'red_team_recent_1v1_win_rate',
        'blue_team_recent_1v1_kd_ratio',
        'red_team_recent_1v1_kd_ratio',
        'blue_team_recent_1v1_dragons',
        'red_team_recent_1v1_dragons',
        'blue_team_recent_1v1_barons',
        'red_team_recent_1v1_barons'
    ]

    # Sélectionner les colonnes pertinentes
    X = df[relevant_features]
    y = df['Blue_team_result']
    X = X.fillna(0)  # Remplacer les NaN par 0
    X = X.replace([np.inf, -np.inf], 0)  # Remplacer les infinis par 0
    # Normaliser les données
    scaler = StandardScaler()
    X = scaler.fit_transform(X)
    # Diviser les données en ensembles d'entraînement et de test
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    undersampler = RandomUnderSampler(random_state=42)
    X_train, y_train = undersampler.fit_resample(X_train, y_train)
    # Sauvegarder le scaler
    scaler_path = save_scaler(scaler)
    return X_train, X_test, y_train, y_test, scaler_path

def model_training(X_train, X_test, y_train, y_test, model_name):
    # Entraîner le modèle
    if model_name == "RandomForest":
        model = RandomForestClassifier(n_estimators=100, random_state=42)
    elif model_name == "XGBoost":
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
    else:
        raise ValueError("Model name not recognized")

    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"{model_name} Classifier:")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))
    # Sauvegarder le modèle
    model_path = save_models(model, model_name)
    return model, model_path

def save_models(model, model_name):
    # Si le model est un xgboost, on le sauvegarde avec xgboost
    date_str = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
    path = "../models/{}_model_{}.joblib".format(model_name, date_str)
    joblib.dump(model, path)
    print(f"Model {model_name} saved as {path}")
    return path

def save_scaler(scaler):
    date_str = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
    path = "../models/scaler_{}.joblib".format(date_str)
    joblib.dump(scaler, path)
    print("Scaler saved as {}".format(path))
    return path