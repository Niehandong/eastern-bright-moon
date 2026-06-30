from pydantic import BaseModel
from typing import List, Optional
import datetime

# Personal Bio
class BioBase(BaseModel):
    name: str
    name_en: Optional[str] = None
    title: Optional[str] = None
    motto: Optional[str] = None
    intro_paragraphs: List[str] = []
    cover_image: Optional[str] = None

class BioRead(BioBase):
    id: int
    class Config:
        from_attributes = True

# Column Article
class ArticleBase(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    date: Optional[str] = None
    content: str
    sort_order: int = 0

class ArticleRead(ArticleBase):
    issue_id: str
    class Config:
        from_attributes = True

# Column Issue
class IssueBase(BaseModel):
    id: str
    title: str
    issue_no: str
    issue_title: str
    subtitle: Optional[str] = None
    date: Optional[datetime.date] = None
    main_image: Optional[str] = None
    summary: Optional[str] = None
    text_content: Optional[str] = None
    wechat_link: Optional[str] = None
    tags: List[str] = []

class IssueRead(IssueBase):
    articles: List[ArticleRead] = []
    class Config:
        from_attributes = True

# Exhibition Review
class ExhibitionBase(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    artist: Optional[str] = None
    gallery_name: Optional[str] = None
    date: Optional[datetime.date] = None
    rating: float = 5.0
    review_text: str
    poster_url: Optional[str] = None

class ExhibitionRead(ExhibitionBase):
    class Config:
        from_attributes = True

# Photo Item
class PhotoBase(BaseModel):
    id: str
    title: str
    category: str
    location: Optional[str] = None
    date: Optional[datetime.date] = None
    image_url: str
    description: Optional[str] = None

class PhotoRead(PhotoBase):
    class Config:
        from_attributes = True

# Footprint Item
class FootprintBase(BaseModel):
    id: str
    city: str
    city_en: Optional[str] = None
    country: str
    location: Optional[str] = None
    x: float
    y: float
    date: Optional[datetime.date] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    region: str

class FootprintRead(FootprintBase):
    class Config:
        from_attributes = True

# Moon Phase
class MoonPhaseBase(BaseModel):
    id: str
    name: str
    english_name: str
    keywords: str
    suitable: str
    tip: str
    image_url: str
    sort_order: int = 0

class MoonPhaseRead(MoonPhaseBase):
    class Config:
        from_attributes = True

# Zen Quote
class QuoteBase(BaseModel):
    id: str
    text: str
    author: str = "匿名"

class QuoteRead(QuoteBase):
    class Config:
        from_attributes = True
