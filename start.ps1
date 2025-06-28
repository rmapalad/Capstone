# PowerShell script to start the property management system

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python (\d+)\.(\d+)\.(\d+)") {
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        
        if ($major -lt 3 -or ($major -eq 3 -and $minor -lt 7)) {
            Write-Host "Python version must be 3.7 or higher. Current version: $pythonVersion"
            exit 1
        }
    }
} catch {
    Write-Host "Python is not installed or not in PATH. Please install Python 3.7 or higher."
    exit 1
}

# Check if pip is installed
try {
    pip --version | Out-Null
} catch {
    Write-Host "pip is not installed. Please install pip."
    exit 1
}

# Install Python dependencies if not already installed
Write-Host "Checking Python dependencies..."
$hasDependencies = $true
try {
    pip list | Select-String -Pattern "flask" | Out-Null
} catch {
    $hasDependencies = $false
}

if (-not $hasDependencies) {
    Write-Host "Installing Python dependencies..."
    Push-Location -Path "py"
    pip install -r requirements.txt
    Pop-Location
}

# Download required NLTK and spaCy resources
Write-Host "Checking NLP resources..."
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
Write-Host "Starting Python NLP service..."
$pythonProcess = Start-Process -FilePath "python" -ArgumentList "py/complaints_processor.py" -NoNewWindow -PassThru

# Check if the Python service started successfully
Start-Sleep -Seconds 2
if ($pythonProcess.HasExited) {
    Write-Host "Failed to start Python NLP service. Please check the logs."
    exit 1
}

Write-Host "Python NLP service started successfully (PID: $($pythonProcess.Id))"

# Check if serve is installed globally
$serve = $null
try {
    $serve = Get-Command serve -ErrorAction SilentlyContinue
} catch {
    $serve = $null
}

if ($null -eq $serve) {
    Write-Host "serve is not installed. Installing it now..."
    npm install -g serve
}

# Start the web server
Write-Host "Starting web server..."
try {
    serve -s . -l 8080
} catch {
    Write-Host "Error starting web server: $_"
} finally {
    # When the web server is closed, kill the Python service
    Write-Host "Shutting down Python NLP service (PID: $($pythonProcess.Id))..."
    Stop-Process -Id $pythonProcess.Id -Force
}

Write-Host "All services stopped." 