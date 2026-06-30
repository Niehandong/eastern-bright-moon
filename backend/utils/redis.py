import redis.asyncio as aioredis
from utils.config import settings

# 模块加载时直接初始化连接池，避免任何并发初始化竞态
redis_client = aioredis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
    decode_responses=True,
    socket_timeout=5.0,           # 设置合理的超时时间，防止网络异常导致请求无限挂起
    socket_connect_timeout=5.0,
    max_connections=50            # 设置连接池上限数
)

async def get_redis():
    return redis_client
