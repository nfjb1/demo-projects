### Gets data from adobe transforms it and loads it into a database ###

import pandas as pd
import psycopg2
import os
import datetime
import pymsteams
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv
import shutil

####################
# Required env vars:
# AZURE_STORAGE_CONNECTION_STRING
# DB_PASSWORD
# MS_TEAMS_WEBHOOK_URL
####################

def main():
    try:
        # load .env
        load_dotenv()

        start_time = datetime.datetime.now()

        print("Step 1 / 5: Connecting to Azure Database and download genre lookup table")
        genre_lookup_table = get_genre_lookup_table()

        print("Step 2 / 5: Downloading Datafeed from Azure Blob Storage")
        current_date = datetime.datetime.now().strftime("%Y-%m-%d")
        datafeed_date = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")

        datafeed = download_datafeed(datafeed_date)

        # # Optional: Convert Unix Timestamp to Date
        # datafeed["Time"] = pd.to_datetime(datafeed["Time"], unit="s")
        # datafeed["Time"] = datafeed["Time"].dt.strftime("%Y-%m-%d")

        print("Step 3 / 5: Prepare Datafeed by filtering out rows and adding Genre")
        datafeed = prepare_datafeed(datafeed, genre_lookup_table)

        # GroupBy UserID
        datafeed_grouped = datafeed.groupby("UserID")

        print("Step 4 / 5: Going through every UserID and add the genres with their count to the database")
        add_genres_to_db(datafeed_grouped)

        print("Step 5 / 5: Ranking the genres by count and save the ranking in the database")
        # rank_genres()

        move_and_clean_up(datafeed_date)

        delete_old_files(current_date)

        end_time = datetime.datetime.now()
        
        with open("time_logger.txt", "a") as f:
            f.write(str(datetime.datetime.now()) + " - " + str(end_time - start_time) + "\n")


    except Exception as e:
        print("Error:")
        print(e)
        # sendMessageToMSTeams(e)


def sendMessageToMSTeams(message):
		teamsMessage = pymsteams.connectorcard(os.getenv("MS_TEAMS_WEBHOOK_URL"))
		teamsMessage.text("XXXX: Es ist ein Fehler aufgetreten: " + str(message))
		teamsMessage.send()



def get_genre_lookup_table():
    conn = connect_to_db()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, genre FROM XXXX1_classifications")
        XXXX1_table = pd.DataFrame(cursor.fetchall(), columns=["MediaID", "Genre"])
        
        cursor.execute("SELECT id, genre FROM XXXX2_classifications")
        XXXX2_table = pd.DataFrame(cursor.fetchall(), columns=["MediaID", "Genre"])

        return pd.concat([XXXX1_table, XXXX2_table], ignore_index=True)
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()


def download_datafeed(date):
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))
    container_client = blob_service_client.get_container_client("datafeed-genres")
    blob_list = container_client.list_blobs()

    for blob in blob_list:
        print(blob.name)
        if blob.name == f"01-client_data_feed{date}.tsv.gz":
            blob_client = container_client.get_blob_client(blob.name)

    if not blob_client:
            raise Exception(f"No datafeed for {date} found.")

    # download blob to local file
    with open(f"./datafeed/current/01-client_data_feed{date}.tsv.gz", "wb") as download_file:
        download_file.write(blob_client.download_blob().readall())

    # unzip file
    import gzip
    with gzip.open(f"./datafeed/current/01-client_data_feed{date}.tsv.gz", "rb") as f_in:
        with open(f"./datafeed/current/01-client_data_feed{date}.tsv", "wb") as f_out:
            f_out.write(f_in.read())

    # Load datafeed into dataframe, filter by UserID, MediaEvent and MediaID
    return pd.read_csv(f"./datafeed/current/01-client_data_feed{date}.tsv", sep="\t", header=None, names=["Time", "UserID", "SubscriptionID", "MediaEvent", "MediaID"])


def move_and_clean_up(date):
    shutil.move(f"./datafeed/current/01-client_data_feed{date}.tsv", f"./datafeed/archive/01-client_data_feed{date}.tsv")
    os.remove(f"./datafeed/current/01-client_data_feed{date}.tsv.gz")


def delete_old_files(current_date):
    blob_service_client = BlobServiceClient.from_connection_string(os.getenv("AZURE_STORAGE_CONNECTION_STRING"))
    container_client = blob_service_client.get_container_client("datafeed-genres")

    blob_list = container_client.list_blobs()

    current_date = datetime.datetime.strptime(current_date, "%Y-%m-%d")
    date_30_days_ago = current_date - datetime.timedelta(days=30)
    date_30_days_ago = date_30_days_ago.strftime("%Y-%m-%d")
    

    # for blob in blob_list:
    #     if blob.name.startswith("01-client_data_feed") and blob.name[21:31] < date_30_days_ago:
    #         container_client.delete_blob(blob.name)
    #         print("Deleted blob: " + blob.name)


    for file in os.listdir("./datafeed/archive"):
        if file.startswith("01-client_data_feed") and file[21:31] < date_30_days_ago:
            os.remove(os.path.join("./datafeed/archive", file))
            print("Deleted local file: " + file)


