#!/usr/bin/env bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Version
VERSION="0.1.2"
REPO="https://github.com/mapyr/mcp-hangar"

print_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
                          _                                   
  _ __ ___   ___ _ __    | |__   __ _ _ __   __ _  __ _ _ __  
 | '_ ` _ \ / __| '_ \   | '_ \ / _` | '_ \ / _` |/ _` | '__| 
 | | | | | | (__| |_) |  | | | | (_| | | | | (_| | (_| | |    
 |_| |_| |_|\___| .__/___|_| |_|\__,_|_| |_|\__, |\__,_|_|    
                |_| |_____|                 |___/             
EOF
    echo -e "${NC}"
    echo -e "${BOLD}Production-grade MCP Provider Registry${NC}"
    echo -e "Version: ${GREEN}${VERSION}${NC}"
    echo ""
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

check_python() {
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
        PYTHON_MAJOR=$(echo "$PYTHON_VERSION" | cut -d. -f1)
        PYTHON_MINOR=$(echo "$PYTHON_VERSION" | cut -d. -f2)
        
        if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 11 ]; then
            success "Python ${PYTHON_VERSION} found"
            return 0
        else
            error "Python 3.11+ required, found ${PYTHON_VERSION}"
        fi
    else
        error "Python 3 not found. Please install Python 3.11 or later."
    fi
}

check_pip() {
    if command -v pip3 &> /dev/null || command -v pip &> /dev/null; then
        success "pip found"
        return 0
    else
        error "pip not found. Please install pip."
    fi
}

check_docker() {
    if command -v docker &> /dev/null; then
        success "Docker found"
        return 0
    else
        warn "Docker not found. Container isolation will be unavailable."
        return 1
    fi
}

install_mcp_hangar() {
    info "Installing mcp-hangar..."
    
    if pip3 install mcp-hangar 2>/dev/null || pip install mcp-hangar; then
        success "mcp-hangar installed successfully"
    else
        error "Failed to install mcp-hangar"
    fi
}

verify_installation() {
    info "Verifying installation..."
    
    if python3 -c "import mcp_hangar; print(f'mcp-hangar {mcp_hangar.__version__}')" 2>/dev/null; then
        success "Installation verified"
    else
        error "Installation verification failed"
    fi
}

print_next_steps() {
    echo ""
    echo -e "${GREEN}${BOLD}✓ Installation complete!${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo ""
    echo -e "  1. Create a configuration file:"
    echo -e "     ${CYAN}mcp-hangar init${NC}"
    echo ""
    echo -e "  2. Start the server:"
    echo -e "     ${CYAN}mcp-hangar serve${NC}"
    echo ""
    echo -e "  3. Read the docs:"
    echo -e "     ${CYAN}https://mcp-hangar.io/docs${NC}"
    echo ""
    echo -e "${BOLD}Resources:${NC}"
    echo -e "  • GitHub:  ${CYAN}${REPO}${NC}"
    echo -e "  • Docs:    ${CYAN}https://mcp-hangar.io/docs${NC}"
    echo -e "  • PyPI:    ${CYAN}https://pypi.org/project/mcp-hangar/${NC}"
    echo ""
}

main() {
    print_banner
    
    info "Checking prerequisites..."
    echo ""
    
    check_python
    check_pip
    check_docker || true  # Docker is optional
    
    echo ""
    install_mcp_hangar
    verify_installation
    print_next_steps
}

main "$@"
