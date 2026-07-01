"""
统一响应信封 (Unified Response Envelope)

所有 /api 接口一律返回 HTTP 200，通过响应体的 code 区分成败：
  成功 -> {"code": 200, "message": "success", "data": <数据>}
  失败 -> {"code": -1,  "message": "<报错信息>", "data": null}

前端只需判断：fetch 本身抛错 = 网络问题；否则一律看 code。

用法（在 main.py 中）::

    from utils.response import register_unified_response
    register_unified_response(app, settings.API_V1_STR)

注意：register_unified_response 必须在注册 CORS 之前调用，从而让本中间件
位于 CORS 内层，保证重建响应后 CORS 仍能为其补充跨域响应头。
"""
import json
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def envelope(code: int, message: str, data=None) -> dict:
    """构造统一信封结构。"""
    return {"code": code, "message": message, "data": data}


def _is_enveloped(payload) -> bool:
    """判断 payload 是否已是信封结构，避免二次包装。"""
    return (
        isinstance(payload, dict)
        and "code" in payload
        and "message" in payload
        and "data" in payload
    )


def register_unified_response(app: FastAPI, api_prefix: str) -> None:
    """为 app 注册「成功响应包装中间件 + 全局异常处理器」。

    :param app: FastAPI 应用实例
    :param api_prefix: 需要信封化的接口前缀（如 ``/api``）；其余路径
                       （/docs、/openapi.json、/static、根路由等）原样放行。
    """

    @app.middleware("http")
    async def envelope_success_response(request: Request, call_next):
        response = await call_next(request)

        # 仅包装 API 接口；放行文档、静态资源、根路由等
        if not request.url.path.startswith(api_prefix):
            return response
        # 已由异常处理器包装过的响应（带标记）直接放行，避免二次包装
        if response.headers.get("X-Enveloped") == "1":
            return response
        if "application/json" not in response.headers.get("content-type", ""):
            return response

        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        try:
            payload = json.loads(body) if body else None
        except Exception:
            # 理论上不会发生：非 JSON 内容原样返回
            return Response(
                content=body,
                status_code=response.status_code,
                media_type=response.headers.get("content-type"),
            )

        wrapped = payload if _is_enveloped(payload) else envelope(200, "success", payload)
        return JSONResponse(status_code=200, content=wrapped)

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        # 业务/逻辑报错（含手动 raise HTTPException）：code=-1，message 即对应报错文字
        message = exc.detail if isinstance(exc.detail, str) else "请求失败"
        return JSONResponse(
            status_code=200,
            content=envelope(-1, message),
            headers={"X-Enveloped": "1"},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # 请求参数校验失败
        try:
            first = exc.errors()[0]
            loc = ".".join(str(x) for x in first.get("loc", []) if x != "body")
            detail = first.get("msg", "参数不合法")
            message = f"参数校验失败：{loc} {detail}".strip()
        except Exception:
            message = "参数校验失败"
        return JSONResponse(
            status_code=200,
            content=envelope(-1, message),
            headers={"X-Enveloped": "1"},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        # 未预期的服务器异常：不向前端泄露堆栈，完整错误写入日志
        logger.exception("未捕获的服务器异常: %s", exc)
        return JSONResponse(
            status_code=200,
            content=envelope(-1, "服务器内部错误，请稍后重试"),
            headers={"X-Enveloped": "1"},
        )
