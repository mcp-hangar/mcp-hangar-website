#!/usr/bin/env bash
# MCP Hangar Installer
# https://mcp-hangar.io
#
# Usage:
#   curl -sSL https://get.mcp-hangar.io | bash
#   curl -sSL https://get.mcp-hangar.io | bash -s -- --help
#   curl -sSL https://get.mcp-hangar.io | bash -s -- --version 0.6.3
#
# Environment variables:
#   MCP_HANGAR_VERSION    - Version to install (default: latest)
#   MCP_HANGAR_HOME       - Installation directory (default: ~/.mcp-hangar)
#   MCP_HANGAR_NO_MODIFY_PATH - Skip PATH modification if set
#   HTTPS_PROXY / https_proxy - Proxy for downloads

set -euo pipefail

# ------------------------------------------------------------------------------
# Constants
# ------------------------------------------------------------------------------

readonly INSTALLER_VERSION="1.0.0"
readonly DEFAULT_INSTALL_DIR="${HOME}/.mcp-hangar"
readonly PACKAGE_NAME="mcp-hangar"
readonly MIN_PYTHON_MAJOR=3
readonly MIN_PYTHON_MINOR=11
readonly PYPI_JSON_URL="https://pypi.org/pypi/${PACKAGE_NAME}/json"
readonly GITHUB_REPO="mapyr/mcp-hangar"
readonly DOCS_URL="https://docs.mcp-hangar.io"

# ------------------------------------------------------------------------------
# Global state
# ------------------------------------------------------------------------------

INSTALL_DIR="${MCP_HANGAR_HOME:-$DEFAULT_INSTALL_DIR}"
REQUESTED_VERSION="${MCP_HANGAR_VERSION:-latest}"
MODIFY_PATH=true
DRY_RUN=false
UNINSTALL=false
UPGRADE=false
FORCE=false
QUIET=false
NO_CONFIRM=false
DETECTED_SHELL=""
PYTHON_CMD=""
RESOLVED_VERSION=""

# ------------------------------------------------------------------------------
# Terminal / Color support
# ------------------------------------------------------------------------------

# Initialize with empty values (will be set by setup_colors)
RED=''
GREEN=''
YELLOW=''
BLUE=''
CYAN=''
MAGENTA=''
BOLD=''
DIM=''
NC=''

setup_colors() {
    if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]] && [[ "${TERM:-}" != "dumb" ]]; then
        RED='\033[0;31m'
        GREEN='\033[0;32m'
        YELLOW='\033[1;33m'
        BLUE='\033[0;34m'
        CYAN='\033[0;36m'
        MAGENTA='\033[0;35m'
        BOLD='\033[1m'
        DIM='\033[2m'
        NC='\033[0m'
    fi
}

# ------------------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------------------

log_info() {
    [[ "$QUIET" == "true" ]] && return
    echo -e "${BLUE}::${NC} $1"
}

log_success() {
    [[ "$QUIET" == "true" ]] && return
    echo -e "${GREEN}ok${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}warning${NC} $1" >&2
}

log_error() {
    echo -e "${RED}error${NC} $1" >&2
}

log_debug() {
    if [[ "${MCP_HANGAR_DEBUG:-}" == "1" ]]; then
        echo -e "${DIM}debug${NC} $1" >&2
    fi
}

die() {
    log_error "$1"
    exit 1
}

# ------------------------------------------------------------------------------
# Utilities
# ------------------------------------------------------------------------------

command_exists() {
    command -v "$1" &>/dev/null
}

is_piped() {
    # Detect if script is being piped (curl | bash)
    [[ ! -t 0 ]]
}

confirm() {
    local prompt="$1"
    local default="${2:-y}"

    if [[ "$NO_CONFIRM" == "true" ]] || [[ "$QUIET" == "true" ]]; then
        return 0
    fi

    if is_piped; then
        # Non-interactive, use default
        return 0
    fi

    local yn_prompt
    if [[ "$default" == "y" ]]; then
        yn_prompt="[Y/n]"
    else
        yn_prompt="[y/N]"
    fi

    echo -en "${BOLD}$prompt${NC} $yn_prompt "
    read -r response </dev/tty || response="$default"

    case "${response,,}" in
        y|yes) return 0 ;;
        n|no) return 1 ;;
        "") [[ "$default" == "y" ]] && return 0 || return 1 ;;
        *) return 1 ;;
    esac
}

