import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

def upload_video(video_path, title, description):
    # This function requires you to have a client_secrets.json file in the
    # same directory. You can get this file by creating a new project in the
    # Google Cloud Console and enabling the YouTube Data API v3.
    flow = InstalledAppFlow.from_client_secrets_file(
        "client_secrets.json",
        scopes=["https://www.googleapis.com/auth/youtube.upload"],
    )
    credentials = flow.run_local_server()
    youtube = build("youtube", "v3", credentials=credentials)

    request_body = {
        "snippet": {
            "title": title,
            "description": description,
        },
        "status": {
            "privacyStatus": "private",
        },
    }

    media_file = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=video_path,
    )

    response = media_file.execute()
    return response
