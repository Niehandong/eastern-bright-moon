# 汇集所有模型以便 Alembic 能够自动发现
from utils.session import Base
from models.user import User
from models.bio import PersonalBio
from models.issue import ColumnIssue, ColumnArticle
from models.exhibition import ExhibitionReview
from models.photo import PhotoItem, FootprintItem
from models.quote import ZenQuote
from models.moon_phase import MoonPhase
