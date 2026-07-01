from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text
from typing import Optional
import uuid
from utils.session import Base
from utils.mixins import TimestampMixin

class MoonPhase(Base, TimestampMixin):
    __tablename__ = "moon_phases"
    __table_args__ = {"comment": "月相美学与自省行动指导数据表"}

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), comment="月相阶段唯一标识ID(UUID)")
    name: Mapped[str] = mapped_column(String(100), nullable=False, comment="月相中文名称")
    english_name: Mapped[str] = mapped_column(String(100), nullable=False, comment="月相英文名称")
    keywords: Mapped[str] = mapped_column(String(255), nullable=False, comment="月相核心关键字词")
    suitable: Mapped[str] = mapped_column(String(255), nullable=False, comment="月相适宜推行整理行动")
    tip: Mapped[str] = mapped_column(Text, nullable=False, comment="写给自己的自省月相寄语/Tip")
    image_url: Mapped[str] = mapped_column(String(500), nullable=False, comment="月相美学配图存储链接/外链")
    sort_order: Mapped[int] = mapped_column(default=0, comment="月相默认在月轮周期中的展示排序权重(0-7)")
