
#!/bin/bash
set -e

# Create directory structure
mkdir -p src/config/environments
mkdir -p docs/archive
mkdir -p logs/empty
mkdir -p temp/unused

# 1. Root file — no secret
cat > README.txt <<'EOF'
Welcome to the internal company repository.
This repository contains configuration and documentation.
EOF

# 2. Configuration file — contains secret
cat > src/config/app.txt <<'EOF'
APP_NAME=internal-service
ENV=development
API_KEY=COMPANY_SECRET_123
LOG_LEVEL=info
EOF

# 3. Deeply nested file — contains secret
cat > src/config/environments/production.txt <<'EOF'
DATABASE_HOST=prod-db.internal
DATABASE_PASSWORD=COMPANY_SECRET_123
TIMEOUT=30
EOF

# 4. Documentation — no secret
cat > docs/guide.txt <<'EOF'
Deployment instructions:
1. Review configuration.
2. Verify environment variables.
3. Deploy the application.
EOF

# 5. Archived file — partial secret only
cat > docs/archive/old-config.txt <<'EOF'
Old configuration:
API_KEY=COMPANY_SECRET
STATUS=deprecated
EOF

echo "Test repository created successfully."
find . -name .git -prune -o -print