# ------------------------------------------------------------------------------
# OS / Architecture detection
# ------------------------------------------------------------------------------

detect_os() {
    local os
    os="$(uname -s)"

    case "$os" in
        Linux*)
            if [[ -f /proc/version ]] && grep -qi microsoft /proc/version 2>/dev/null; then
                echo "wsl"
            elif [[ -f /etc/os-release ]]; then
                # shellcheck source=/dev/null
                . /etc/os-release
                echo "${ID:-linux}"
            else
                echo "linux"
            fi
            ;;
        Darwin*)
            echo "macos"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

detect_arch() {
    local arch
    arch="$(uname -m)"

    case "$arch" in
        x86_64|amd64)
            echo "x86_64"
            ;;
        aarch64|arm64)
            echo "arm64"
            ;;
        armv7l|armv6l)
            echo "arm"
            ;;
        *)
            echo "$arch"
            ;;
    esac
}

detect_shell() {
    # Try to detect the user's default shell
    local shell_name

    if [[ -n "${SHELL:-}" ]]; then
        shell_name="$(basename "$SHELL")"
    elif command_exists getent; then
        shell_name="$(basename "$(getent passwd "$USER" | cut -d: -f7)")"
    else
        shell_name="bash"
    fi

    DETECTED_SHELL="$shell_name"
    echo "$shell_name"
}

get_shell_rc_file() {
    local shell="${1:-$(detect_shell)}"

    case "$shell" in
        bash)
            if [[ "$(detect_os)" == "macos" ]]; then
                # macOS uses .bash_profile for login shells
                if [[ -f "${HOME}/.bash_profile" ]]; then
                    echo "${HOME}/.bash_profile"
                else
                    echo "${HOME}/.bashrc"
                fi
            else
                echo "${HOME}/.bashrc"
            fi
            ;;
        zsh)
            echo "${HOME}/.zshrc"
            ;;
        fish)
            echo "${HOME}/.config/fish/config.fish"
            ;;
        *)
            echo "${HOME}/.profile"
            ;;
    esac
}

# ------------------------------------------------------------------------------
# Python detection
# ------------------------------------------------------------------------------

find_python() {
    local candidates=("python3.13" "python3.12" "python3.11" "python3" "python")
    local cmd

    for cmd in "${candidates[@]}"; do
        if command_exists "$cmd"; then
            if check_python_version "$cmd" 2>/dev/null; then
                PYTHON_CMD="$cmd"
                return 0
            fi
        fi
    done

    return 1
}

check_python_version() {
    local python_cmd="${1:-python3}"
    local version_info
    local major minor

    version_info=$("$python_cmd" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>/dev/null) || return 1
    major="${version_info%%.*}"
    minor="${version_info#*.}"

    if [[ "$major" -gt "$MIN_PYTHON_MAJOR" ]]; then
        return 0
    elif [[ "$major" -eq "$MIN_PYTHON_MAJOR" ]] && [[ "$minor" -ge "$MIN_PYTHON_MINOR" ]]; then
        return 0
    fi

    return 1
}

get_python_version() {
    local python_cmd="${1:-$PYTHON_CMD}"
    "$python_cmd" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")'
}

# ------------------------------------------------------------------------------
# Network utilities
# ------------------------------------------------------------------------------

