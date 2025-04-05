import React, { useState } from 'react';
import ExerciseSelection from './components/ExerciseSelection';
import ExerciseTracker from './components/ExerciseTracker';
import './App.css';

function App() {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleSelectExercise = (exerciseType) => {
    setSelectedExercise(exerciseType);
  };

  const handleBack = () => {
    setSelectedExercise(null);
  };

  return (
    <div className="app">
      {selectedExercise ? (
        <ExerciseTracker
          exerciseType={selectedExercise}
          onBack={handleBack}
        />
      ) : (
        <ExerciseSelection onSelectExercise={handleSelectExercise} />
      )}
    </div>
  );
}

export default App; 