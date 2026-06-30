from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from utils.session import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"comment": "系统后台安全管理员账户表"}

    id: Mapped[int] = mapped_column(primary_key=True, index=True, comment="自增主键ID")
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False, comment="管理员唯一登录账户名")
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False, comment="bcrypt哈希加密后的安全密码密文")
    is_active: Mapped[bool] = mapped_column(default=True, comment="账户是否激活启用")
