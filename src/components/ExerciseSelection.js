import React from 'react';
import ExerciseChatbot from './ExerciseChatbot';
import './ExerciseSelection.css';

const exercises = [
  { label: 'Push-Ups', type: 'Push-Up', icon: '💪' },
  { label: 'Jumping Jacks', type: 'Jumping Jack', icon: '🦘' },
  { label: 'Squats', type: 'Squat', icon: '🦵' },
  { label: 'Lunges', type: 'Lunge', icon: '🏃' },
  { label: 'High Knees', type: 'High Knee', icon: '🏃‍♂️' },
];

const yogaPoses = [
  { label: 'Tree Pose', type: 'Tree Pose', icon: '🌳', description: 'Balance on one leg with the other foot on your thigh' },
  { label: 'Warrior II', type: 'Warrior II', icon: '⚔️', description: 'Front knee bent at 90°, arms extended parallel to ground' },
  { label: 'Downward Dog', type: 'Downward Dog', icon: '🐕', description: 'Arms and legs straight, hips higher than shoulders' },
];

function ExerciseSelection({ onSelectExercise }) {
  return (
    <div className="exercise-selection">
      <header className="fade-in">
        <h1>🏋️ Exercise Counter</h1>
        <p className="subtitle">Select an exercise to start tracking</p>
      </header>

      <ExerciseChatbot onSelectExercise={onSelectExercise} />
      
      <section className="section-container">
        <h2 className="section-title">Exercises</h2>
        <div className="exercise-grid">
          {exercises.map(({ label, type, icon }, index) => (
            <div
              key={type}
              className="exercise-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onSelectExercise(type)}
            >
              <div className="exercise-icon">{icon}</div>
              <h3>{label}</h3>
              <div className="exercise-description">
                {type === 'Push-Up' && 'Track your push-up form and count'}
                {type === 'Jumping Jack' && 'Monitor your jumping jack movements'}
                {type === 'Squat' && 'Perfect your squat technique'}
                {type === 'Lunge' && 'Track your lunge repetitions'}
                {type === 'High Knee' && 'Count your high knee exercises'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container">
        <h2 className="section-title">Yoga Poses</h2>
        <p className="section-description">Hold each pose for 30 seconds to complete</p>
        <div className="exercise-grid">
          {yogaPoses.map(({ label, type, icon, description }, index) => (
            <div
              key={type}
              className="exercise-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onSelectExercise(type)}
            >
              <div className="exercise-icon">{icon}</div>
              <h3>{label}</h3>
              <div className="exercise-description">{description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ExerciseSelection; 