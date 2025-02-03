import { useState } from 'react';

function MoodSelector({ moodOptions, addMood }) {
  const [selectedMood, setSelectedMood] = useState(moodOptions[0]);

  const handleMoodChange = (e) => {
    const selected = moodOptions.find(
      (mood) => mood.text === e.target.value
    );
    setSelectedMood(selected);
  };

  const handleAddMood = () => {
    addMood(selectedMood);
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <select
          onChange={handleMoodChange}
          value={selectedMood.text}
          className="border rounded-md px-4 py-2"
        >
          {moodOptions.map((mood) => (
            <option key={mood.text} value={mood.text}>
              {mood.emoji} {mood.text}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddMood}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Mood
        </button>
      </div>
    </div>
  );
}

export default MoodSelector;
