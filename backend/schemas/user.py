from pydantic import BaseModel, Field

class PasswordUpdate(BaseModel):
    old_password: str = Field(..., description="旧密码")
    new_password: str = Field(..., min_length=8, max_length=50, description="新密码，最少 8 位")
