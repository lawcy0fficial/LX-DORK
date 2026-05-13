#!/usr/bin/env bash

# =========================================================
# LX-DORK AUTO HOST + CLOUDFLARE TUNNEL
# =========================================================

PORT=8080
DIR="$(pwd)"

RED='\033[1;31m'
GREEN='\033[1;32m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${RED}"
echo "██╗     ██╗  ██╗      ██████╗  ██████╗ ██████╗ ██╗  ██╗"
echo "██║     ╚██╗██╔╝      ██╔══██╗██╔═══██╗██╔══██╗██║ ██╔╝"
echo "██║      ╚███╔╝ █████╗██║  ██║██║   ██║██████╔╝█████╔╝ "
echo "██║      ██╔██╗ ╚════╝██║  ██║██║   ██║██╔══██╗██╔═██╗ "
echo "███████╗██╔╝ ██╗      ██████╔╝╚██████╔╝██║  ██║██║  ██╗"
echo "╚══════╝╚═╝  ╚═╝      ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "${NC}"

echo -e "${CYAN}[+] Checking dependencies...${NC}"

# =========================================================
# CHECK PYTHON
# =========================================================

if command -v python3 &>/dev/null; then
    PYTHON="python3"
elif command -v python &>/dev/null; then
    PYTHON="python"
else
    echo -e "${RED}[-] Python not found.${NC}"
    exit 1
fi

# =========================================================
# CHECK CLOUDFLARED
# =========================================================

if ! command -v cloudflared &>/dev/null; then
    echo -e "${YELLOW}[!] cloudflared not installed.${NC}"
    echo
    echo "Install:"
    echo "sudo wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
    echo "sudo dpkg -i cloudflared-linux-amd64.deb"
    exit 1
fi

# =========================================================
# START LOCAL SERVER
# =========================================================

echo -e "${GREEN}[+] Starting local server on port ${PORT}${NC}"

$PYTHON -m http.server $PORT > /dev/null 2>&1 &

SERVER_PID=$!

sleep 2

# =========================================================
# START CLOUDFLARE TUNNEL
# =========================================================

echo -e "${GREEN}[+] Launching Cloudflare tunnel...${NC}"

cloudflared tunnel --url http://localhost:$PORT > cloudflare.log 2>&1 &

CF_PID=$!

sleep 8

# =========================================================
# EXTRACT PUBLIC URL
# =========================================================

URL=$(grep -o 'https://[-0-9a-z]*\.trycloudflare.com' cloudflare.log | head -n 1)

if [ -z "$URL" ]; then
    echo -e "${RED}[-] Failed to retrieve Cloudflare URL.${NC}"
    kill $SERVER_PID 2>/dev/null
    kill $CF_PID 2>/dev/null
    exit 1
fi

# =========================================================
# SUCCESS
# =========================================================

echo
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}        SERVER IS LIVE${NC}"
echo -e "${GREEN}=========================================${NC}"
echo
echo -e "${CYAN}LOCAL:${NC}  http://localhost:$PORT"
echo -e "${CYAN}PUBLIC:${NC} $URL"
echo
echo -e "${YELLOW}Press CTRL+C to stop.${NC}"

# =========================================================
# CLEANUP
# =========================================================

cleanup() {
    echo
    echo -e "${RED}[+] Shutting down...${NC}"

    kill $SERVER_PID 2>/dev/null
    kill $CF_PID 2>/dev/null

    rm -f cloudflare.log

    exit 0
}

trap cleanup INT

wait
