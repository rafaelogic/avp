from tiktok_api import TikTokAPI
import os

def upload_video(video_path, title):
    # This function requires you to have a TikTok session ID. You can get this
    # by logging into TikTok in your browser and copying the value of the
    # "sessionid" cookie.
    session_id = os.environ.get("TIKTOK_SESSION_ID")

    if not session_id:
        raise Exception("TIKTOK_SESSION_ID environment variable not set.")

    api = TikTokAPI(session_id=session_id)
    video = api.upload_video(video_path, caption=title)
    return video
