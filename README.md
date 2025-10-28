# Defect Detection Web Application

A complete web application for AI-powered defect detection using YOLO (You Only Look Once) deep learning model. The application consists of a React frontend and FastAPI backend that work together to provide real-time defect detection capabilities.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python
- **AI Model**: YOLOv8 trained on NEU-DET dataset
- **Defect Types**: 6 types of surface defects (crazing, inclusion, patches, pitted_surface, rolled-in_scale, scratches)

## 📁 Project Structure

```
defect_detection_main/
├── backend/                    # FastAPI backend
│   ├── main.py                # Main API server
│   ├── start_server.py        # Server startup script
│   └── requirements.txt       # Python dependencies
├── defect detection/project/   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   └── ...
│   └── package.json
├── defect_test_models/         # YOLO model and training
│   ├── best.pt               # Trained model weights
│   ├── neudet.yaml          # Model configuration
│   └── NEU-DET/             # Dataset
└── start_app.sh              # Application startup script
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation & Running

1. **Clone and navigate to the project:**
   ```bash
   cd defect_detection_main
   ```

2. **Start the complete application:**
   ```bash
   ./start_app.sh
   ```

   This script will:
   - Set up Python virtual environment
   - Install backend dependencies
   - Start FastAPI server on http://localhost:8000
   - Install frontend dependencies
   - Start React development server on http://localhost:5173

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Manual Setup

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python start_server.py
```

### Frontend Setup

```bash
cd "defect detection/project"
npm install
npm run dev
```

## 📡 API Endpoints

### Core Endpoints

- `GET /` - API status
- `GET /health` - Health check with model status
- `GET /model-info` - Model information and defect classes
- `POST /predict` - Single image defect detection
- `POST /batch-predict` - Multiple images defect detection

### Example API Usage

```bash
# Health check
curl http://localhost:8000/health

# Predict defects in an image
curl -X POST "http://localhost:8000/predict" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@your_image.jpg"
```

## 🎯 Features

### Frontend Features
- **Modern UI**: Dark theme with neon accents and glass effects
- **Drag & Drop**: Easy file upload with drag-and-drop support
- **Real-time Analysis**: Live defect detection with confidence scores
- **Results Visualization**: Interactive defect highlighting and detailed reports
- **Responsive Design**: Works on desktop and mobile devices

### Backend Features
- **FastAPI**: High-performance async API framework
- **YOLO Integration**: Real-time object detection
- **CORS Support**: Cross-origin requests for frontend integration
- **Error Handling**: Comprehensive error handling and validation
- **Batch Processing**: Support for multiple image processing

### AI Model Features
- **6 Defect Types**: Comprehensive surface defect detection
- **Confidence Scoring**: Detailed confidence levels for each detection
- **Bounding Boxes**: Precise defect location identification
- **Severity Assessment**: Automatic severity classification (low/medium/high)
- **Action Recommendations**: Accept/Review/Reject suggestions

## 🧪 Testing

### Test the API

```bash
# Test with a sample image
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@defect_test_models/NEU-DET/validation/images/sample.jpg"
```

### Test the Frontend

1. Open http://localhost:5173
2. Navigate to "Defect Detection" page
3. Upload an image from the validation dataset
4. Click "Analyze Defects" to see results

## 📊 Model Performance

The YOLO model is trained on the NEU-DET dataset and can detect:
- **Crazing**: Surface cracks and crazing patterns
- **Inclusion**: Foreign material inclusions
- **Patches**: Surface patches and irregularities
- **Pitted Surface**: Pitting and corrosion
- **Rolled-in Scale**: Scale and oxide layers
- **Scratches**: Surface scratches and abrasions

## 🛠️ Development

### Adding New Defect Types

1. Update `neudet.yaml` with new class names
2. Retrain the model with updated dataset
3. Update `DEFECT_CLASSES` in `backend/main.py`
4. Update frontend type definitions in `src/services/api.ts`

### Customizing the UI

The frontend uses Tailwind CSS with custom components. Key files:
- `src/index.css` - Global styles and animations
- `src/components/DetectionPage.tsx` - Main detection interface
- `tailwind.config.js` - Tailwind configuration

## 🐛 Troubleshooting

### Common Issues

1. **Model not loading**: Ensure `best.pt` exists in `defect_test_models/`
2. **CORS errors**: Check that frontend URL is in CORS origins
3. **Port conflicts**: Change ports in startup scripts if needed
4. **Dependencies**: Ensure all Python and Node.js dependencies are installed

### Logs

- Backend logs: Check terminal where `start_server.py` is running
- Frontend logs: Check browser developer console
- API logs: Available at http://localhost:8000/docs

## 📝 License

This project is for educational and research purposes. Please ensure you have proper licenses for the NEU-DET dataset and YOLO model usage.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Review backend logs for API errors
