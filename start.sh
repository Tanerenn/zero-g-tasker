#!/bin/bash
echo "Starting Zero-G Tasker Servers natively in WSL..."

cd /home/taner/genel_calisma/antigravity/zero-g-tasker

echo "Setting up backend..."
cd backend
rm -rf venv
python3 -m venv venv
./venv/bin/pip install django djangorestframework django-cors-headers
./venv/bin/python manage.py migrate
echo "Starting Django server..."
nohup ./venv/bin/python manage.py runserver 0.0.0.0:8000 > backend.log 2>&1 &

echo "Setting up frontend..."
cd ../frontend
npm install
echo "Starting Vite dev server..."
nohup node node_modules/vite/bin/vite.js --host > frontend.log 2>&1 &

echo "Both servers have been launched. Waiting a few seconds..."
sleep 5
echo "Backend Status:"
curl -I http://localhost:8000/api/tasks/ || echo "Backend failed"
echo "Frontend Status:"
curl -I http://localhost:5173/ || echo "Frontend failed"
