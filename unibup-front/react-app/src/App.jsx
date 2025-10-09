import { useState } from "react";
import "./index.css";

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Reunión de planificación", date: "2025-10-10", done: false },
    { id: 2, title: "Entrega del informe de avance", date: "2025-10-12", done: true },
    { id: 3, title: "Presentación final del proyecto", date: "2025-10-15", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-6 text-indigo-800 drop-shadow-md">
        🗓️ Cronograma de Actividades
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center justify-between mb-4 p-4 rounded-xl transition-all ${
              task.done
                ? "bg-green-100 border-l-4 border-green-500"
                : "bg-gray-100 border-l-4 border-indigo-500"
            }`}
          >
            <div>
              <h2
                className={`text-lg font-semibold ${
                  task.done ? "line-through text-gray-500" : "text-gray-800"
                }`}
              >
                {task.title}
              </h2>
              <p className="text-sm text-gray-500">{task.date}</p>
            </div>
            <button
              onClick={() => toggleTask(task.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                task.done
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              {task.done ? "Completado" : "Marcar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
