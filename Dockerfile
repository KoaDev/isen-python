

FROM python:3.9-slim-buster

USER root

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Création d’un groupe et d’un utilisateur système non‑root
RUN addgroup --system appuser \
 && adduser  --system --ingroup appuser appuser

# Passe à cet utilisateur pour l’exécution
USER appuser

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
