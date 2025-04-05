import streamlit as st
import cv2
import mediapipe as mp
import numpy as np
import time
from util import (
    PushUpCounter,
    JumpingJackCounter,
    SquatCounter,
    LungeCounter,
    HighKneeCounter
)

st.set_page_config(page_title="Exercise Counter", layout="centered")
st.title("🏋️ Real-time Exercise Counter")

st.markdown("### Select an Exercise:")

# Button layout
col1, col2, col3 = st.columns(3)
col4, col5 = st.columns(2)

if 'exercise' not in st.session_state:
    st.session_state.exercise = None

if col1.button("Push-Ups"):
    st.session_state.exercise = "Push-Up"
if col2.button("Jumping Jacks"):
    st.session_state.exercise = "Jumping Jack"
if col3.button("Squats"):
    st.session_state.exercise = "Squat"
if col4.button("Lunges"):
    st.session_state.exercise = "Lunge"
if col5.button("High Knees"):
    st.session_state.exercise = "High Knee"

exercise = st.session_state.exercise

if exercise:
    st.success(f"Selected: {exercise}")
    run = st.checkbox("▶️ Start Tracking")

    # Counters
    pushup_counter = PushUpCounter()
    jj_counter = JumpingJackCounter()
    squat_counter = SquatCounter()
    lunge_counter = LungeCounter()
    hk_counter = HighKneeCounter()

    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    cap = cv2.VideoCapture(0)
    image_placeholder = st.empty()

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while run:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.pose_landmarks:
                lm = results.pose_landmarks.landmark
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                count = 0
                label = ""

                if exercise == "Push-Up":
                    pushup_counter.update(lm)
                    count = pushup_counter.count
                    label = "Push-Ups"
                elif exercise == "Jumping Jack":
                    jj_counter.update(lm)
                    count = jj_counter.count
                    label = "Jumping Jacks"
                elif exercise == "Squat":
                    squat_counter.update(lm)
                    count = squat_counter.count
                    label = "Squats"
                elif exercise == "Lunge":
                    lunge_counter.update(lm)
                    count = lunge_counter.count
                    label = "Lunges"
                elif exercise == "High Knee":
                    hk_counter.update(lm)
                    count = hk_counter.count
                    label = "High Knees"

                cv2.putText(image, f"{label}: {count}", (10, 40),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 0), 2)

            image_placeholder.image(image, channels="BGR")
            time.sleep(0.03)

    cap.release()
    cv2.destroyAllWindows()