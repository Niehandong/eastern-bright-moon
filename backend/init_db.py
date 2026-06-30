import asyncio
from utils.config import settings
from sqlalchemy.ext.asyncio import create_async_engine
from utils.session import Base
from models.user import User
from utils.security import get_password_hash

async def init_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    from utils.session import SessionLocal
    async with SessionLocal() as session:
        admin = User(id=1, username='admin', hashed_password=get_password_hash('admin'), is_active=True)
        session.add(admin)
        await session.commit()
        print('Database initialized with admin user')

if __name__ == '__main__':
    asyncio.run(init_db())
