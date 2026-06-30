from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from utils.session import get_db
from api.auth import get_current_user
from models.user import User

from models.bio import PersonalBio
from models.issue import ColumnIssue, ColumnArticle
from models.exhibition import ExhibitionReview
from models.photo import PhotoItem, FootprintItem
from models.quote import ZenQuote
from models.moon_phase import MoonPhase

from schemas.content import (
    BioBase, BioRead,
    IssueBase, IssueRead,
    ArticleBase, ArticleRead,
    ExhibitionBase, ExhibitionRead,
    PhotoBase, PhotoRead,
    FootprintBase, FootprintRead,
    QuoteBase, QuoteRead,
    MoonPhaseBase, MoonPhaseRead
)

router = APIRouter()

# --- 1. PERSONAL BIO ---
@router.get("/bio", response_model=BioRead)
async def get_bio(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PersonalBio))
    bio = result.scalars().first()
    if not bio:
        raise HTTPException(status_code=404, detail="个人信息尚未初始化")
    return bio

@router.put("/admin/bio", response_model=BioRead)
async def update_bio(
    bio_data: BioBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(PersonalBio))
    bio = result.scalars().first()
    if not bio:
        bio = PersonalBio(**bio_data.model_dump())
        db.add(bio)
    else:
        for key, value in bio_data.model_dump().items():
            setattr(bio, key, value)
    await db.commit()
    await db.refresh(bio)
    return bio

# --- 2. COLUMN ISSUES ---
@router.get("/issues", response_model=List[IssueRead])
async def get_issues(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ColumnIssue).options(selectinload(ColumnIssue.articles)))
    return result.scalars().all()

@router.get("/issues/{id}", response_model=IssueRead)
async def get_issue_by_id(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ColumnIssue).filter(ColumnIssue.id == id).options(selectinload(ColumnIssue.articles)))
    issue = result.scalars().first()
    if not issue:
        raise HTTPException(status_code=404, detail="期刊未找到")
    return issue

@router.post("/admin/issues", response_model=IssueRead)
async def create_issue(
    issue_data: dict,  # 采用 dict 承载，提供极致灵活性以支持 articles 级联数组的无缝映射
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import delete
    import time
    
    # 1. 抽离级联的目录文章/目录列表数据
    articles_data = issue_data.pop("articles", [])
    
    # 2. 格式化标签字段 (如果传入的是逗号分隔的字符串，自动转为 List)
    tags = issue_data.get("tags")
    if isinstance(tags, str):
        issue_data["tags"] = [t.strip() for t in tags.split(",") if t.strip()]
    elif tags is None:
        issue_data["tags"] = []
        
    issue_id = issue_data.get("id")
    if not issue_id:
        issue_id = f"issue-{int(time.time())}"
        issue_data["id"] = issue_id
        
    # 3. 智能判断：新增 (Insert) 还是 修改 (Update) 期刊主表
    result = await db.execute(select(ColumnIssue).filter(ColumnIssue.id == issue_id))
    db_issue = result.scalars().first()
    
    if db_issue:
        # 修改：覆盖现有字段
        for k, v in issue_data.items():
            setattr(db_issue, k, v)
    else:
        # 新增：创建主条目
        db_issue = ColumnIssue(**issue_data)
        db.add(db_issue)
        
    # 保证数据库会话中已持有该期刊条目及其 ID
    await db.flush()
    
    # 4. 同步更新下级目录文章：先原子清空当前期刊的所有旧目录文章，再整体填装最新拓展的列表
    await db.execute(delete(ColumnArticle).filter(ColumnArticle.issue_id == db_issue.id))
    
    for idx, art in enumerate(articles_data):
        db_art = ColumnArticle(
            id=art.get("id") or f"article-{db_issue.id}-{idx}-{int(time.time())}",
            issue_id=db_issue.id,
            title=art.get("title", "未命名目录"),
            subtitle=art.get("subtitle", ""),
            date=art.get("date") or db_issue.date,
            content=art.get("content", ""),
            sort_order=int(art.get("sort_order") or idx)
        )
        db.add(db_art)
        
    # 5. 提交原子事务并重载
    try:
        await db.commit()
        # 利用 selectinload 级联加载出最新更新的所有关联文章列表
        reload_result = await db.execute(
            select(ColumnIssue)
            .filter(ColumnIssue.id == db_issue.id)
            .options(selectinload(ColumnIssue.articles))
        )
        db_issue = reload_result.scalars().first()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=f"保存期刊级联目录失败: {str(e)}")
        
    return db_issue

