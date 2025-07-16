from apscheduler.schedulers.background import BackgroundScheduler
from . import youtube
from . import facebook
from . import tiktok

class Scheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.scheduler.start()

    def schedule_post(self, platform, video_path, title, description, post_time):
        if platform == "youtube":
            self.scheduler.add_job(
                youtube.upload_video,
                "date",
                run_date=post_time,
                args=[video_path, title, description],
            )
        elif platform == "facebook":
            self.scheduler.add_job(
                facebook.upload_video,
                "date",
                run_date=post_time,
                args=[video_path, title, description],
            )
        elif platform == "tiktok":
            self.scheduler.add_job(
                tiktok.upload_video,
                "date",
                run_date=post_time,
                args=[video_path, title],
            )
        else:
            raise Exception("Invalid platform")

scheduler = Scheduler()
