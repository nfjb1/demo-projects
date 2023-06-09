# ETL Skripts

### Description

There are two demo files for ETL-processes in this folder.

#### Demo 1

This Python code imports various libraries and modules including os, sys, requests, json, pandas, pyodbc, and dotenv. The main function serves as the entry point and accepts a period parameter. Within the main function, tasks such as loading environment variables from a .env file, establishing a database connection, generating an API token, retrieving data from an API, filtering and processing the retrieved data, and inserting the processed data into a database table are carried out. The script utilizes pandas dataframes to manipulate and merge data. Lastly, the script provides a summary of the executed tasks and returns a boolean value indicating the success or failure of the script. In summary, this script extracts data from an API, applies transformations, and loads the modified data into a database table.

#### Demo 2

This code retrieves data from Adobe, transforms it, and loads it into a database using libraries like pandas, psycopg2, os, datetime, pymsteams, azure.storage.blob, and dotenv. The main function serves as the entry point, loading environment variables, recording start time, and executing a series of steps. Step 1 connects to an Azure database and downloads a genre lookup table, while Step 2 downloads a datafeed from Azure Blob Storage based on the current and previous day's dates. Step 3 filters and adds genre information to the datafeed using the lookup table. Step 4 processes the datafeed by grouping it based on UserID, adding genres and their counts to the database. Step 5 ranks the genres by count and saves the ranking in the database. The code also handles moving and cleaning up datafeed files, deleting old files, recording end time, logging duration, and sending error messages to Microsoft Teams if exceptions occur.
