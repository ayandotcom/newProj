import numpy as np

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360 - angle if angle > 180.0 else angle

class PushUpCounter:
    def __init__(self):
        self.stage = None
        self.count = 0

    def update(self, lm):
        shoulder = [lm[11].x, lm[11].y]
        elbow = [lm[13].x, lm[13].y]
        wrist = [lm[15].x, lm[15].y]
        angle = calculate_angle(shoulder, elbow, wrist)
        if angle > 160:
            self.stage = "up"
        if angle < 90 and self.stage == 'up':
            self.stage = "down"
            self.count += 1

class JumpingJackCounter:
    def __init__(self):
        self.stage = "closed"
        self.count = 0

    def update(self, lm):
        hands_up = lm[15].y < lm[11].y and lm[16].y < lm[12].y
        feet_apart = abs(lm[27].x - lm[28].x) > 0.35
        if hands_up and feet_apart:
            if self.stage == "closed":
                self.stage = "open"
                self.count += 1
        else:
            self.stage = "closed"

class SquatCounter:
    def __init__(self):
        self.stage = None
        self.count = 0

    def update(self, lm):
        hip = [lm[23].x, lm[23].y]
        knee = [lm[25].x, lm[25].y]
        ankle = [lm[27].x, lm[27].y]
        angle = calculate_angle(hip, knee, ankle)
        if angle > 160:
            self.stage = "up"
        if angle < 90 and self.stage == 'up':
            self.stage = "down"
            self.count += 1

class LungeCounter:
    def __init__(self):
        self.stage = None
        self.count = 0

    def update(self, lm):
        front_knee = [lm[25].x, lm[25].y]
        hip = [lm[23].x, lm[23].y]
        shoulder = [lm[11].x, lm[11].y]
        angle = calculate_angle(front_knee, hip, shoulder)
        if angle > 160:
            self.stage = "up"
        if angle < 90 and self.stage == 'up':
            self.stage = "down"
            self.count += 1

class HighKneeCounter:
    def __init__(self):
        self.stage = "down"
        self.count = 0

    def update(self, lm):
        left_knee = lm[25].y
        left_hip = lm[23].y
        if left_knee < left_hip:
            if self.stage == "down":
                self.stage = "up"
                self.count += 1
        else:
            self.stage = "down"