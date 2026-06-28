
#!/bin/bash

# Start Python Flask backend
echo "Starting Flask backend server..."
python app.py &
FLASK_PID=$!

# Start React frontend
echo "Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

# Handle cleanup when script is terminated
trap "kill $FLASK_PID $FRONTEND_PID; exit" SIGINT SIGTERM

# Keep the script running
wait