# --- 3. COLUMN ARTICLES ---
@router.post("/admin/articles", response_model=ArticleRead)
async def create_article(
    art_data: ArticleBase,
    issue_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    issue_result = await db.execute(select(ColumnIssue).filter(ColumnIssue.id == issue_id))
    if not issue_result.scalars().first():
        raise HTTPException(status_code=404, detail="关联期刊未找到")
    db_art = ColumnArticle(**art_data.model_dump(), issue_id=issue_id)
    db.add(db_art)
    await db.commit()
    await db.refresh(db_art)
    return db_art

# --- 4. EXHIBITION REVIEWS ---
@router.get("/exhibitions", response_model=List[ExhibitionRead])
async def get_exhibitions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ExhibitionReview))
    return result.scalars().all()

@router.post("/admin/exhibitions", response_model=ExhibitionRead)
async def create_exhibition(
    ex_data: ExhibitionBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_ex = ExhibitionReview(**ex_data.model_dump())
    db_ex = await db.merge(db_ex)
    await db.commit()
    await db.refresh(db_ex)
    return db_ex

# --- 5. PHOTO ITEMS ---
@router.get("/photos", response_model=List[PhotoRead])
async def get_photos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PhotoItem))
    return result.scalars().all()

@router.post("/admin/photos", response_model=PhotoRead)
async def create_photo(
    p_data: PhotoBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_p = PhotoItem(**p_data.model_dump())
    db_p = await db.merge(db_p)
    await db.commit()
    await db.refresh(db_p)
    return db_p

# --- 6. FOOTPRINTS ---
@router.get("/footprints", response_model=List[FootprintRead])
async def get_footprints(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FootprintItem))
    return result.scalars().all()

@router.post("/admin/footprints", response_model=FootprintRead)
async def create_footprint(
    fp_data: FootprintBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_fp = FootprintItem(**fp_data.model_dump())
    db_fp = await db.merge(db_fp)
    await db.commit()
    await db.refresh(db_fp)
    return db_fp

# --- DELETE ENDPOINTS ---
@router.delete("/admin/issues/{id}")
async def delete_issue(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(ColumnIssue).filter(ColumnIssue.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="期刊未找到")
    await db.delete(item)
    await db.commit()
    return {"status": "ok", "message": "期刊已成功删除"}

@router.delete("/admin/exhibitions/{id}")
async def delete_exhibition(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(ExhibitionReview).filter(ExhibitionReview.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="展评未找到")
    await db.delete(item)
    await db.commit()
    return {"status": "ok", "message": "展评已成功删除"}

@router.delete("/admin/photos/{id}")
async def delete_photo(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(PhotoItem).filter(PhotoItem.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="作品未找到")
    await db.delete(item)
    await db.commit()
    return {"status": "ok", "message": "作品已成功删除"}

@router.delete("/admin/footprints/{id}")
async def delete_footprint(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(FootprintItem).filter(FootprintItem.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="足迹未找到")
    await db.delete(item)
    await db.commit()
    return {"status": "ok", "message": "足迹已成功删除"}

@router.delete("/admin/moon-phases/{id}")
async def delete_moon_phase(
    id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(MoonPhase).filter(MoonPhase.id == id))
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="月相阶段未找到")
    await db.delete(item)
    await db.commit()
    return {"status": "ok", "message": "月相阶段已成功删除"}



# --- 8. ZEN QUOTES ---
@router.get("/quotes", response_model=List[QuoteRead])
async def get_quotes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ZenQuote))
    return result.scalars().all()

@router.post("/admin/quotes", response_model=QuoteRead)
async def create_quote(
    q_data: QuoteBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_q = ZenQuote(**q_data.model_dump())
    db.add(db_q)
    await db.commit()
    await db.refresh(db_q)
    return db_q

# --- 9. MOON PHASES ---
@router.get("/moon-phases", response_model=List[MoonPhaseRead])
async def get_moon_phases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MoonPhase).order_by(MoonPhase.sort_order.asc()))
    return result.scalars().all()

@router.post("/admin/moon-phases", response_model=MoonPhaseRead)
async def create_moon_phase(
    mp_data: MoonPhaseBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_mp = MoonPhase(**mp_data.model_dump())
    db_mp = await db.merge(db_mp)
    await db.commit()
    await db.refresh(db_mp)
    return db_mp
