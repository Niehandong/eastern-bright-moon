from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from utils.config import settings
from api.auth import router as auth_router
from api.upload import router as upload_router
from api.content import router as content_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="东方朗月 (Eastern Bright Moon) 全栈系统后端接口 API",
    version="1.0.0",
)

if settings.BACKEND_CORS_ORIGINS:
    if settings.DEBUG:
        # 调试模式：通过正则表达式动态允许任何 HTTP/HTTPS 来源跨域，同时支持 credentials 携带
        app.add_middleware(
            CORSMiddleware,
            allow_origin_regex=r"https?://.*",
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        # 生产模式：严格根据 BACKEND_CORS_ORIGINS 白名单进行校验
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.BACKEND_CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Authentication"])
app.include_router(upload_router, prefix=settings.API_V1_STR, tags=["Upload"])
app.include_router(content_router, prefix=settings.API_V1_STR, tags=["Content"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    # 获取 main.py 文件所在的绝对物理路径，确保无论从哪个工作路径下运行，uvicorn 都能完美定位 main:app 模块
    script_dir = os.path.dirname(os.path.abspath(__file__))
    uvicorn.run("main:app", host="0.0.0.0", port=8998, reload=True, app_dir=script_dir)
