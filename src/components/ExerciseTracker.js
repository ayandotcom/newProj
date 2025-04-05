import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';
import ExerciseService from '../services/ExerciseService';
import './ExerciseTracker.css';

function ExerciseTracker({ exerciseType, onBack }) {
  const webcamRef = useRef(null);
  const detectorRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [count, setCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [isSafari] = useState(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
    frameRate: 30
  };

  // Cleanup function to stop all media tracks
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        cleanup();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });

        streamRef.current = stream;
        setHasWebcamPermission(true);
        setError(null);

        if (isSafari && webcamRef.current && webcamRef.current.video) {
          webcamRef.current.video.srcObject = stream;
          await webcamRef.current.video.play();
        }

      } catch (err) {
        console.error('Camera setup error:', err);
        setError('Unable to access camera. Please check your camera permissions.');
        setHasWebcamPermission(false);
      }
    };

    setupCamera();

    return cleanup;
  }, [isSafari]);

  useEffect(() => {
    let detector = null;

    const initializeDetector = async () => {
      if (!hasWebcamPermission) return;

      try {
        // Ensure TensorFlow.js is properly initialized
        await tf.ready();
        
        // Force WebGL backend
        await tf.setBackend('webgl');
        console.log('Using backend:', tf.getBackend());
        
        // Wait for backend initialization
        await tf.ready();

        // Configure detector
        const detectorConfig = {
          runtime: 'mediapipe',
          modelType: 'full',
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
          enableSmoothing: true
        };
        
        // Create detector
        detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.BlazePose,
          detectorConfig
        );
        
        detectorRef.current = detector;
        console.log('Pose detector initialized successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing detector:', err);
        console.error('Error details:', err.message);
        setError(`Failed to initialize pose detection: ${err.message}`);
        setIsLoading(false);
      }
    };

    // Initialize detector
    initializeDetector();

    // Cleanup
    return () => {
      if (detector) {
        detector.dispose();
      }
    };
  }, [hasWebcamPermission]);

  const drawPose = (pose, ctx) => {
    if (!pose || !pose.keypoints) return;

    const video = webcamRef.current.video;
    if (!video) return;

    // Get video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set canvas size to match video
    ctx.canvas.width = videoWidth;
    ctx.canvas.height = videoHeight;

    // Clear previous frame
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    // Draw video frame
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    // Draw keypoints
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fill();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw skeleton
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle']
    ];

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(0, 255, 0)';

    connections.forEach(([start, end]) => {
      const startPoint = pose.keypoints.find(kp => kp.name === start);
      const endPoint = pose.keypoints.find(kp => kp.name === end);

      if (startPoint && endPoint && startPoint.score > 0.3 && endPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    });
  };

  const detectPose = async () => {
    if (!isTracking || !webcamRef.current?.video || !detectorRef.current || !canvasRef.current) {
      return;
    }

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    try {
      // Ensure video is playing and ready
      if (video.readyState < 2 || video.paused) {
        requestAnimationFrame(detectPose);
        return;
      }

      // Estimate poses
      const poses = await detectorRef.current.estimatePoses(video, {
        flipHorizontal: false,
        maxPoses: 1
      });

      if (poses && poses.length > 0) {
        drawPose(poses[0], ctx);

        if (poses[0].keypoints) {
          const exerciseService = new ExerciseService(exerciseType);
          const newCount = exerciseService.updateCounter(poses[0], exerciseType);
          if (newCount !== count) {
            setCount(newCount);
          }
        }
      }

      if (isTracking) {
        requestAnimationFrame(detectPose);
      }
    } catch (err) {
      console.error('Pose detection error:', err);
      if (isTracking) {
        requestAnimationFrame(detectPose);
      }
    }
  };

  const handleUserMedia = (stream) => {
    console.log('Camera stream ready');
    streamRef.current = stream;
    setHasWebcamPermission(true);
    setError(null);
    
    const video = webcamRef.current?.video;
    if (video) {
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Wait for video metadata to load
      video.onloadedmetadata = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          console.log('Canvas dimensions set:', canvas.width, canvas.height);
        }
      };
    }
  };

  const handleWebcamError = (error) => {
    console.error('Webcam error:', error);
    setError(
      isSafari 
        ? 'Safari requires camera access. Please check your System Preferences > Security & Privacy > Camera settings.'
        : 'Please allow camera access in your browser settings'
    );
    setIsLoading(false);
    setHasWebcamPermission(false);
    cleanup();
  };

  const handleStartTracking = () => {
    if (!hasWebcamPermission) {
      setError('Please allow camera access to start tracking');
      return;
    }
    setIsTracking(true);
    detectPose();
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  return (
    <div className="exercise-tracker">
      <header className="fade-in">
        <button className="back-button" onClick={onBack}>
          ← Back to Exercises
        </button>
        <h1>{exerciseType}</h1>
      </header>
      <div className="camera-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Initializing camera...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button 
              className="retry-button" 
              onClick={() => {
                setIsLoading(true);
                setError(null);
                cleanup();
                window.location.reload();
              }}
            >
              Retry Camera Access
            </button>
          </div>
        ) : (
          <>
            <div className="video-overlay">
              <Webcam
                ref={webcamRef}
                mirrored
                className="webcam"
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleWebcamError}
                playsInline={true}
                muted={true}
                audio={false}
              />
              <canvas
                ref={canvasRef}
                className="pose-canvas"
              />
            </div>
            <div className="controls fade-in">
              <div className="count-container">
                <div className="count-label">Current Count</div>
                <div className="count">{count}</div>
              </div>
              <button
                className={`track-button ${isTracking ? 'tracking' : ''}`}
                onClick={isTracking ? handleStopTracking : handleStartTracking}
                disabled={!hasWebcamPermission}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExerciseTracker; 