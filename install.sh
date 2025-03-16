#!/bin/bash

# Discord Bot Installation Script for Linux
# This script detects and uses your system's package manager

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NODE_MIN_VERSION="20.4.0"
NPM_MIN_VERSION="9.7.2"

echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}Discord Bot Installation Script${NC}"
echo -e "${BLUE}====================================${NC}"

detect_package_manager() {
    if command -v apt &> /dev/null; then
        echo "apt"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v yum &> /dev/null; then
        echo "yum"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    elif command -v zypper &> /dev/null; then
        echo "zypper"
    elif command -v apk &> /dev/null; then
        echo "apk"
    else
        echo "unknown"
    fi
}

version_gt() {
    test "$(printf '%s\n' "$1" "$2" | sort -V | head -n 1)" != "$1"
}

install_node() {
    PKG_MANAGER=$1
    echo -e "${YELLOW}Installing Node.js using ${PKG_MANAGER}...${NC}"
    
    case $PKG_MANAGER in
        apt)
            # Use NodeSource for modern Node.js versions
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt install -y nodejs
            ;;
        dnf)
            sudo dnf module install -y nodejs:20/default
            ;;
        yum)
            curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
            sudo yum install -y nodejs
            ;;
        pacman)
            sudo pacman -S --noconfirm nodejs npm
            ;;
        zypper)
            sudo zypper install -y nodejs npm
            ;;
        apk)
            sudo apk add nodejs npm
            ;;
        *)
            echo -e "${YELLOW}Unknown package manager. Installing Node.js using NVM...${NC}"
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm install 20
            nvm use 20
            ;;
    esac
}

install_git() {
    PKG_MANAGER=$1
    echo -e "${YELLOW}Installing Git using ${PKG_MANAGER}...${NC}"
    
    case $PKG_MANAGER in
        apt)
            sudo apt install -y git
            ;;
        dnf)
            sudo dnf install -y git
            ;;
        yum)
            sudo yum install -y git
            ;;
        pacman)
            sudo pacman -S --noconfirm git
            ;;
        zypper)
            sudo zypper install -y git
            ;;
        apk)
            sudo apk add git
            ;;
        *)
            echo -e "${RED}Unknown package manager. Please install Git manually.${NC}"
            exit 1
            ;;
    esac
}

install_tmux() {
    PKG_MANAGER=$1
    echo -e "${YELLOW}Installing tmux using ${PKG_MANAGER}...${NC}"
    
    case $PKG_MANAGER in
        apt)
            sudo apt install -y tmux
            ;;
        dnf)
            sudo dnf install -y tmux
            ;;
        yum)
            sudo yum install -y tmux
            ;;
        pacman)
            sudo pacman -S --noconfirm tmux
            ;;
        zypper)
            sudo zypper install -y tmux
            ;;
        apk)
            sudo apk add tmux
            ;;
        *)
            echo -e "${RED}Unknown package manager. Please install tmux manually.${NC}"
            exit 1
            ;;
    esac
}

verify_node_version() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed. Installing...${NC}"
        return 1
    fi

    NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    NPM_VERSION=$(npm -v)
    
    echo -e "${BLUE}Node.js version: ${NODE_VERSION}${NC}"
    echo -e "${BLUE}NPM version: ${NPM_VERSION}${NC}"
    
    if version_gt "$NODE_MIN_VERSION" "$NODE_VERSION"; then
        echo -e "${RED}Node.js version too old. Minimum required: ${NODE_MIN_VERSION}${NC}"
        return 1
    fi
    
    if version_gt "$NPM_MIN_VERSION" "$NPM_VERSION"; then
        echo -e "${RED}NPM version too old. Minimum required: ${NPM_MIN_VERSION}${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Node.js and NPM versions OK${NC}"
    return 0
}

clone_repository() {
    echo -e "${YELLOW}Cloning repository...${NC}"

    git clone https://github.com/Mauzy0x00/Discord-Bot
    cd discord-bot || exit 1
}

