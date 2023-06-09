# Survey Slackbot

### Description

##### survey-slackbot

The survey-slackbot folder contains a Python-based demo project that allows you to send weekly survey questions to members of a Slack channel using AWS Lambda and a cron job. This project demonstrates the functionality of integrating with the Slack API and automating survey distribution.

#### slackbot-api

The slackbot-api folder contains a Node.js-based demo project that complements the survey-slackbot app. This component is responsible for handling survey answers submitted by Slack users and storing them in a database. It is built using AWS API Gateway and showcases the process of receiving and processing data from Slack via a custom API.The responses are stored in a MongoDB databse and a new Slackbot message block with the updated message ("You answered this question") is sent back to the user.
