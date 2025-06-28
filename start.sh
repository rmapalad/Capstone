#!/bin/bash

# Check if Python is installed
if ! command -v python &> /dev/null
then
    echo "Python is not installed or not in PATH. Please install Python 3.7 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null
then
    echo "pip is not installed. Please install pip."
    exit 1
fi

# Check if Python version is 3.7 or higher
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d. -f1)
PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d. -f2)

if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 7 ])
then
    echo "Python version must be 3.7 or higher. Current version: $PYTHON_VERSION"
    exit 1
fi

# Install Python dependencies if not already installed
echo "Checking Python dependencies..."
if ! pip list | grep -q flask
then
    echo "Installing Python dependencies..."
    cd py
    pip install -r requirements.txt
    cd ..
fi

# Download required NLTK and spaCy resources
echo "Checking NLP resources..."
python -c "
import nltk
import os
try:
    nltk.data.find('tokenizers/punkt')
    print('NLTK punkt already downloaded')
except LookupError:
    print('Downloading NLTK punkt')
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
    print('NLTK stopwords already downloaded')
except LookupError:
    print('Downloading NLTK stopwords')
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
    print('NLTK wordnet already downloaded')
except LookupError:
    print('Downloading NLTK wordnet')
    nltk.download('wordnet')

try:
    import spacy
    if not spacy.util.is_package('en_core_web_sm'):
        print('Downloading English spaCy model')
        os.system('python -m spacy download en_core_web_sm')
    else:
        print('English spaCy model already installed')
except:
    print('Error checking spaCy models')
"

# Start the Python NLP service in the background
echo "Starting Python NLP service..."
cd py
python complaints_processor.py &
PYTHON_PID=$!
cd ..

# Check if the Python service started successfully
sleep 2
if ! ps -p $PYTHON_PID > /dev/null
then
    echo "Failed to start Python NLP service. Please check the logs."
    exit 1
fi

echo "Python NLP service started successfully (PID: $PYTHON_PID)"

# Check if http-server is installed globally
if ! command -v http-server &> /dev/null
then
    echo "http-server is not installed. Installing it now..."
    npm install -g http-server
fi

# Start the web server
echo "Starting web server..."
http-server -p 8080 .

# When the web server is closed, kill the Python service
echo "Shutting down Python NLP service (PID: $PYTHON_PID)..."
kill $PYTHON_PID

echo "All services stopped." 