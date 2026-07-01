from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import JSON, String
from typing import List, Optional
from utils.session import Base
from utils.mixins import TimestampMixin

class PersonalBio(Base, TimestampMixin):
    __tablename__ = "personal_bio"
    __table_args__ = {"comment": "艺术家个人美学自述简介表"}

    id: Mapped[int] = mapped_column(primary_key=True, index=True, comment="自增主键ID")
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="艺术家中文名称")
    name_en: Mapped[Optional[str]] = mapped_column(String(100), comment="艺术家英文翻译名")
    title: Mapped[Optional[str]] = mapped_column(String(255), comment="主打核心头衔/方向标签")
    motto: Mapped[Optional[str]] = mapped_column(String(255), comment="座右铭诗句/核心宣言")
    intro_paragraphs: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="多段落自我经历介绍的文字数组")
    cover_image: Mapped[Optional[str]] = mapped_column(String(500), comment="自述右侧封面宣传大图链接")