install_dependencies() {
    echo -e "${YELLOW}Installing bot dependencies...${NC}"
    npm install discord.js openai axios
}

create_config_file() {
    echo -e "${YELLOW}Creating configuration file...${NC}"
    echo -e "${BLUE}Please provide the following information:${NC}"
    
    read -p "Discord Bot ID: " CLIENT_ID
    read -p "Discord Server ID: " GUILD_ID
    read -p "Discord Bot Token: " TOKEN
    read -p "Tenor API Key: " TENOR_API
    read -p "OpenAI API Key: " OPENAI_API_KEY
    
    cat > config.json << EOF
{
    "clientId": "$CLIENT_ID",
    "guildId": "$GUILD_ID",
    "token": "$TOKEN",
    "tenorAPI": "$TENOR_API",
    "OpenAIApiKey": "$OPENAI_API_KEY"
}
EOF
    
    echo -e "${GREEN}config.json created successfully${NC}"
}

start_bot() {
    echo -e "${YELLOW}Testing command deployment...${NC}"
    node deploy-commands.js
    
    echo -e "${GREEN}Starting bot...${NC}"
    echo -e "${BLUE}Choose how to start the bot:${NC}"
    echo "1. Run in foreground (Ctrl+C to stop)"
    echo "2. Run in background with nohup"
    echo "3. Run in tmux session (recommended for SSH connections)"
    
    read -p "Option: " START_OPTION
    
    case $START_OPTION in
        1)
            node index.js
            ;;
        2)
            echo -e "${BLUE}Running in background with nohup${NC}"
            nohup node index.js > bot.log 2>&1 &
            echo -e "${GREEN}Bot started in background. Check bot.log for output.${NC}"
            ;;
        3)
            echo -e "${BLUE}Setting up tmux session${NC}"
            if ! command -v tmux &> /dev/null; then
                echo -e "${YELLOW}tmux not found. Installing...${NC}"
                install_tmux "$PKG_MANAGER"
            fi
            
            tmux new-session -d -s discord-bot "cd $(pwd) && node index.js"
            echo -e "${GREEN}Bot started in tmux session 'discord-bot'${NC}"
            echo -e "${BLUE}To attach to session: tmux attach -t discord-bot${NC}"
            echo -e "${BLUE}To detach from session: Ctrl+B, then press D${NC}"
            ;;
    esac
}

main() {
    PKG_MANAGER=$(detect_package_manager)
    echo -e "${BLUE}Detected package manager: ${PKG_MANAGER}${NC}"
    
    # Check if Git is installed
    if ! command -v git &> /dev/null; then
        echo -e "${RED}Git not found. Installing...${NC}"
        install_git "$PKG_MANAGER"
    fi
    
    # Check Node.js version
    if ! verify_node_version; then
        echo -e "${YELLOW}Need to install/update Node.js${NC}"
        install_node "$PKG_MANAGER"
        
        # Verify again after installation
        if ! verify_node_version; then
            echo -e "${RED}Failed to install compatible Node.js version. Please install manually.${NC}"
            exit 1
        fi
    fi
    
    # Ask for repository URL if not provided
    if [ -z "$1" ]; then
        read -p "Enter repository URL (or press Enter to clone in current directory): " REPO_URL
        if [ -z "$REPO_URL" ]; then
            echo -e "${YELLOW}Skipping repository clone. Assuming bot files are in the current directory.${NC}"
        else
            clone_repository "$REPO_URL"
        fi
    else
        clone_repository "$1"
    fi
    
    # Install dependencies
    install_dependencies
    
    # Create config file if it doesn't exist
    if [ ! -f "config.json" ]; then
        create_config_file
    else
        echo -e "${BLUE}config.json already exists. Skip creation? (y/n)${NC}"
        read -p "" SKIP_CONFIG
        if [[ "$SKIP_CONFIG" != "y" ]]; then
            create_config_file
        fi
    fi
    
    # Start the bot
    start_bot
}

# Run the main function
main "$@"