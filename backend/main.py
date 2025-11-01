from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from ultralytics import YOLO
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os
from typing import List, Dict, Any
import uvicorn

app = FastAPI(title="Defect Detection API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://ainspect.netlify.app"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None

# Defect class names from neudet.yaml
DEFECT_CLASSES = ['crazing', 'inclusion', 'patches', 'pitted_surface', 'rolled-in_scale', 'scratches']

def load_model():
    """Load the YOLO model"""
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'defect_test_models', 'best.pt')
        model = YOLO(model_path)
        print(f"Model loaded successfully from {model_path}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    if not load_model():
        raise Exception("Failed to load YOLO model")

@app.get("/")
async def root():
    return {"message": "Defect Detection API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/keep-alive")
async def keep_alive():
    return {"status": "alive"}

@app.post("/predict")
async def predict_defects(file: UploadFile = File(...)):
    """
    Predict defects in uploaded image
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL to numpy array
        image_np = np.array(image)
        
        # Convert RGB to BGR for OpenCV (if needed)
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        
        # Run prediction
        results = model.predict(image_np, conf=0.25, save=False)
        
        # Process results
        detections = []
        result = results[0]  # Get first result
        
        if result.boxes is not None:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].tolist()
                
                # Calculate area percentage
                img_height, img_width = image_np.shape[:2]
                bbox_width = bbox[2] - bbox[0]
                bbox_height = bbox[3] - bbox[1]
                area_percentage = (bbox_width * bbox_height) / (img_width * img_height) * 100
                
                # Determine severity based on confidence and area
                if confidence > 0.8 and area_percentage > 5:
                    severity = "high"
                    action = "Reject"
                elif confidence > 0.6 or area_percentage > 2:
                    severity = "medium"
                    action = "Review"
                else:
                    severity = "low"
                    action = "Accept"
                
                detection = {
                    "id": len(detections) + 1,
                    "type": DEFECT_CLASSES[class_id],
                    "confidence": round(confidence * 100, 1),
                    "area": f"{bbox[0]:.0f},{bbox[1]:.0f},{bbox[2]:.0f},{bbox[3]:.0f}",
                    "severity": severity,
                    "action": action,
                    "bbox": bbox
                }
                detections.append(detection)
        
        # Convert image to base64 for frontend display
        image_base64 = base64.b64encode(contents).decode('utf-8')
        
        return {
            "success": True,
            "detections": detections,
            "total_defects": len(detections),
            "image_base64": image_base64,
            "image_type": file.content_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "model_loaded": True,
        "defect_classes": DEFECT_CLASSES,
        "num_classes": len(DEFECT_CLASSES),
        "model_path": "best.pt"
    }

@app.get("/test-images/{filename}")
async def get_test_image(filename: str):
    """Serve test images for expert panel testing"""
    # Validate filename to prevent directory traversal
    if not filename.endswith('.jpg') or '..' in filename or '/' in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    # Path to test images
    test_images_path = os.path.join(
        os.path.dirname(__file__), 
        '..', 
        'defect_test_models', 
        'NEU-DET', 
        'validation', 
        'images', 
        filename
    )
    
    if not os.path.exists(test_images_path):
        raise HTTPException(status_code=404, detail="Test image not found")
    
    return FileResponse(test_images_path, media_type="image/jpeg")

@app.get("/test-images")
async def list_test_images():
    """Get list of available test images"""
    test_images_path = os.path.join(
        os.path.dirname(__file__), 
        '..', 
        'defect_test_models', 
        'NEU-DET', 
        'validation', 
        'images'
    )
    
    if not os.path.exists(test_images_path):
        return {"images": []}
    
    images = []
    for filename in os.listdir(test_images_path):
        if filename.endswith('.jpg'):
            # Extract defect type from filename
            defect_type = filename.split('_')[0]
            images.append({
                "filename": filename,
                "defect_type": defect_type,
                "url": f"/test-images/{filename}"
            })
    
    return {"images": images}

@app.post("/batch-predict")
async def batch_predict(files: List[UploadFile] = File(...)):
    """
    Predict defects in multiple images
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    if len(files) > 10:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
    
    results = []
    
    for file in files:
        if not file.content_type.startswith('image/'):
            continue
            
        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            image_np = np.array(image)
            
            if len(image_np.shape) == 3 and image_np.shape[2] == 3:
                image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
            
            results_pred = model.predict(image_np, conf=0.25, save=False)
            result = results_pred[0]
            
            detections = []
            if result.boxes is not None:
                for box in result.boxes:
                    class_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    bbox = box.xyxy[0].tolist()
                    
                    detection = {
                        "type": DEFECT_CLASSES[class_id],
                        "confidence": round(confidence * 100, 1),
                        "bbox": bbox
                    }
                    detections.append(detection)
            
            results.append({
                "filename": file.filename,
                "detections": detections,
                "total_defects": len(detections)
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
                "detections": [],
                "total_defects": 0
            })
    
    return {"results": results}

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
