import React, { useState, useEffect } from 'react';
import './ExerciseChatbot.css';

const exerciseRecommendations = {
  'weight loss': {
    beginner: {
      cardio: ['Jumping Jacks', 'High Knees'],
      strength: ['Push-Ups', 'Squats'],
      yoga: ['Downward Dog'],
      description: 'Start with these beginner-friendly exercises to build endurance.'
    },
    intermediate: {
      cardio: ['Jumping Jacks', 'High Knees', 'Mountain Climbers'],
      strength: ['Push-Ups', 'Squats', 'Lunges'],
      yoga: ['Downward Dog', 'Warrior II'],
      description: 'These exercises will help you burn more calories and build strength.'
    },
    advanced: {
      cardio: ['High-Intensity Jumping Jacks', 'Burpees'],
      strength: ['Diamond Push-Ups', 'Pistol Squats'],
      yoga: ['Advanced Downward Dog', 'Warrior III'],
      description: 'Challenge yourself with these high-intensity exercises.'
    }
  },
  'muscle building': {
    beginner: {
      upperBody: ['Knee Push-Ups'],
      lowerBody: ['Wall Squats'],
      core: ['Plank'],
      description: 'Start with these basic exercises to build foundation strength.'
    },
    intermediate: {
      upperBody: ['Push-Ups', 'Diamond Push-Ups'],
      lowerBody: ['Squats', 'Lunges'],
      core: ['Plank', 'Mountain Climbers'],
      description: 'These exercises will help you build muscle mass effectively.'
    },
    advanced: {
      upperBody: ['One-Arm Push-Ups'],
      lowerBody: ['Pistol Squats', 'Jumping Lunges'],
      core: ['Dragon Flags', 'Hanging Leg Raises'],
      description: 'Advanced exercises for maximum muscle growth.'
    }
  },
  'flexibility': {
    beginner: {
      dynamic: ['Gentle Jumping Jacks'],
      static: ['Tree Pose', 'Child\'s Pose'],
      description: 'Start with these gentle stretches to improve flexibility.'
    },
    intermediate: {
      dynamic: ['Jumping Jacks'],
      static: ['Tree Pose', 'Warrior II', 'Downward Dog'],
      description: 'These poses will help you achieve better flexibility.'
    },
    advanced: {
      dynamic: ['Dynamic Warrior Flow'],
      static: ['Advanced Tree Pose', 'Warrior III', 'Handstand'],
      description: 'Advanced poses for maximum flexibility gains.'
    }
  },
  'general fitness': {
    beginner: {
      cardio: ['Gentle Jumping Jacks'],
      strength: ['Wall Push-Ups', 'Chair Squats'],
      yoga: ['Child\'s Pose', 'Tree Pose'],
      description: 'Start with these beginner-friendly exercises.'
    },
    intermediate: {
      cardio: ['Jumping Jacks', 'High Knees'],
      strength: ['Push-Ups', 'Squats', 'Lunges'],
      yoga: ['Tree Pose', 'Warrior II', 'Downward Dog'],
      description: 'A balanced mix of exercises for overall fitness.'
    },
    advanced: {
      cardio: ['High-Intensity Jumping Jacks', 'Burpees'],
      strength: ['Diamond Push-Ups', 'Pistol Squats'],
      yoga: ['Advanced Tree Pose', 'Warrior III'],
      description: 'Advanced exercises for maximum fitness gains.'
    }
  }
};

const formTips = {
  'Push-Ups': [
    'Keep your body in a straight line from head to heels',
    'Lower your chest until it almost touches the ground',
    'Keep your elbows at a 45-degree angle',
    'Engage your core throughout the movement'
  ],
  'Squats': [
    'Keep your feet shoulder-width apart',
    'Push your hips back as if sitting in a chair',
    'Keep your knees aligned with your toes',
    'Maintain a straight back throughout'
  ],
  'Tree Pose': [
    'Find a focal point to help with balance',
    'Place your foot on your inner thigh, not your knee',
    'Keep your hips level and squared forward',
    'Bring your hands to prayer position at your chest'
  ],
  'Warrior II': [
    'Front knee should be directly above your ankle',
    'Back foot should be at a 45-degree angle',
    'Arms should be parallel to the ground',
    'Gaze should be over your front hand'
  ],
  'Downward Dog': [
    'Spread your fingers wide for better support',
    'Press your hips up and back',
    'Keep your arms and legs straight',
    'Try to bring your heels to the ground'
  ],
  'Jumping Jacks': [
    'Start with feet together and arms at your sides',
    'Jump while spreading your legs and raising your arms',
    'Land softly with knees slightly bent',
    'Keep your core engaged throughout the movement'
  ],
  'High Knees': [
    'Stand tall with feet hip-width apart',
    'Lift your knees as high as possible',
    'Pump your arms in sync with your legs',
    'Land softly on the balls of your feet'
  ],
  'Lunges': [
    'Keep your upper body straight',
    'Step forward with one leg, lowering your hips',
    'Both knees should be at 90 degrees',
    'Keep your front knee above your ankle'
  ]
};