fetch_url() {
    local url="$1"
    local output="${2:-}"

    local curl_opts=(-fsSL --connect-timeout 30 --max-time 120)
    local wget_opts=(-q --timeout=30 -O -)

    # Add proxy support
    if [[ -n "${HTTPS_PROXY:-${https_proxy:-}}" ]]; then
        curl_opts+=(--proxy "${HTTPS_PROXY:-${https_proxy:-}}")
    fi

    if command_exists curl; then
        if [[ -n "$output" ]]; then
            curl "${curl_opts[@]}" -o "$output" "$url"
        else
            curl "${curl_opts[@]}" "$url"
        fi
    elif command_exists wget; then
        if [[ -n "$output" ]]; then
            wget "${wget_opts[@]}" -O "$output" "$url"
        else
            wget "${wget_opts[@]}" "$url"
        fi
    else
        die "Neither curl nor wget found. Please install one of them."
    fi
}

get_latest_version() {
    local json_data

    json_data=$(fetch_url "$PYPI_JSON_URL") || die "Failed to fetch version info from PyPI"

    # Extract version using Python (most reliable)
    if [[ -n "$PYTHON_CMD" ]]; then
        echo "$json_data" | "$PYTHON_CMD" -c "import sys, json; print(json.load(sys.stdin)['info']['version'])"
    # Fallback to grep/sed
    elif command_exists jq; then
        echo "$json_data" | jq -r '.info.version'
    else
        echo "$json_data" | grep -o '"version":"[^"]*"' | head -1 | cut -d'"' -f4
    fi
}

# ------------------------------------------------------------------------------
# Installation
# ------------------------------------------------------------------------------

create_venv() {
    local venv_dir="$1"

    log_info "Creating virtual environment..."

    if [[ -d "$venv_dir" ]] && [[ "$FORCE" != "true" ]]; then
        if [[ "$UPGRADE" == "true" ]]; then
            log_debug "Reusing existing venv for upgrade"
            return 0
        fi
        die "Virtual environment already exists at $venv_dir. Use --force to overwrite or --upgrade to update."
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would create venv at $venv_dir"
        return 0
    fi

    # Remove existing if force
    if [[ -d "$venv_dir" ]] && [[ "$FORCE" == "true" ]]; then
        rm -rf "$venv_dir"
    fi

    "$PYTHON_CMD" -m venv "$venv_dir" || die "Failed to create virtual environment"
    log_success "Virtual environment created"
}

install_package() {
    local venv_dir="$1"
    local version="$2"
    local pip_cmd="${venv_dir}/bin/pip"

    # Ensure pip is up to date
    log_info "Upgrading pip..."
    if [[ "$DRY_RUN" != "true" ]]; then
        "$pip_cmd" install --upgrade pip --quiet || log_warn "Failed to upgrade pip, continuing anyway"
    fi

    local package_spec="$PACKAGE_NAME"
    if [[ "$version" != "latest" ]]; then
        package_spec="${PACKAGE_NAME}==${version}"
    fi

    log_info "Installing ${package_spec}..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would install $package_spec"
        return 0
    fi

    local pip_opts=(--quiet)
    if [[ "$UPGRADE" == "true" ]]; then
        pip_opts+=(--upgrade)
    fi

    "$pip_cmd" install "${pip_opts[@]}" "$package_spec" || die "Failed to install $package_spec"
    log_success "Installed $package_spec"
}

create_wrapper_scripts() {
    local venv_dir="$1"
    local bin_dir="${INSTALL_DIR}/bin"

    log_info "Creating wrapper scripts..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would create wrapper scripts in $bin_dir"
        return 0
    fi

    mkdir -p "$bin_dir"

    # Main CLI wrapper - use the venv's installed entry point
    cat > "${bin_dir}/mcp-hangar" << EOF
#!/usr/bin/env bash
# MCP Hangar CLI wrapper
# Auto-generated by install.sh

set -euo pipefail

VENV_BIN="${venv_dir}/bin"
CLI="\${VENV_BIN}/mcp-hangar"

if [[ ! -x "\$CLI" ]]; then
    echo "error: MCP Hangar installation is corrupted. Please reinstall:" >&2
    echo "  curl -sSL https://get.mcp-hangar.io | bash -s -- --force" >&2
    exit 1
fi

exec "\$CLI" "\$@"
EOF

    chmod +x "${bin_dir}/mcp-hangar"

    # Hangar alias (shorter command)
    ln -sf "mcp-hangar" "${bin_dir}/hangar"

    log_success "Created wrapper scripts"
}

