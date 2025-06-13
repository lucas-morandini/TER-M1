from fastapi import FastAPI
from fastapi.responses import JSONResponse
import sys
import os
from urllib.parse import unquote
# Ajouter le répertoire src au chemin d'importation
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from src.predict import predict_odds
from src.features import load_data
import requests

app = FastAPI()

MODEL_PATH = "models/xgboost_model.json"
SCALER_PATH = "models/scaler.joblib"

# Load the model and scaler
df, confrontations, team_matches = load_data()


# Au lancement de l'application on doit faire une requete sur http://ter_m1_backend:3000/model_up en post
@app.on_event("startup")
async def notify_model_up():
    try:
        url = "http://ter_m1_backend:3000/api/service/model_up"
        response = requests.post(url)
        if response.status_code == 200:
            print("Model up notification sent successfully.")
        else:
            print(f"Failed to notify model up. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error notifying model up: {e}")

@app.get("/api/odds/{team1}/{team2}")
def get_odds(team1: str, team2: str):
    try:
        # Validate team names
        # decode team names by removing url encoding
        team1 = unquote(team1)
        team2 = unquote(team2)
        print(f"Received request for odds between {team1} and {team2}")
        if not team1 or not team2:
            return JSONResponse(status_code=400, content={"error": "Invalid team names"})
        if team1 == team2:
            return JSONResponse(status_code=400, content={"error": "Teams must be different"})
        


        odds_team_1, odds_team_2 = predict_odds(team1, team2, MODEL_PATH, SCALER_PATH, confrontations, team_matches)
        print(f"Odds for {team1}: {odds_team_1}, Odds for {team2}: {odds_team_2}")
        return JSONResponse({
            team1: round(float(odds_team_1), 2),
            team2: round(float(odds_team_2), 2),
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
