#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
PID_FILE="$SCRIPT_DIR/backend.pid"
LOG_FILE="$SCRIPT_DIR/backend.log"
VENV_DIR="$SCRIPT_DIR/../.venv"
PORT=8998

start() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            echo "后端服务已在运行 (PID: $PID)"
            return 0
        fi
        rm -f "$PID_FILE"
    fi

    if [ ! -d "$VENV_DIR" ]; then
        echo "错误: 虚拟环境不存在 ($VENV_DIR)"
        return 1
    fi

    cd "$SCRIPT_DIR"
    nohup "$VENV_DIR/bin/python" -m uvicorn main:app --host 0.0.0.0 --port $PORT > "$LOG_FILE" 2>&1 &
    PID=$!
    echo "$PID" > "$PID_FILE"

    sleep 2
    if kill -0 "$PID" 2>/dev/null; then
        echo "后端服务启动成功 (PID: $PID, 端口: $PORT)"
    else
        echo "后端服务启动失败，请查看日志: $LOG_FILE"
        rm -f "$PID_FILE"
        return 1
    fi
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "后端服务未运行"
        return 0
    fi

    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "停止后端服务 (PID: $PID)..."
        kill "$PID" 2>/dev/null
        sleep 2
        if kill -0 "$PID" 2>/dev/null; then
            kill -9 "$PID" 2>/dev/null
        fi
        rm -f "$PID_FILE"
        echo "后端服务已停止"
    else
        echo "后端服务已停止，但PID文件仍存在，清理中..."
        rm -f "$PID_FILE"
    fi
}

status() {
    if [ ! -f "$PID_FILE" ]; then
        echo "后端服务: 未运行"
        return 0
    fi

    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
        echo "后端服务: 运行中 (PID: $PID, 端口: $PORT)"
        echo "日志文件: $LOG_FILE"
    else
        echo "后端服务: 已停止 (PID文件存在但进程不存在)"
        rm -f "$PID_FILE"
    fi
}

restart() {
    stop
    sleep 1
    start
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    restart)
        restart
        ;;
    *)
        echo "用法: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac
