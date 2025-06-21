import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Header from '../components/Header';
import axios from 'axios';
import { Notification } from '../util/Notification';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface Note {
  _id: string;
  title: string | undefined;
  content: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const Dashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [user, setUser] = useState<{ name: string; email: string }>({ name: '', email: '' });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDescription = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    const fetchUserandNotes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${apiBaseUrl}/notes/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        const notes = await axios.get(`${apiBaseUrl}/notes/getAllNotes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotes(notes.data.notes)
        setUser(res.data.user);




      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserandNotes();
  }, []);



  const handleCreateNote = () => setShowModal(true);

  const handleModalSubmit = async () => {
    if(!newTitle || !newContent){
      return Notification("All Fields required","error");
    }

    
    if (newTitle.trim()) {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.post(
          `${apiBaseUrl}/notes/createNotes`,
          {
            title: newTitle,
            content: newContent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {

          setNotes(prevNotes => [res.data.note, ...prevNotes]);

          setNewTitle('');
          setNewContent('');
          setShowModal(false);
          Notification(res.data.message, "success");


          return;

        }

        Notification(res.data.message, "error");


      } catch (err) {
        console.error('Error adding note:', err);
      }
    }
  };

  const handleDelete = async (noteId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`${apiBaseUrl}/notes/deleteNotes/${noteId}`, {

        headers: {
          Authorization: `Bearer ${token}`,
        },

      });



      if (response.data.success) {

        Notification(response.data.message, "success");
        setNotes(notes.filter(n => n._id !== noteId));

        return;
      }

      Notification(response.data.message, "error");


    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center p-4 transition-colors duration-300">
      <Header />

      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-lg font-semibold">Welcome, {user.name}!</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Email: {user.email}</p>
      </div>

      <button
        onClick={handleCreateNote}
        className="w-full max-w-md bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg mb-4 transition"
      >
        Create Note
      </button>

      <div className="w-full max-w-md">
        <h3 className="text-md font-semibold mb-2">Notes</h3>

        {
          notes.length == 0 && (<>
            <span>
              No Notes Found
            </span>

          </>)
        }

        {notes && notes.map((note, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-2"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleDescription(index)}
            >
              <span className="font-medium">{note.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note._id);
                }}
              >
                <FiTrash2 className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            {openIndex === index && (
              <p className="mt-2 text-gray-700 dark:text-gray-200">{note.content}</p>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-lg font-bold mb-1">Add New Note</h2>

            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
              className="w-full p-2 border rounded-md mb-4 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600 resize-none h-24"
              placeholder="Enter note descriptionss"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-md text-sm text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
