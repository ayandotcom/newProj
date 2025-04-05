import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

class PushUpCounter {
  constructor() {
    this.count = 0;
    this.stage = 'up';
  }

  update(pose) {
    const leftShoulder = pose.keypoints.find(kp => kp.part === 'leftShoulder');
    const leftElbow = pose.keypoints.find(kp => kp.part === 'leftElbow');
    const leftWrist = pose.keypoints.find(kp => kp.part === 'leftWrist');
    const rightShoulder = pose.keypoints.find(kp => kp.part === 'rightShoulder');
    const rightElbow = pose.keypoints.find(kp => kp.part === 'rightElbow');
    const rightWrist = pose.keypoints.find(kp => kp.part === 'rightWrist');

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
      return this.count;
    }

    const leftAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);

    if (this.stage === 'up' && leftAngle < 90 && rightAngle < 90) {
      this.stage = 'down';
    } else if (this.stage === 'down' && leftAngle > 160 && rightAngle > 160) {
      this.stage = 'up';
      this.count++;
    }

    return this.count;
  }

  calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180.0 ? 360 - angle : angle;
  }
}

class SquatCounter {
  constructor() {
    this.count = 0;
    this.stage = 'up';
  }

  update(pose) {
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
    const leftAnkle = pose.keypoints.find(kp => kp.part === 'leftAnkle');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    const rightKnee = pose.keypoints.find(kp => kp.part === 'rightKnee');
    const rightAnkle = pose.keypoints.find(kp => kp.part === 'rightAnkle');

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return this.count;
    }

    const leftAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);

    if (this.stage === 'up' && leftAngle < 90 && rightAngle < 90) {
      this.stage = 'down';
    } else if (this.stage === 'down' && leftAngle > 160 && rightAngle > 160) {
      this.stage = 'up';
      this.count++;
    }

    return this.count;
  }

  calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180.0 ? 360 - angle : angle;
  }
}

class JumpingJackCounter {
  constructor() {
    this.count = 0;
    this.stage = 'closed';
  }

  update(pose) {
    const leftShoulder = pose.keypoints.find(kp => kp.part === 'leftShoulder');
    const leftWrist = pose.keypoints.find(kp => kp.part === 'leftWrist');
    const rightShoulder = pose.keypoints.find(kp => kp.part === 'rightShoulder');
    const rightWrist = pose.keypoints.find(kp => kp.part === 'rightWrist');
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');

    if (!leftShoulder || !leftWrist || !rightShoulder || !rightWrist || !leftHip || !rightHip) {
      return this.count;
    }

    const handsUp = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
    const feetApart = Math.abs(leftHip.x - rightHip.x) > 0.2;

    if (this.stage === 'closed' && handsUp && feetApart) {
      this.stage = 'open';
      this.count++;
    } else if (this.stage === 'open' && !handsUp && !feetApart) {
      this.stage = 'closed';
    }

    return this.count;
  }
}

class LungeCounter {
  constructor() {
    this.count = 0;
    this.stage = 'up';
  }

  update(pose) {
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
    const leftAnkle = pose.keypoints.find(kp => kp.part === 'leftAnkle');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    const rightKnee = pose.keypoints.find(kp => kp.part === 'rightKnee');
    const rightAnkle = pose.keypoints.find(kp => kp.part === 'rightAnkle');

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return this.count;
    }

    const leftAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);

    if (this.stage === 'up' && (leftAngle < 90 || rightAngle < 90)) {
      this.stage = 'down';
    } else if (this.stage === 'down' && leftAngle > 160 && rightAngle > 160) {
      this.stage = 'up';
      this.count++;
    }

    return this.count;
  }

  calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180.0 ? 360 - angle : angle;
  }
}

class HighKneeCounter {
  constructor() {
    this.count = 0;
    this.stage = 'down';
  }

  update(pose) {
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    const rightKnee = pose.keypoints.find(kp => kp.part === 'rightKnee');

    if (!leftHip || !leftKnee || !rightHip || !rightKnee) {
      return this.count;
    }

    const leftKneeUp = leftKnee.y < leftHip.y;
    const rightKneeUp = rightKnee.y < rightHip.y;

    if (this.stage === 'down' && (leftKneeUp || rightKneeUp)) {
      this.stage = 'up';
      this.count++;
    } else if (this.stage === 'up' && !leftKneeUp && !rightKneeUp) {
      this.stage = 'down';
    }

    return this.count;
  }
}

class ExerciseService {
  constructor() {
    this.detector = null;
    this.count = 0;
    this.stage = 'up';
    this.counters = {
      'Push-Ups': new PushUpCounter(),
      'Squats': new SquatCounter(),
      'Jumping Jacks': new JumpingJackCounter(),
      'Lunges': new LungeCounter(),
      'High Knees': new HighKneeCounter()
    };
  }

  setDetector(detector) {
    this.detector = detector;
  }

