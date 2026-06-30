from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, String, Date
from typing import Optional
import datetime
from utils.session import Base

class PhotoItem(Base):
    __tablename__ = "photo_items"
    __table_args__ = {"comment": "镜头光影画廊原创摄影作品表"}

    id: Mapped[str] = mapped_column(String(100), primary_key=True, comment="摄影作品唯一标识ID")
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="摄影作品艺术标题")
    category: Mapped[str] = mapped_column(String(100), nullable=False, comment="摄影所属分类过滤标签(如草木/景观/城市)")
    location: Mapped[Optional[str]] = mapped_column(String(255), comment="拍摄具体地理位置")
    date: Mapped[Optional[datetime.date]] = mapped_column(Date, comment="拍摄/冲洗发布日期")
    image_url: Mapped[str] = mapped_column(String(500), nullable=False, comment="作品原片高清图片存储链接")
    description: Mapped[Optional[str]] = mapped_column(Text, comment="作品配套的诗意配文/摄影感言")

class FootprintItem(Base):
    __tablename__ = "footprint_items"
    __table_args__ = {"comment": "寰宇足迹旅行定点地图坐标表"}

    id: Mapped[str] = mapped_column(String(100), primary_key=True, comment="足迹标点唯一标识ID")
    city: Mapped[str] = mapped_column(String(100), nullable=False, comment="目的地城市中文名称")
    city_en: Mapped[Optional[str]] = mapped_column(String(100), comment="目的地城市英文翻译名")
    country: Mapped[str] = mapped_column(String(100), nullable=False, comment="目的地所属国家/政区名称")
    location: Mapped[Optional[str]] = mapped_column(String(255), comment="具体名胜古迹或旅程地标")
    x: Mapped[float] = mapped_column(nullable=False, comment="地图背景中相对横向百分比坐标X(0-100)")
    y: Mapped[float] = mapped_column(nullable=False, comment="地图背景中相对纵向百分比坐标Y(0-100)")
    date: Mapped[Optional[datetime.date]] = mapped_column(Date, comment="旅程时间日期标签")
    image_url: Mapped[Optional[str]] = mapped_column(String(500), comment="该足迹精美实景渲染大图链接")
    description: Mapped[Optional[str]] = mapped_column(Text, comment="足迹故事与旅行感悟手记")
    region: Mapped[str] = mapped_column(String(100), nullable=False, comment="所属中国地理分区/境外国家区域")
