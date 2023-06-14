#!/bin/bash

python manage.py migrate --noinput
# &

# # Execute Django management command as a cron job
# while true; do
#   python manage.py generate_forecast
#   sleep 10800  # Delay between cron job executions (e.g., 3 hours)
# done

exec "$@"