def connect_to_db():
    # Load data from Genre_Lookup_Table into dataframe
    conn = psycopg2.connect(
        host="host.url.com",
        port="5432",
        sslmode="require",
        database="x",
        user="x",
        password= os.getenv("DB_PASSWORD")
    )

    return conn


def prepare_datafeed(datafeed, genre_lookup_table):
    # Add "AssetType" and "Genre" columns
    datafeed["AssetType"] = ""
    datafeed["Genre"] = ""

    # Filter out all rows where MediaEvent is NaN and only keep rows where MediaEvent contains "video" or "game" with "start"
    datafeed = datafeed[datafeed["MediaEvent"].notna()]
    datafeed = datafeed[datafeed["MediaEvent"].str.contains("video|game")]
    datafeed = datafeed[datafeed["MediaEvent"].str.contains("start")]

    # Fill column "AssetType" with "video" or "game", depending on the value in column "MediaEvent"
    datafeed.loc[datafeed["MediaEvent"].str.contains("video"), "AssetType"] = "video"
    datafeed.loc[datafeed["MediaEvent"].str.contains("game"), "AssetType"] = "game"

    # Match MediaID with the ones in genre_lookup_table_row and add their genre to the Dataframe. Drop row if MediaID is not in genre_lookup_table_row
    for index, row in datafeed.iterrows():
        genre_lookup_table_row = genre_lookup_table.loc[genre_lookup_table["MediaID"] == row["MediaID"]]


        if genre_lookup_table_row.empty:
            datafeed = datafeed.drop(index)
        elif genre_lookup_table_row["Genre"].values[0] == "None":
            datafeed = datafeed.drop(index)
        else:
            datafeed.loc[index, "Genre"] = genre_lookup_table_row["Genre"].values[0]
    
    return datafeed


def add_genres_to_db(datafeed_grouped):
    conn = connect_to_db()
    cursor = conn.cursor()
    try:
        for name, group in datafeed_grouped:
            # New Dataframe with columns: UserID, AssetType, Genre, Count
            final_genre_count = pd.DataFrame(columns=["UserID", "AssetType", "Genre", "Count"])

            for index, row in group.iterrows():
                genre_list = row["Genre"].split(",")

                # Go through every genre in genre_list
                for genre in genre_list:
                    # Create new row with UserID, AssetType, Genre and Count = 1
                    new_row = pd.DataFrame([[row["UserID"], row["AssetType"], genre, 1]], columns=["UserID", "AssetType", "Genre", "Count"])
                    # Add row to final_genre_count
                    final_genre_count = pd.concat([final_genre_count, new_row], ignore_index=True)

            # Group by Count and sum up the values
            final_genre_count_per_user = final_genre_count.groupby(["UserID", "AssetType", "Genre"]).sum().reset_index()

            # Go through every row in final_genre_count and add it to the database
            for index, row in final_genre_count_per_user.iterrows():
                # Add row to database
                cursor.execute("SELECT * FROM adobe_metadata WHERE mid = %s AND assettype = %s AND genre = %s", (row["UserID"], row["AssetType"], row["Genre"]))
                record = cursor.fetchone()

                if record:
                    try:
                        # If row already exists, add the count to the existing count
                        cursor.execute("UPDATE adobe_metadata SET count = count + %s WHERE mid = %s AND assettype = %s AND genre = %s", (row["Count"], row["UserID"], row["AssetType"], row["Genre"]))
                    except Exception as e:
                        # create a logfile, if an error occurs and write e into it with current timestamp
                        with open("logfile.txt", "a") as logfile:
                            logfile.write(str(datetime.datetime.now()) + " " + str(e) + "\n")
                        pass
                else:
                    try:
                        # If row does not exist, create new row
                        cursor.execute("INSERT INTO adobe_metadata (mid, assettype, genre, count) VALUES (%s, %s, %s, %s)", (row["UserID"], row["AssetType"], row["Genre"], row["Count"]))
                    except Exception as e:
                        # create a logfile, if an error occurs and write e into it with current timestamp
                        with open("logfile.txt", "a") as logfile:
                            logfile.write(str(datetime.datetime.now()) + " " + str(e) + "\n")
                        pass

        conn.commit()

    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

def rank_genres():
    conn = connect_to_db()
    cursor = conn.cursor()
    try:
        # Rank the rows in the "adobe_metadata" table by the "count" column
        cursor.execute("SELECT mid, assettype, genre, count, RANK() OVER (PARTITION BY mid, assettype ORDER BY count DESC) FROM adobe_metadata")

        records = cursor.fetchall()

        # Save the ranking in the "ranking" column
        for row in records:
            cursor.execute("UPDATE adobe_metadata SET ranking = %s WHERE mid = %s AND assettype = %s AND genre = %s", (row[4], row[0], row[1], row[2]))

        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
	main()