setup_path() {
    local bin_dir="${INSTALL_DIR}/bin"
    local shell_name
    local rc_file
    local path_line

    shell_name=$(detect_shell)
    rc_file=$(get_shell_rc_file "$shell_name")

    if [[ -n "${MCP_HANGAR_NO_MODIFY_PATH:-}" ]]; then
        log_info "Skipping PATH modification (MCP_HANGAR_NO_MODIFY_PATH is set)"
        return 0
    fi

    if [[ "$MODIFY_PATH" != "true" ]]; then
        return 0
    fi

    # Check if already in PATH
    if [[ ":${PATH}:" == *":${bin_dir}:"* ]]; then
        log_debug "PATH already contains $bin_dir"
        return 0
    fi

    # Check if rc file already has our path
    if [[ -f "$rc_file" ]] && grep -q "MCP Hangar" "$rc_file" 2>/dev/null; then
        log_debug "RC file already configured"
        return 0
    fi

    log_info "Configuring PATH in ${rc_file}..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would add PATH to $rc_file"
        return 0
    fi

    if [[ "$shell_name" == "fish" ]]; then
        path_line="set -gx PATH \"${bin_dir}\" \$PATH  # MCP Hangar"
    else
        path_line="export PATH=\"${bin_dir}:\$PATH\"  # MCP Hangar"
    fi

    # Create rc file if it doesn't exist
    mkdir -p "$(dirname "$rc_file")"
    touch "$rc_file"

    {
        echo ""
        echo "# MCP Hangar PATH configuration"
        echo "$path_line"
    } >> "$rc_file"

    log_success "PATH configured in $rc_file"
}

verify_installation() {
    local venv_dir="$1"
    local python="${venv_dir}/bin/python"

    log_info "Verifying installation..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would verify installation"
        return 0
    fi

    local installed_version
    installed_version=$("$python" -c "import mcp_hangar; print(mcp_hangar.__version__)" 2>/dev/null) || die "Installation verification failed: cannot import mcp_hangar"

    RESOLVED_VERSION="$installed_version"
    log_success "mcp-hangar ${installed_version} installed successfully"
}

# ------------------------------------------------------------------------------
# Uninstallation
# ------------------------------------------------------------------------------

uninstall() {
    log_info "Uninstalling MCP Hangar..."

    if [[ ! -d "$INSTALL_DIR" ]]; then
        log_warn "MCP Hangar is not installed at $INSTALL_DIR"
        return 0
    fi

    if ! confirm "Remove $INSTALL_DIR and all its contents?" "n"; then
        log_info "Uninstall cancelled"
        exit 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[dry-run] Would remove $INSTALL_DIR"
        log_info "[dry-run] Would remove PATH entries from shell rc files"
        return 0
    fi

    rm -rf "$INSTALL_DIR"
    log_success "Removed $INSTALL_DIR"

    # Remove from shell rc files
    local shells=("bash" "zsh" "fish")
    for shell in "${shells[@]}"; do
        local rc_file
        rc_file=$(get_shell_rc_file "$shell")
        if [[ -f "$rc_file" ]] && grep -q "MCP Hangar" "$rc_file"; then
            # Create backup
            cp "$rc_file" "${rc_file}.bak"
            # Remove our lines
            grep -v "MCP Hangar" "$rc_file" > "${rc_file}.tmp" && mv "${rc_file}.tmp" "$rc_file"
            log_success "Removed PATH from $rc_file"
        fi
    done

    echo ""
    log_success "MCP Hangar has been uninstalled"
    log_info "You may need to restart your shell or run: exec \$SHELL"
}

# ------------------------------------------------------------------------------
# Prerequisites check
# ------------------------------------------------------------------------------

