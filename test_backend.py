"""
Simple test script to verify the backend API is working
"""
import requests
import os
import sys

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Defect Detection Backend API...")
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on http://localhost:8000")
        return False
    
    # Test 2: Model info
    print("\n2. Testing model info endpoint...")
    try:
        response = requests.get(f"{base_url}/model-info")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Model info retrieved: {data['num_classes']} defect classes")
            print(f"   Classes: {', '.join(data['defect_classes'])}")
        else:
            print(f"❌ Model info failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Model info error: {e}")
    
    # Test 3: Find a test image
    print("\n3. Looking for test images...")
    test_image_paths = [
        "defect_test_models/NEU-DET/validation/images",
        "defect_test_models/test_results/predict"
    ]
    
    test_image = None
    for path in test_image_paths:
        if os.path.exists(path):
            images = [f for f in os.listdir(path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if images:
                test_image = os.path.join(path, images[0])
                print(f"✅ Found test image: {test_image}")
                break
    
    if not test_image:
        print("❌ No test images found. Please ensure the model dataset is available.")
        return False
    
    # Test 4: Predict with test image
    print(f"\n4. Testing prediction with {os.path.basename(test_image)}...")
    try:
        with open(test_image, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{base_url}/predict", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Prediction successful!")
            print(f"   Detections: {data['total_defects']}")
            if data['detections']:
                for i, detection in enumerate(data['detections'][:3]):  # Show first 3
                    print(f"   {i+1}. {detection['type']} (confidence: {detection['confidence']}%)")
            else:
                print("   No defects detected in this image")
        else:
            print(f"❌ Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Prediction error: {e}")
    
    print("\n🎉 Backend testing completed!")
    return True

if __name__ == "__main__":
    test_backend()
