from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import jwt
from datetime import datetime, timezone
from utils.config import settings
from utils.session import get_db
from utils.redis import get_redis
from utils.security import verify_password, create_access_token, get_password_hash
from models.user import User
from schemas.user import PasswordUpdate

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

@router.post("/auth/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).filter(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码不正确",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="账户未激活")
        
    access_token = create_access_token(subject=user.username)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    redis = Depends(get_redis)
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        exp = payload.get("exp")
        # 计算 Token 剩余有效期 (TTL)
        now = int(datetime.now(timezone.utc).timestamp())
        ttl = exp - now
        if ttl > 0:
            # 将 Token 签名拉黑并存入 Redis
            await redis.set(f"blacklist:{token}", "1", ex=ttl)
    except jwt.PyJWTError:
        pass
    return {"detail": "注销成功"}

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis)
) -> User:
    # 优先检测 Token 是否在 Redis 黑名单中
    is_blacklisted = await redis.get(f"blacklist:{token}")
    if is_blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="登录凭证已失效",
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="无效的登录凭证")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="无效的登录凭证")
        
    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")
    return user


@router.put("/auth/password")
async def update_password(
    data: PasswordUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
    redis = Depends(get_redis)
):
    # 1. 校验旧密码是否匹配
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="旧密码输入不正确"
        )
        
    # 2. 校验新密码是否与旧密码完全一致
    if verify_password(data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="新密码不能与旧密码相同"
        )
        
    # 3. 生成新密码哈希并入库
    current_user.hashed_password = get_password_hash(data.new_password)
    await db.commit()
    
    # 4. 吊销当前 JWT 令牌 (存入 Redis 拉黑)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        exp = payload.get("exp")
        if exp is not None:
            now = int(datetime.now(timezone.utc).timestamp())
            ttl = exp - now
            if ttl > 0:
                await redis.set(f"blacklist:{token}", "1", ex=ttl)
    except jwt.PyJWTError:
        pass
        
    return {"detail": "密码修改成功，登录凭证已安全失效，请重新登录"}