check_prerequisites() {
    local os arch
    os=$(detect_os)
    arch=$(detect_arch)

    log_info "System: ${os} (${arch})"

    # Warn about unsupported systems
    case "$os" in
        windows)
            die "Windows is not supported. Please use WSL (Windows Subsystem for Linux)."
            ;;
        unknown)
            log_warn "Unknown operating system. Installation may not work correctly."
            ;;
    esac

    # Check for Python
    log_info "Checking Python..."
    if ! find_python; then
        echo ""
        log_error "Python ${MIN_PYTHON_MAJOR}.${MIN_PYTHON_MINOR}+ is required but not found."
        echo ""
        echo "Install Python using your package manager:"
        echo ""
        case "$os" in
            macos)
                echo "  brew install python@3.12"
                ;;
            ubuntu|debian)
                echo "  sudo apt update && sudo apt install python3.12 python3.12-venv"
                ;;
            fedora)
                echo "  sudo dnf install python3.12"
                ;;
            arch)
                echo "  sudo pacman -S python"
                ;;
            *)
                echo "  Install Python 3.11+ from https://python.org"
                ;;
        esac
        echo ""
        exit 1
    fi

    local py_version
    py_version=$(get_python_version "$PYTHON_CMD")
    log_success "Python ${py_version} found (${PYTHON_CMD})"

    # Check for venv module
    if ! "$PYTHON_CMD" -c "import venv" 2>/dev/null; then
        echo ""
        log_error "Python venv module is required but not found."
        echo ""
        case "$os" in
            ubuntu|debian)
                echo "  sudo apt install python3-venv"
                ;;
            *)
                echo "  Install the python venv package for your system"
                ;;
        esac
        echo ""
        exit 1
    fi

    # Check for curl or wget
    if ! command_exists curl && ! command_exists wget; then
        die "Neither curl nor wget found. Please install one of them."
    fi

    # Optional: Check for Docker
    if command_exists docker; then
        log_success "Docker found (container isolation available)"
    else
        log_info "Docker not found (container isolation will be unavailable)"
    fi

    # Optional: Check for uv (faster installs)
    if command_exists uv; then
        log_success "uv found (faster package installation)"
    fi
}

# ------------------------------------------------------------------------------
# Main installation flow
# ------------------------------------------------------------------------------

do_install() {
    local venv_dir="${INSTALL_DIR}/venv"

    echo ""
    log_info "Installation directory: ${INSTALL_DIR}"

    # Resolve version
    if [[ "$REQUESTED_VERSION" == "latest" ]]; then
        log_info "Fetching latest version..."
        RESOLVED_VERSION=$(get_latest_version) || die "Failed to fetch latest version"
        log_info "Latest version: ${RESOLVED_VERSION}"
    else
        RESOLVED_VERSION="$REQUESTED_VERSION"
        log_info "Requested version: ${RESOLVED_VERSION}"
    fi

    echo ""

    # Confirm installation
    if [[ "$DRY_RUN" != "true" ]] && [[ "$NO_CONFIRM" != "true" ]]; then
        if ! confirm "Install mcp-hangar ${RESOLVED_VERSION} to ${INSTALL_DIR}?"; then
            log_info "Installation cancelled"
            exit 0
        fi
        echo ""
    fi

    # Create installation directory
    if [[ "$DRY_RUN" != "true" ]]; then
        mkdir -p "$INSTALL_DIR"
    fi

    # Create virtual environment
    create_venv "$venv_dir"

    # Install package
    install_package "$venv_dir" "$RESOLVED_VERSION"

    # Create wrapper scripts
    create_wrapper_scripts "$venv_dir"

    # Setup PATH
    setup_path

    # Verify
    verify_installation "$venv_dir"
}

print_banner() {
    if [[ "$QUIET" == "true" ]]; then
        return
    fi

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
    echo -e "${BOLD}Production-grade MCP Control Plane${NC}"
    echo -e "${DIM}Installer v${INSTALLER_VERSION}${NC}"
    echo ""
}

