#!/bin/bash

# Wait until DynamoDB Local becomes available
echo "Waiting for DynamoDB Local to be ready..."
while ! curl -s http://dynamodb-local:8000 > /dev/null; do
  sleep 1
done
echo "DynamoDB Local is ready."

# Run Flask
exec flask --app main run --host=0.0.0.0 --port=5005 --reload
