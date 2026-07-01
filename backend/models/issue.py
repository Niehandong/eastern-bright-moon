from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Text, JSON, String, Date
from typing import List, Optional
import datetime
from utils.session import Base

class ColumnIssue(Base):
    __tablename__ = "column_issues"
    __table_args__ = {"comment": "遇见世界独立美学电子期刊杂志表"}

    id: Mapped[str] = mapped_column(String(100), primary_key=True, comment="期刊唯一标识ID(如issue-1)")
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="杂志主刊大栏目名称")
    issue_no: Mapped[str] = mapped_column(String(100), nullable=False, comment="期刊编号期数(如第一期)")
    issue_title: Mapped[str] = mapped_column(String(100), nullable=False, comment="期刊专属美学主题名(如朔)")
    subtitle: Mapped[Optional[str]] = mapped_column(String(255), comment="期刊副标题副说明")
    date: Mapped[Optional[datetime.date]] = mapped_column(Date, comment="出版/发布时间日期")
    main_image: Mapped[Optional[str]] = mapped_column(String(500), comment="期刊大封面海报图链接")
    summary: Mapped[Optional[str]] = mapped_column(Text, comment="期刊摘要导读文本")
    text_content: Mapped[Optional[str]] = mapped_column(Text, comment="期刊详细前言序言/序诗")
    wechat_link: Mapped[Optional[str]] = mapped_column(String(500), comment="微信公众号关联版块外链")
    tags: Mapped[Optional[List[str]]] = mapped_column(JSON, comment="期刊核心标签关键字数组")
    
    articles: Mapped[List["ColumnArticle"]] = relationship("ColumnArticle", back_populates="issue", cascade="all, delete-orphan")

class ColumnArticle(Base):
    __tablename__ = "column_articles"
    __table_args__ = {"comment": "期刊下级联发布的具体文章正文表"}

    id: Mapped[str] = mapped_column(String(100), primary_key=True, comment="文章唯一标识ID")
    issue_id: Mapped[str] = mapped_column(String(100), ForeignKey("column_issues.id", ondelete="CASCADE"), nullable=False, comment="所属期刊ID外键")
    title: Mapped[str] = mapped_column(String(255), nullable=False, comment="文章主标题")
    subtitle: Mapped[Optional[str]] = mapped_column(String(255), comment="文章副标题")
    date: Mapped[Optional[datetime.date]] = mapped_column(Date, comment="文章撰写发布日期")
    content: Mapped[str] = mapped_column(Text, nullable=False, comment="文章多段落/富文本详细内容")
    sort_order: Mapped[int] = mapped_column(default=0, comment="文章在期刊内的展示排序权重")
    
    issue: Mapped["ColumnIssue"] = relationship("ColumnIssue", back_populates="articles")
