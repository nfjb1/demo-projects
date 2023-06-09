import os
import logging
from slack_bolt import App
from slack_sdk.web import WebClient
import ssl as ssl_lib
import certifi
import requests
from slack_sdk.errors import SlackApiError

logger = logging.getLogger(__name__)
ssl_context = ssl_lib.create_default_context(cafile=certifi.where())

requests.delete(
    os.environ.get("API_URL") + "/drop-old-collections",
    headers={"x-slackbot-token": os.environ.get("SLACK_BOT_TOKEN")},
)

app = App()

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("SLACK_BOT_TOKEN"))


message_block = [
    {"type": "header", "text": {"type": "plain_text", "text": "XXXX"}},
    {"type": "section", "text": {"type": "mrkdwn", "text": "XXX!*"}},
    {"type": "divider"},
    {"type": "header", "text": {"type": "plain_text", "text": "1/3: Frage 1"}},
    {"type": "context", "elements": [{"type": "plain_text", "text": "XXXX"}]},
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "1"},
                "value": "q1_1",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "2"},
                "value": "q1_2",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "3"},
                "value": "q1_3",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "4"},
                "value": "q1_4",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "5"},
                "value": "q1_5",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "6"},
                "value": "q1_6",
            },
        ],
    },
    {"type": "divider"},
    {"type": "header", "text": {"type": "plain_text", "text": "2/3: Frage 2"}},
    {"type": "context", "elements": [{"type": "plain_text", "text": "XXXX"}]},
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "1"},
                "value": "q2_1",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "2"},
                "value": "q2_2",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "3"},
                "value": "q2_3",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "4"},
                "value": "q2_4",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "5"},
                "value": "q2_5",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "6"},
                "value": "q2_6",
            },
        ],
    },
    {"type": "divider"},
    {"type": "header", "text": {"type": "plain_text", "text": "3/3: Frage 3"}},
    {"type": "context", "elements": [{"type": "plain_text", "text": "XXXX"}]},
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "1"},
                "value": "q3_1",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "2"},
                "value": "q3_2",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "3"},
                "value": "q3_3",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "4"},
                "value": "q3_4",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "5"},
                "value": "q3_5",
            },
            {
                "type": "button",
                "text": {"type": "plain_text", "text": "6"},
                "value": "q3_6",
            },
        ],
    },
]


XXXX_channel_id = "XXXX"
channel_members = client.conversations_members(
    token=os.environ["SLACK_BOT_TOKEN"], channel=XXXX_channel_id
)["members"]

for member_id in channel_members:
    try:
        result = client.chat_postMessage(channel=member_id, blocks=message_block)
        logger.info(result)

    except SlackApiError as e:
        logger.error(f"Error posting message: {e}")
