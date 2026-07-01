from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Text, String
import uuid
from utils.session import Base
from utils.mixins import TimestampMixin

class ZenQuote(Base, TimestampMixin):
    __tablename__ = "zen_quotes"
    __table_args__ = {"comment": "禅意侘寂哲学名言名句语录表"}

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), comment="语录唯一标识ID(UUID)")
    text: Mapped[str] = mapped_column(Text, nullable=False, comment="侘寂语录正文内容")
    author: Mapped[str] = mapped_column(String(100), default="匿名", comment="语录原作者或古籍出处")
