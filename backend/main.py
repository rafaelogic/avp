from fastapi import FastAPI
from pydantic import BaseModel
import os
from . import youtube
from . import facebook
from . import tiktok

from enum import Enum

class VideoType(str, Enum):
    youtube = "youtube"
    short = "short"

class VideoRequest(BaseModel):
    text: str
    video_type: VideoType

class YouTubeUploadRequest(BaseModel):
    video_path: str
    title: str
    description: str

class FacebookUploadRequest(BaseModel):
    video_path: str
    title: str
    description: str

class TikTokUploadRequest(BaseModel):
    video_path: str
    title: str

app = FastAPI()

# You will need to set the RUNWAY_URL and RUNWAY_TOKEN environment variables
# to use a hosted model on Runway.
runway_url = os.environ.get("RUNWAY_URL")
runway_token = os.environ.get("RUNWAY_TOKEN")

@app.post("/generate_video")
async def generate_video(request: VideoRequest):
    import runway
    if not runway_url or not runway_token:
        return {"status": "error", "message": "RUNWAY_URL and RUNWAY_TOKEN environment variables not set."}

    try:
        model = runway.HostedModel(url=runway_url, token=runway_token)
        options = {"prompt": request.text}
        if request.video_type == VideoType.short:
            options["max_duration"] = 60
        output = model.predict(options)
        return {"status": "success", "message": "Video generated successfully", "output": output}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/upload_to_youtube")
async def upload_to_youtube(request: YouTubeUploadRequest):
    try:
        response = youtube.upload_video(request.video_path, request.title, request.description)
        return {"status": "success", "message": "Video uploaded to YouTube successfully", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/upload_to_facebook")
async def upload_to_facebook(request: FacebookUploadRequest):
    try:
        response = facebook.upload_video(request.video_path, request.title, request.description)
        return {"status": "success", "message": "Video uploaded to Facebook successfully", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/upload_to_tiktok")
async def upload_to_tiktok(request: TikTokUploadRequest):
    try:
        response = tiktok.upload_video(request.video_path, request.title)
        return {"status": "success", "message": "Video uploaded to TikTok successfully", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def read_root():
    return {"Hello": "World"}
