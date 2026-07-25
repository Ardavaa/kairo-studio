# Kairo Studio Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy requirements
COPY pyproject.toml uv.lock ./
COPY alembic ./alembic
COPY app ./app
COPY main.py ./

# Install dependencies
RUN uv sync --frozen

# Expose port
EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
