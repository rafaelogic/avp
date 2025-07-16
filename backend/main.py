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

from .models import VideoTemplate
from typing import Optional

class VideoRequest(BaseModel):
    text: str
    video_type: VideoType
    template: Optional[str] = None

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

from fastapi import File, UploadFile, Form
from typing import List

from . import subtitles
from .scheduler import scheduler
from datetime import datetime
import openai

class ScriptRequest(BaseModel):
    prompt: str

@app.post("/generate_script")
async def generate_script(request: ScriptRequest):
    try:
        client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes video scripts."},
                {"role": "user", "content": request.prompt},
            ],
        )
        return {"status": "success", "script": response.choices[0].message.content}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class ScheduleRequest(BaseModel):
    platform: str
    video_path: str
    title: str
    description: str
    post_time: datetime

@app.post("/schedule_post")
async def schedule_post(request: ScheduleRequest):
    try:
        scheduler.schedule_post(
            request.platform,
            request.video_path,
            request.title,
            request.description,
            request.post_time,
        )
        return {"status": "success", "message": "Post scheduled successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/generate_video")
async def generate_video(
    text: str = Form(...),
    video_type: VideoType = Form(...),
    template: Optional[str] = Form(None),
    music: Optional[str] = Form(None),
    sound_effect: Optional[str] = Form(None),
    subtitles_enabled: bool = Form(False),
    files: List[UploadFile] = File(...)
):
    import runway
    if not runway_url or not runway_token:
        return {"status": "error", "message": "RUNWAY_URL and RUNWAY_TOKEN environment variables not set."}

    try:
        model = runway.HostedModel(url=runway_url, token=runway_token)
        options = {"prompt": text}
        if video_type == VideoType.short:
            options["max_duration"] = 60
        if template:
            t = next((t for t in templates if t.name == template), None)
            if t:
                options.update(t.dict(exclude_none=True))
        if music:
            options["music"] = music
        if sound_effect:
            options["sound_effect"] = sound_effect

        # Save uploaded files to a temporary directory
        import tempfile
        with tempfile.TemporaryDirectory() as temp_dir:
            for file in files:
                with open(os.path.join(temp_dir, file.filename), "wb") as f:
                    f.write(file.file.read())

            # Add the uploaded files to the options
            options["images"] = [os.path.join(temp_dir, file.filename) for file in files]

            output = model.predict(options)

            if subtitles_enabled:
                subtitle_path = subtitles.generate_subtitles(output["path"])
                # This is a placeholder for adding the subtitles to the video.
                # In a real application, you would need to use a library like
                # ffmpeg to burn the subtitles into the video.
                output["subtitle_path"] = subtitle_path

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

templates = []

@app.post("/templates")
async def create_template(template: VideoTemplate):
    templates.append(template)
    return {"status": "success", "message": "Template created successfully"}

@app.get("/templates")
async def get_templates():
    return templates

@app.get("/analytics")
async def get_analytics():
    return {
        "youtube": {"views": 100, "likes": 10},
        "facebook": {"views": 200, "likes": 20},
        "tiktok": {"views": 300, "likes": 30},
    }

@app.get("/")
def read_root():
    return {"Hello": "World"}
