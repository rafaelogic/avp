#!/bin/bash
cd /app/backend
source venv/bin/activate
pip install -r requirements.txt
pytest
