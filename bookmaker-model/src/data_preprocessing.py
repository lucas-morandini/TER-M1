import pandas as pd
from tqdm import tqdm
import glob
import os

def preprocess_data(input_folder="../data/", output_file="../data/matches_clean.csv"):
    # def transform_match(group):
    #     try:
    #         if 'position' not in group.columns or len(group) != 12:
    #             return None

    #         teams_rows = group[group['position'] == 'team']
    #         players_rows = group[group['position'] != 'team']

    #         if len(teams_rows) != 2 or len(players_rows) != 10:
    #             return None

    #         blue_team = teams_rows[teams_rows["side"] == "Blue"].iloc[0]
    #         red_team = teams_rows[teams_rows["side"] == "Red"].iloc[0]

    #         # Résultat = 1 si Blue gagne, 0 sinon
    #         result = 1 if blue_team["result"] == 1 else 0

    #         return {
    #             "gameid": group["gameid"].iloc[0],
    #             "team1_name": blue_team["teamname"],
    #             "team2_name": red_team["teamname"],
    #             "league": blue_team["league"],
    #             "patch": blue_team["patch"],
    #             "result": result,

    #             # Différences d'indicateurs importants
    #             "gold_diff_15": blue_team["goldat15"] - red_team["goldat15"],
    #             "gold_diff_10": blue_team["goldat10"] - red_team["goldat10"],
    #             "teamkills_diff": blue_team["teamkills"] - red_team["teamkills"],
    #             "visionscore_diff": blue_team["visionscore"] - red_team["visionscore"],
    #             "dpm_diff": blue_team["dpm"] - red_team["dpm"],
    #             "turrets_diff": blue_team["towers"] - red_team["towers"],
    #             "dragons_diff": blue_team["dragons"] - red_team["dragons"],
    #             "barons_diff": blue_team["barons"] - red_team["barons"],
    #             "heralds_diff": blue_team["heralds"] - red_team["heralds"],
    #             "void_grubs_diff": blue_team.get("void_grubs", 0) - red_team.get("void_grubs", 0),

    #             # Durée de la partie
    #             "gamelength": blue_team["gamelength"],
    #         }
    #     except Exception as e:
    #         print(f"Erreur sur gameid {group['gameid'].iloc[0]} : {e}")
    #         return None

    # Charger le fichier CSV
    full_df = pd.read_csv(f"{input_folder}/all_matches_raw.csv", sep=',')

    # Vérifier les premières lignes pour comprendre la structure
    print(f"Structure du DataFrame :\n{full_df.head()}")

    full_df.columns = full_df.columns.str.strip().str.lower()
    print(f"Colonnes après nettoyage : {full_df.columns.tolist()}")

    def transformer_match(group):
        gameid = group['gameid'].iloc[0]

        # Colonnes d’intérêt
        relevant_columns = [ 
            'gameid', 'teamname', 'position', 'date', 'result', 'kills', 'deaths', 'assists',
            'teamkills', 'teamdeaths', 'doublekills', 'triplekills', 'quadrakills', 'pentakills',
            'gamelength', 'dragons', 'barons', 'goldat15', 'towers', 'csat10', 'goldat10', 'xpat10',
            'opp_goldat10', 'opp_xpat10', 'opp_csat10', 'golddiffat10', 'xpdiffat10', 'csdiffat10',
            'killsat10', 'assistsat10', 'deathsat10', 'side'
        ]

        group = group[relevant_columns]

        # On isole les types de lignes
        teams = group[group["position"] == "team"]
        players = group[group["position"] != "team"]

        ligne = {'gameid': gameid}

        # Traitement des équipes
        for _, row in teams.iterrows():
            side = row["side"]  # "Blue" ou "Red"
            for col in relevant_columns:
                if col not in ["gameid", "position"]:  # pas besoin de dupliquer
                    ligne[f"{side}_team_{col}"] = row[col]

        # Traitement des joueurs
        for _, row in players.iterrows():
            side = row["side"]
            pos = row["position"]  # Top, Jng, Mid, Bot, Sup
            for col in relevant_columns:
                if col not in ["gameid", "position"]:
                    ligne[f"{side}_{pos}_{col}"] = row[col]

        return pd.DataFrame([ligne])  # Retourner une DataFrame au lieu d'une Series

    # Appliquer la transformation avec la barre de progression
    tqdm.pandas(desc="Transformation des matchs")
    df_flat = full_df.groupby("gameid").progress_apply(transformer_match).reset_index(drop=True)

    print(f"Colonnes du DataFrame final : {df_flat.columns.tolist()}")
    df_flat.to_csv(output_file, index=False, header=True)

    print("Le CSV nettoyé a été créé avec succès!")
    # matches_clean.to_csv(output_file, index=False)

if __name__ == "__main__":
    preprocess_data()
