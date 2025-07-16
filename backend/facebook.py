import facebook
import os

def upload_video(video_path, title, description):
    # This function requires you to have a Facebook App and a Page Access Token.
    # You can get these by creating a new app on the Facebook for Developers
    # website.
    access_token = os.environ.get("FACEBOOK_ACCESS_TOKEN")
    page_id = os.environ.get("FACEBOOK_PAGE_ID")

    if not access_token or not page_id:
        raise Exception("FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID environment variables not set.")

    graph = facebook.GraphAPI(access_token)
    with open(video_path, "rb") as video_file:
        response = graph.put_video(
            video_file,
            description=description,
            title=title,
        )
    return response