print_success() {
    local bin_dir="${INSTALL_DIR}/bin"

    if [[ "$QUIET" == "true" ]]; then
        echo "${bin_dir}/mcp-hangar"
        return
    fi

    echo ""
    echo -e "${GREEN}${BOLD}Installation complete!${NC}"
    echo ""
    echo -e "${BOLD}Installed:${NC} mcp-hangar ${RESOLVED_VERSION}"
    echo -e "${BOLD}Location:${NC}  ${INSTALL_DIR}"
    echo ""

    # Check if PATH is configured
    if [[ ":${PATH}:" != *":${bin_dir}:"* ]]; then
        echo -e "${YELLOW}Note:${NC} Restart your shell or run:"
        echo ""
        echo -e "  ${CYAN}export PATH=\"${bin_dir}:\$PATH\"${NC}"
        echo ""
    fi

    echo -e "${BOLD}Get started:${NC}"
    echo ""
    echo -e "  ${CYAN}mcp-hangar init${NC}      # Initialize a new project"
    echo -e "  ${CYAN}mcp-hangar add${NC}       # Add MCP providers"
    echo -e "  ${CYAN}mcp-hangar serve${NC}     # Start the server"
    echo -e "  ${CYAN}mcp-hangar --help${NC}    # Show all commands"
    echo ""
    echo -e "${BOLD}Resources:${NC}"
    echo -e "  Documentation: ${CYAN}${DOCS_URL}${NC}"
    echo -e "  GitHub:        ${CYAN}https://github.com/${GITHUB_REPO}${NC}"
    echo ""
}

usage() {
    cat << EOF
MCP Hangar Installer

Usage:
  install.sh [options]

Options:
  -h, --help              Show this help message
  -v, --version VERSION   Install specific version (default: latest)
  -d, --dir DIR           Installation directory (default: ~/.mcp-hangar)
  -f, --force             Overwrite existing installation
  -u, --upgrade           Upgrade existing installation
  --uninstall             Remove MCP Hangar
  --no-modify-path        Don't add to PATH
  --dry-run               Show what would be done without doing it
  --quiet                 Minimal output
  --yes                   Skip confirmation prompts

Environment variables:
  MCP_HANGAR_VERSION      Same as --version
  MCP_HANGAR_HOME         Same as --dir
  MCP_HANGAR_NO_MODIFY_PATH  Same as --no-modify-path
  MCP_HANGAR_DEBUG        Enable debug output (set to 1)
  NO_COLOR                Disable colored output
  HTTPS_PROXY             Proxy for downloads

Examples:
  # Install latest version
  curl -sSL https://get.mcp-hangar.io | bash

  # Install specific version
  curl -sSL https://get.mcp-hangar.io | bash -s -- --version 0.6.3

  # Install to custom directory
  curl -sSL https://get.mcp-hangar.io | bash -s -- --dir /opt/mcp-hangar

  # Upgrade existing installation
  curl -sSL https://get.mcp-hangar.io | bash -s -- --upgrade

  # Uninstall
  curl -sSL https://get.mcp-hangar.io | bash -s -- --uninstall

EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                usage
                exit 0
                ;;
            -v|--version)
                REQUESTED_VERSION="$2"
                shift 2
                ;;
            -d|--dir)
                INSTALL_DIR="$2"
                shift 2
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -u|--upgrade)
                UPGRADE=true
                shift
                ;;
            --uninstall)
                UNINSTALL=true
                shift
                ;;
            --no-modify-path)
                MODIFY_PATH=false
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --quiet|-q)
                QUIET=true
                shift
                ;;
            --yes|-y)
                NO_CONFIRM=true
                shift
                ;;
            *)
                die "Unknown option: $1. Use --help for usage."
                ;;
        esac
    done
}

main() {
    setup_colors
    parse_args "$@"

    print_banner

    if [[ "$UNINSTALL" == "true" ]]; then
        uninstall
        exit 0
    fi

    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "${YELLOW}Dry run mode - no changes will be made${NC}"
        echo ""
    fi

    check_prerequisites
    do_install
    print_success
}

# Ensure we're not running as root (unless forced)
if [[ "${EUID:-$(id -u)}" -eq 0 ]] && [[ "${MCP_HANGAR_ALLOW_ROOT:-}" != "1" ]]; then
    die "Do not run this script as root. Install for your user account instead."
fi

main "$@"
