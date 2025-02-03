import { useState, useEffect } from 'react';
import MoodSelector from './MoodSelector';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const moodOptions = [
    { emoji: "😊", text: "Happy" },
    { emoji: "😒", text: "Annoyed" },
    { emoji: "😢", text: "Sad" },
  ];

  const [moods, setMoods] = useState([]);
  const [deletedMoodsHistory, setDeletedMoodsHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  
  useEffect(() => {
    const savedMoods = JSON.parse(localStorage.getItem('moods')) || [];
    const savedDeletedMoods = JSON.parse(localStorage.getItem('deletedMoodsHistory')) || [];
    setMoods(savedMoods);
    setDeletedMoodsHistory(savedDeletedMoods);
  }, []);


  useEffect(() => {
    localStorage.setItem('moods', JSON.stringify(moods));
    localStorage.setItem('deletedMoodsHistory', JSON.stringify(deletedMoodsHistory));
  }, [moods, deletedMoodsHistory]);

  const addMood = (selectedMood) => {
    const newMood = { ...selectedMood, date: new Date().toLocaleString() };
    setMoods([...moods, newMood]);
    toast.success('Mood added!');
  };

  const deleteMood = (index) => {
    const newMoods = [...moods];
    const removedMood = newMoods.splice(index, 1);
    setDeletedMoodsHistory([removedMood[0], ...deletedMoodsHistory]);
    setMoods(newMoods);
    toast.error('Mood deleted!');
  };

  const undoDeletion = () => {
    if (deletedMoodsHistory.length > 0) {
      const restoredMood = deletedMoodsHistory[0];
      setMoods([...moods, restoredMood]);
      setDeletedMoodsHistory(deletedMoodsHistory.slice(1));
      toast.info('Mood restored!');
    }
  };

  const clearMoods = () => {
    setModalIsOpen(true); // Show confirmation modal
  };

  const confirmClear = () => {
    setMoods([]);
    setModalIsOpen(false);
    toast.warning('All moods cleared!');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

 
  const moodCounts = moods.reduce((counts, mood) => {
    counts[mood.text] = (counts[mood.text] || 0) + 1;
    return counts;
  }, {});

  const chartData = {
    labels: Object.keys(moodCounts),
    datasets: [{
      label: 'Mood Frequency',
      data: Object.values(moodCounts),
      backgroundColor: ['#42A5F5', '#FF7043', '#66BB6A'],
    }],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Mood Tracker</h2>

        <MoodSelector moodOptions={moodOptions} addMood={addMood} />

        <div className="flex justify-around mb-4">
          <button
            onClick={() => switchTab('list')}
            className={`px-4 py-2 ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
          >
            Mood List
          </button>
          <button
            onClick={() => switchTab('analytics')}
            className={`px-4 py-2 ${activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
          >
            Mood Analytics
          </button>
        </div>

        {activeTab === 'list' && (
          <div>
            <div className="mt-4">
              {moods.length > 0 && (
                <button
                  onClick={clearMoods}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                >
                  Clear All Moods
                </button>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Mood List</h3>
              <ul className="list-disc pl-5 mt-2">
                {moods.map((mood, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>{mood.date} {mood.emoji} {mood.text}</span>
                    <button
                      onClick={() => deleteMood(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {deletedMoodsHistory.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={undoDeletion}
                  className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Undo Last Deletion
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="mt-4">
            <h3 className="font-semibold">Mood Analytics</h3>
            <Bar data={chartData} />
          </div>
        )}
      </div>

      {/* Modal for clearing all moods */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="w-full max-w-sm mx-auto bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
        <p>Are you sure you want to clear all moods?</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={confirmClear}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Clear All
          </button>
        </div>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
