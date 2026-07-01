from datetime import datetime
from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """为模型提供带时区的创建/修改时间。

    created_at: 插入时由数据库 now() 生成。
    updated_at: 插入时生成；每次 ORM UPDATE 时 onupdate 自动刷新。
    """
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, comment="创建时间(UTC)"
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False, comment="最后修改时间(UTC)"
    )
