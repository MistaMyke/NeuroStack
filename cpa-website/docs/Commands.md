# Dev stack (Docker)
docker compose -f infra/docker/docker-compose.dev.yml up --build
docker compose -f infra/docker/docker-compose.dev.yml down

# Check last 5 Email contact submitions

# docker compose -f infra/docker/docker-compose.dev.yml exec backend \
#      sh -lc 'psql "$DATABASE_URL" -c "SELECT id, name, email, status, \"createdAt\" FROM \"ContactRequest\" ORDER BY \"createdAt\" DESC LIMIT 5
