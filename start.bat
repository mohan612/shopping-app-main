
@echo off
echo Starting Flask backend server...
start python app.py

echo Starting React frontend...
start npm run dev

echo Both servers are now running.
echo Press Ctrl+C in each terminal window to stop the servers when done.
