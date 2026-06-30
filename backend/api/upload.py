from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
import uuid
import os
from api.auth import get_current_user
from models.user import User

router = APIRouter()

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
MAX_FILE_SIZE = 10 * 1024 * 1024 

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"仅支持上传以下格式图片: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="上传图片体积不能超过 10MB"
        )
        
    unique_filename = f"{uuid.uuid4()}{extension}"
    
    # 动态获取当前日期，按年-月-日创建子目录
    import datetime
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    target_dir = os.path.join(UPLOAD_DIR, today_str)
    os.makedirs(target_dir, exist_ok=True)
    
    file_path = os.path.join(target_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    image_url = f"/static/uploads/{today_str}/{unique_filename}"
    return {"url": image_url}
