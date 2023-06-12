#!/bin/bash
set -e

# Wait for Postgres to start up
until pg_isready -h $DB_HOST_CMS -p $DB_PORT_CMS -U $DB_USER_CMS
do
  echo "PORT $DB_HOST_CMS"

  echo "Waiting for database to start up..."
  sleep 1
done

# Start Gunicorn server
gunicorn nmhs_cms.wsgi:application --bind 0.0.0.0:8000 
# &

# # Execute Django management command as a cron job
# while true; do
#   python manage.py generate_forecast
#   sleep 10800  # Delay between cron job executions (e.g., 3 hours)
# done

exec "$@"