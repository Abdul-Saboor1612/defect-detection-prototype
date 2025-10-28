#!/usr/bin/env python3
"""
Startup script for the Defect Detection API server
"""
import uvicorn
import os
import sys

def main():
    # Add the parent directory to the path so we can import from defect_test_models
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    sys.path.append(parent_dir)
    
    # Start the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[current_dir]
    )

if __name__ == "__main__":
    main()
