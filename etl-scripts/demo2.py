### ETL Script ###

import os
import sys
import requests
import json
import pandas as pd
import pyodbc
from dotenv import load_dotenv


####################
# Required env vars:
# XXXX_API_CLIENT_ID
# XXXX_API_CLIENT_SECRET
# DATABASE_USER
# DATABASE_PASSWORD
####################

def main(period):
    try:

        success_counter = 0
        error_counter = 0

        # Lade .env-Variablen
        load_dotenv()

        # Mit Datenbank verbinden
        cnxn = connecting_database()
        if cnxn: print('Mit Datenbank verbunden (' + str(cnxn) + ')')
        cursor = cnxn.cursor()

        # Token für XXXX_API-API generieren
        XXXX_API_token = get_new_XXXX_API_token()

        # Unique XXXX-Keys von TABLE-Tabelle einlesen
        total_usage_table = pd.read_sql_query("SELECT DISTINCT [KEY] FROM [TABLE]", cnxn)

        # Jahr der Periode
        year = period[:4]
        # Monat der Periode
        month = period[5:7]

        # Gesamtes Kostensalden-Objekt der Periode abrufen von XXXX_API-API
        XXXX_API_metadata = x_get_period_balance(XXXX_API_token, year, month)["_embedded"]["content"]

        # Suche XXXX-Key in dem Kostensalden-Objekt und erstelle mir daraus einen DataFrame
        XXXX_API_metadata_filtered = list(filter(lambda obj: obj['XXXXKey'], XXXX_API_metadata))
        XXXX_API_metadata_filtered_df = pd.DataFrame(XXXX_API_metadata_filtered, index=list(range(len(XXXX_API_metadata_filtered))))
        XXXX_API_metadata_filtered_df.rename(columns={'XXXXKey': 'KEY'}, inplace=True)
        XXXX_API_metadata_filtered_df = XXXX_API_metadata_filtered_df[["KEY"]]
        XXXX_API_metadata_filtered_df = XXXX_API_metadata_filtered_df.astype("string")

        # XXXX-Keys aus beiden Tabellen zusammenbringen und nur Unique XXXX-Keys behalten
        all_XXXX_keys_for_period = pd.concat([XXXX_API_metadata_filtered_df, total_usage_table]).drop_duplicates(
            subset="KEY")

        # Unique XXXX-Keys von TABLE2-Tabelle einlesen
        content_table = pd.read_sql_query("SELECT DISTINCT [KEY] FROM [TABLE2]", cnxn)

        # Nur XXXX-Keys behalten, welche noch nicht in der TABLE2-Tabelle stehen
        missing_XXXX_keys = all_XXXX_keys_for_period[
            ~all_XXXX_keys_for_period["KEY"].isin(content_table["KEY"])][
            "KEY"].dropna().to_frame()
        missing_XXXX_keys = missing_XXXX_keys.reset_index(drop=True)
        print("Es wurden " + str(
            len(missing_XXXX_keys.index)) + " XXXX-Keys gefunden, welche noch nicht in der TABLE2-Tabelle stehen. Trage neue XXXX-Keys in Datenbank ein...")

        # Gehe Zeilen durch
        for index, row in missing_XXXX_keys.iterrows():
            # XXXX-Key einlesen, wenn kein XXXX-Key vorhanden, wird diese Zeile übersprungen
            if row["KEY"] != "no_XXXXKey":
                XXXX_key = row["KEY"]
            else:
                error_counter += 1
                continue

            try:
                XXXX_API_metadata = XXXX_API_get_metadata(XXXX_API_token, int(XXXX_key))
            except json.JSONDecodeError:
                XXXX_API_token = get_new_XXXX_API_token()
                XXXX_API_metadata = XXXX_API_get_metadata(XXXX_API_token, int(XXXX_key))
            except Exception as e:
                raise Exception('Fehler beim Abruf der XXXX_API-Metadaten (Fehler: ' + str(e) + ')')

            if XXXX_API_metadata["XXXXKey"] != 'no_XXXXKey':
                # Data1
                data1 = XXXX_API_metadata["data1"]
                # Data2
                data2 = XXXX_API_metadata["data2"]
                # Data3
                data3 = XXXX_API_metadata["data3"]
                # Data4
                XXXXKeyProperty = XXXX_API_metadata["XXXXKeyProperty"] if XXXX_API_metadata.get("XXXXKeyProperty") else None
                # PropertyData1
                propertydata1 = XXXX_API_metadata["propertyReference"]["data1"] if XXXX_API_metadata.get(
                    "propertyReference") else ''
                # KEYSerie
                XXXXKeydata4 = XXXX_API_metadata["XXXXKeydata4"] if XXXX_API_metadata.get("XXXXKeydata4") else None
                # Data4Data1
                data4data1 = XXXX_API_metadata["data4Reference"]["data1"] if XXXX_API_metadata.get(
                    "data4Reference") else ''
                # KEYStaffel
                XXXXKeydata5 = XXXX_API_metadata["XXXXKeydata5"] if XXXX_API_metadata.get("XXXXKeydata5") else None
                # Data 5
                data6 = XXXX_API_metadata["data6"]
                params = (
                XXXX_key, data1, data2, data3, XXXXKeyProperty, propertydata1, XXXXKeydata4,
                data4data1, XXXXKeydata5, data6)

                try:
                    cursor.execute("""
                    INSERT INTO TABLE2
                    VALUES (?,?,?,?,?,?,?,?,?,?);
                    """, params)
                    success_counter += 1
                except Exception as e:
                    raise Exception('Fehler beim Einfügen einer neuen Zeile (Fehler: ' + str(e) + ')')
            else:
                error_counter += 1
                continue

        # Alle Zeilen commiten und True zurückgeben
        cnxn.commit()
        cnxn.close()
        print('Skript für XXXX ' + period + ' erfolgreich beendet! Es wurden ' + str(success_counter) + ' von '
              + str(len(missing_XXXX_keys.index)) + ' Ergebnisse in die DB geschrieben. ' + str(error_counter)
              + ' Datensätze sind fehlerhaft und wurden nicht in die DB geschrieben.')
        return True

    # Bei Fehler: Skript abbrechen und Exception zurückgeben
    except Exception as e:
        return str(e)


