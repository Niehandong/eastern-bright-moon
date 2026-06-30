import asyncio
import datetime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select, inspect

from utils.session import Base
from models.user import User
from models.bio import PersonalBio
from models.photo import PhotoItem, FootprintItem
from models.quote import ZenQuote
from models.moon_phase import MoonPhase
from models.exhibition import ExhibitionReview
from models.issue import ColumnIssue, ColumnArticle

MYSQL_URL = "mysql+aiomysql://niehandong:niehandong@dev.pawstickchief.com:8002/eastern"
PG_URL = "postgresql+asyncpg://niehandong:niehandong@east:15432/eastern"

def convert_date(value):
    if isinstance(value, str) and value:
        try:
            return datetime.datetime.strptime(value, '%Y-%m-%d').date()
        except ValueError:
            try:
                return datetime.datetime.strptime(value, '%Y/%m/%d').date()
            except ValueError:
                return None
    return value

async def migrate_table(src_session, dst_session, model):
    table_name = model.__tablename__
    print(f"Migrating {table_name}...")
    
    result = await src_session.execute(select(model))
    rows = result.scalars().all()
    
    if not rows:
        print(f"  No data in {table_name}")
        return 0
    
    count = 0
    mapper = inspect(model)
    
    for row in rows:
        data = {}
        for col in mapper.column_attrs:
            value = getattr(row, col.key)
            if col.columns[0].type.__class__.__name__ == 'Date':
                value = convert_date(value)
            data[col.key] = value
        new_obj = model(**data)
        dst_session.add(new_obj)
        count += 1
    
    await dst_session.commit()
    print(f"  Migrated {count} rows")
    return count

async def main():
    print("Connecting to MySQL (source)...")
    src_engine = create_async_engine(MYSQL_URL, echo=False)
    src_session_factory = async_sessionmaker(bind=src_engine, class_=AsyncSession)
    
    print("Connecting to PostgreSQL (destination)...")
    dst_engine = create_async_engine(PG_URL, echo=False)
    dst_session_factory = async_sessionmaker(bind=dst_engine, class_=AsyncSession)
    
    print("Dropping existing tables in PostgreSQL...")
    async with dst_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    
    print("Creating tables in PostgreSQL...")
    async with dst_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("Starting data migration...")
    total_rows = 0
    
    async with src_session_factory() as src_session, dst_session_factory() as dst_session:
        tables = [
            User,
            PersonalBio,
            PhotoItem,
            FootprintItem,
            ZenQuote,
            MoonPhase,
            ExhibitionReview,
            ColumnIssue,
            ColumnArticle,
        ]
        
        for model in tables:
            count = await migrate_table(src_session, dst_session, model)
            total_rows += count
    
    await src_engine.dispose()
    await dst_engine.dispose()
    
    print(f"\nMigration completed! Total rows migrated: {total_rows}")

if __name__ == '__main__':
    asyncio.run(main())