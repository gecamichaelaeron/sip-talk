#!/bin/bash

# SipTalk Deployment Script
# This script helps automate the deployment process

set -e  # Exit on error

echo "================================"
echo "  SipTalk Deployment Helper"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
check_prerequisites() {
    echo "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found. Please install Docker.${NC}"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found. Please install Docker Compose.${NC}"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git not found. Please install Git.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met!${NC}"
    echo ""
}

# Setup environment
setup_environment() {
    echo "Setting up environment..."
    
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
        cp env.template .env
        echo -e "${GREEN}✅ .env file created. Please edit it with your values.${NC}"
        echo ""
        read -p "Press enter to continue after editing .env..."
    else
        echo -e "${GREEN}✅ .env file found.${NC}"
    fi
    echo ""
}

# Build Docker images
build_docker() {
    echo "Building Docker images..."
    docker-compose build
    echo -e "${GREEN}✅ Docker images built successfully!${NC}"
    echo ""
}

# Start services
start_services() {
    echo "Starting services..."
    docker-compose up -d
    echo -e "${GREEN}✅ Services started!${NC}"
    echo ""
    
    echo "Waiting for services to be healthy..."
    sleep 5
    
    docker-compose ps
    echo ""
}

# Import database
import_database() {
    echo "Importing database schema..."
    
    read -p "Do you want to import the database schema? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose exec -T postgres psql -U postgres -d sip_talk_db < database/sip_talk_postgres.sql
        echo -e "${GREEN}✅ Database schema imported!${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping database import.${NC}"
    fi
    echo ""
}

# Test deployment
test_deployment() {
    echo "Testing deployment..."
    
    echo "Checking health endpoint..."
    sleep 2
    
    if curl -s http://localhost:8080/api/health.php | grep -q "healthy"; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
    else
        echo -e "${RED}❌ Backend health check failed!${NC}"
    fi
    
    echo ""
    echo "Access your app:"
    echo "  Frontend + Backend: http://localhost:8080"
    echo "  pgAdmin: http://localhost:5050 (if dev profile)"
    echo ""
}

# Push to GitHub
push_to_github() {
    echo "Pushing to GitHub..."
    
    read -p "Do you want to commit and push to GitHub? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        
        git add .
        git commit -m "$commit_message"
        git push origin main
        
        echo -e "${GREEN}✅ Pushed to GitHub!${NC}"
        echo "Render and Netlify will auto-deploy on push."
    else
        echo -e "${YELLOW}⚠️  Skipping GitHub push.${NC}"
    fi
    echo ""
}

# Main menu
main_menu() {
    echo "What would you like to do?"
    echo "1. Full deployment (build + start + import)"
    echo "2. Build Docker images only"
    echo "3. Start services"
    echo "4. Import database"
    echo "5. Test deployment"
    echo "6. Push to GitHub"
    echo "7. Stop services"
    echo "8. Clean up (remove all containers and volumes)"
    echo "9. Exit"
    echo ""
    
    read -p "Enter your choice (1-9): " choice
    echo ""
    
    case $choice in
        1)
            check_prerequisites
            setup_environment
            build_docker
            start_services
            import_database
            test_deployment
            push_to_github
            ;;
        2)
            build_docker
            ;;
        3)
            start_services
            ;;
        4)
            import_database
            ;;
        5)
            test_deployment
            ;;
        6)
            push_to_github
            ;;
        7)
            echo "Stopping services..."
            docker-compose down
            echo -e "${GREEN}✅ Services stopped!${NC}"
            ;;
        8)
            echo -e "${RED}⚠️  This will remove all containers and data!${NC}"
            read -p "Are you sure? (y/n): " -n 1 -r
            echo ""
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker-compose down -v
                echo -e "${GREEN}✅ Cleanup complete!${NC}"
            fi
            ;;
        9)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid choice!${NC}"
            ;;
    esac
}

# Run main menu
main_menu