# XXXX für alle Schlüssel für eine Periode aus XXXX_API einzulsen
def x_get_period_balance(XXXX_API_token, year, month):
    print("Warte auf Antwort von XXXX_API-API...")

    url = f"api.com/#" + str(year) + "/" + str(
        month) + "/1/"  # Siehe api.com/#
    api_header = {"Authorization": "Bearer " + XXXX_API_token}
    api_response = requests.get(url, headers=api_header, timeout=60)

    if api_response.status_code != 200:
        raise Exception(
            'Keine gültige Antwort von der XXXX_API-API bei Abruf des XXXXs erhalten (Statuscode: ' + str(
                api_response.status_code) + ')')

    api_response = api_response.json()
    return api_response


# XXXX_API-Token erzeugen
def get_new_XXXX_API_token():
    auth_server_url = f"api.com"
    client_id = os.environ.get("XXXX_API_CLIENT_ID")
    client_secret = os.environ.get("XXXX_API_CLIENT_SECRET")

    token_req_payload = {"grant_type": "client_credentials"}

    token_response = requests.post(
        auth_server_url,
        data=token_req_payload,
        allow_redirects=False,
        auth=(client_id, client_secret))

    if token_response.status_code != 200:
        raise Exception(
            'Keine gültige Antwort von der XXXX_API-API bei der Erstellung des Tokens erhalten (Statuscode: ' + str(
                token_response.status_code) + ')')

    tokens = json.loads(token_response.text)
    return tokens["access_token"]


# TABLE2 von XXXX-Key per XXXX_API abfragen
def XXXX_API_get_metadata(XXXX_API_token, XXXX_key):
    url = f"https://api.cpm/" + str(XXXX_key)
    api_header = {"Authorization": "Bearer " + XXXX_API_token}
    api_response = requests.get(url, headers=api_header, verify=True)

    if api_response.status_code == 404:
        return {"XXXXKey": "no_XXXXKey"}

    if api_response.status_code != 200 and api_response.status_code != 401:
        raise Exception('Keine gültige Antwort von der XXXX_API-API bei Abruf des XXXX-Keys erhalten (Statuscode: ' + str(
            api_response.status_code) + ')')

    api_response = api_response.json()
    return api_response


# Mit Datenbank verbinden
def connecting_database():
    server = 'DWH'
    database = 'XXXX'
    username = os.environ.get("DATABASE_USER")
    password = os.environ.get("DATABASE_PW")
    return pyodbc.connect(
        'DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';UID=' + username + ';PWD=' + password)


if __name__ == "__main__":
    main()