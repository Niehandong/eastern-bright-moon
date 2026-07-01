from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, String, Date
from typing import Optional
import datetime
import uuid
from utils.session import Base
from utils.mixins import TimestampMixin

class ExhibitionReview(Base, TimestampMixin):
    __tablename__ = "exhibition_reviews"
    __table_args__ = {"comment": "艺术空间/画廊展览看展点评手记表"}

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), comment="展览点评唯一标识ID(UUID)")
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="展评文章主标题")
    subtitle: Mapped[Optional[str]] = mapped_column(String(255), comment="展评文章副标题")
    artist: Mapped[Optional[str]] = mapped_column(String(100), comment="参展艺术家名称/联展主旨")
    gallery_name: Mapped[Optional[str]] = mapped_column(String(255), comment="美术馆/画廊等展览地点空间名称")
    date: Mapped[Optional[datetime.date]] = mapped_column(Date, comment="看展或撰写发布日期")
    rating: Mapped[float] = mapped_column(default=5.0, comment="展览推荐评分指数(0.0-5.0)")
    review_text: Mapped[str] = mapped_column(Text, nullable=False, comment="展评详细体验感受多段文字")
    poster_url: Mapped[Optional[str]] = mapped_column(String(500), comment="展览官方实体海报图链接")