function ExerciseChatbot({ onSelectExercise }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I can help you choose exercises based on your fitness goals. What would you like to focus on?' }
  ]);
  const [input, setInput] = useState('');
  const [goal, setGoal] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [showFormTips, setShowFormTips] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process user input
    const lowerInput = input.toLowerCase();
    let response = { type: 'bot', text: '' };

    if (!goal) {
      // First interaction - identify goal
      if (lowerInput.includes('weight') || lowerInput.includes('lose') || lowerInput.includes('fat')) {
        setGoal('weight loss');
        response.text = 'Great choice! For weight loss, I recommend focusing on high-intensity exercises. What\'s your current fitness level? (Beginner/Intermediate/Advanced)';
      } else if (lowerInput.includes('muscle') || lowerInput.includes('build') || lowerInput.includes('strength')) {
        setGoal('muscle building');
        response.text = 'Excellent! For muscle building, we\'ll focus on strength exercises. What\'s your current fitness level? (Beginner/Intermediate/Advanced)';
      } else if (lowerInput.includes('flexibility') || lowerInput.includes('stretch')) {
        setGoal('flexibility');
        response.text = 'Perfect! For flexibility, we\'ll focus on yoga poses and stretching. What\'s your current fitness level? (Beginner/Intermediate/Advanced)';
      } else {
        setGoal('general fitness');
        response.text = 'Sounds good! For general fitness, we\'ll include a mix of exercises. What\'s your current fitness level? (Beginner/Intermediate/Advanced)';
      }
    } else if (!difficulty) {
      // Set difficulty level
      if (lowerInput.includes('beginner')) {
        setDifficulty('beginner');
      } else if (lowerInput.includes('intermediate')) {
        setDifficulty('intermediate');
      } else if (lowerInput.includes('advanced')) {
        setDifficulty('advanced');
      } else {
        response.text = 'Please specify your fitness level: Beginner, Intermediate, or Advanced';
        setMessages(prev => [...prev, response]);
        return;
      }

      const recommendations = exerciseRecommendations[goal][difficulty];
      response.text = `Based on your goal of ${goal} and ${difficulty} level, here are my recommendations:\n\n`;
      
      Object.entries(recommendations).forEach(([category, exercises]) => {
        if (category !== 'description') {
          response.text += `${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
          exercises.forEach(exercise => {
            response.text += `- ${exercise}\n`;
          });
          response.text += '\n';
        }
      });
      
      response.text += `\n${recommendations.description}\n\nWould you like to try any of these exercises? Or would you like to see form tips for any exercise?`;
    } else if (lowerInput.includes('tips') || lowerInput.includes('form')) {
      // Show form tips
      const recommendations = exerciseRecommendations[goal][difficulty];
      const allExercises = Object.values(recommendations)
        .flat()
        .filter(exercise => typeof exercise === 'string');
      
      const exercise = allExercises.find(ex => 
        lowerInput.includes(ex.toLowerCase())
      );

      if (exercise && formTips[exercise]) {
        response.text = `Here are some form tips for ${exercise}:\n\n`;
        formTips[exercise].forEach((tip, index) => {
          response.text += `${index + 1}. ${tip}\n`;
        });
        response.text += '\nWould you like to try this exercise?';
        setCurrentExercise(exercise);
      } else {
        response.text = 'Which exercise would you like form tips for?';
      }
    } else if (lowerInput.includes('try') || lowerInput.includes('start')) {
      // User wants to try an exercise
      const recommendations = exerciseRecommendations[goal][difficulty];
      const allExercises = Object.values(recommendations)
        .flat()
        .filter(exercise => typeof exercise === 'string');
      
      const matchingExercise = allExercises.find(exercise => 
        lowerInput.includes(exercise.toLowerCase())
      ) || currentExercise;

      if (matchingExercise) {
        onSelectExercise(matchingExercise);
        response.text = `Great choice! Let's start with ${matchingExercise}. Remember to maintain proper form:\n\n`;
        if (formTips[matchingExercise]) {
          formTips[matchingExercise].forEach((tip, index) => {
            response.text += `${index + 1}. ${tip}\n`;
          });
        }
      } else {
        response.text = 'I didn\'t catch which exercise you\'d like to try. Could you please specify?';
      }
    } else if (lowerInput.includes('change') || lowerInput.includes('switch')) {
      // Reset to choose a different goal
      setGoal(null);
      setDifficulty(null);
      setCurrentExercise(null);
      response.text = 'What would you like to focus on? (Weight Loss/Muscle Building/Flexibility/General Fitness)';
    } else {
      response.text = 'I\'m not sure I understand. Could you please rephrase? You can ask for:\n- Exercise recommendations\n- Form tips\n- To try an exercise\n- To change your goal';
    }

    setMessages(prev => [...prev, response]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ExerciseChatbot; 