  calculateAngle(firstPoint, midPoint, lastPoint) {
    if (!firstPoint || !midPoint || !lastPoint) return 0;

    const radians = Math.atan2(
      lastPoint.y - midPoint.y,
      lastPoint.x - midPoint.x
    ) - Math.atan2(
      firstPoint.y - midPoint.y,
      firstPoint.x - midPoint.x
    );

    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  getKeypoint(keypoints, name) {
    const point = keypoints.find(kp => kp.name === name);
    return point ? { x: point.x, y: point.y, score: point.score } : null;
  }

  updateCounter(pose, exerciseType) {
    if (!pose || !pose.keypoints) return this.count;

    switch (exerciseType) {
      case 'Push-ups':
        return this._countPushUps(pose.keypoints);
      case 'Squats':
        return this._countSquats(pose.keypoints);
      case 'Jumping Jacks':
        return this._countJumpingJacks(pose.keypoints);
      default:
        return this.count;
    }
  }

  _countPushUps(keypoints) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const leftElbow = this.getKeypoint(keypoints, 'left_elbow');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    
    if (!leftShoulder || !leftElbow || !leftWrist) return this.count;
    
    const angle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
    
    if (angle > 160 && this.stage === 'down') {
      this.stage = 'up';
      this.count++;
    } else if (angle < 90 && this.stage === 'up') {
      this.stage = 'down';
    }
    
    return this.count;
  }

  _countSquats(keypoints) {
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const leftKnee = this.getKeypoint(keypoints, 'left_knee');
    const leftAnkle = this.getKeypoint(keypoints, 'left_ankle');
    
    if (!leftHip || !leftKnee || !leftAnkle) return this.count;
    
    const angle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    
    if (angle > 160 && this.stage === 'down') {
      this.stage = 'up';
      this.count++;
    } else if (angle < 90 && this.stage === 'up') {
      this.stage = 'down';
    }
    
    return this.count;
  }

  _countJumpingJacks(keypoints) {
    const leftShoulder = this.getKeypoint(keypoints, 'left_shoulder');
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const leftWrist = this.getKeypoint(keypoints, 'left_wrist');
    
    if (!leftShoulder || !leftHip || !leftWrist) return this.count;
    
    const angle = this.calculateAngle(leftWrist, leftShoulder, leftHip);
    
    if (angle > 150 && this.stage === 'down') {
      this.stage = 'up';
      this.count++;
    } else if (angle < 60 && this.stage === 'up') {
      this.stage = 'down';
    }
    
    return this.count;
  }

  validatePose(pose, poseType) {
    if (!pose || !pose.keypoints) {
      return {
        isValid: false,
        message: 'No pose detected',
        corrections: ['Make sure your full body is visible'],
        progress: 0,
        remainingTime: 30
      };
    }

    switch (poseType) {
      case 'Tree Pose':
        return this._validateTreePose(pose.keypoints);
      case 'Warrior II':
        return this._validateWarriorII(pose.keypoints);
      case 'Downward Dog':
        return this._validateDownwardDog(pose.keypoints);
      default:
        return {
          isValid: false,
          message: 'Unknown pose type',
          corrections: [],
          progress: 0,
          remainingTime: 30
        };
    }
  }

  _validateTreePose(keypoints) {
    const leftHip = this.getKeypoint(keypoints, 'left_hip');
    const leftKnee = this.getKeypoint(keypoints, 'left_knee');
    const leftAnkle = this.getKeypoint(keypoints, 'left_ankle');
    const rightHip = this.getKeypoint(keypoints, 'right_hip');
    const rightKnee = this.getKeypoint(keypoints, 'right_knee');
    const rightAnkle = this.getKeypoint(keypoints, 'right_ankle');

    if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
      return {
        isValid: false,
        message: 'Cannot see all required body parts',
        corrections: ['Make sure your full lower body is visible'],
        progress: 0,
        remainingTime: 30
      };
    }

    const standingLegAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const raisedLegAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);

    const corrections = [];
    let isValid = true;

    if (standingLegAngle < 160) {
      corrections.push('Straighten your standing leg');
      isValid = false;
    }

    if (raisedLegAngle > 130 || raisedLegAngle < 50) {
      corrections.push('Position your raised foot against your inner thigh or calf');
      isValid = false;
    }

    return {
      isValid,
      message: isValid ? 'Good form!' : 'Adjust your pose',
      corrections,
      progress: isValid ? 100 : 0,
      remainingTime: 30
    };
  }

  _validateWarriorII(keypoints) {
    // Implementation for Warrior II validation
    return {
      isValid: true,
      message: 'Warrior II validation not implemented yet',
      corrections: [],
      progress: 0,
      remainingTime: 30
    };
  }

  _validateDownwardDog(keypoints) {
    // Implementation for Downward Dog validation
    return {
      isValid: true,
      message: 'Downward Dog validation not implemented yet',
      corrections: [],
      progress: 0,
      remainingTime: 30
    };
  }
}

export default ExerciseService; 