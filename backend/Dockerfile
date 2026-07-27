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

# Expose port for Hugging Face Spaces
EXPOSE 7860

# Run the app with uv run to ensure venv is used
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
