from pydantic import BaseModel
from typing import Optional

class VideoTemplate(BaseModel):
    name: str
    font: Optional[str] = None
    color: Optional[str] = None
    style: Optional[str] = None
