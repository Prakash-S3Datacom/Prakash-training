
import { useState } from "react";

import Button from "./components/Button";
import Card from "./components/Card";
import Input from "./components/Input";
import Modal from "./components/Modal";

import "./App.css";

function App() {
  const [taskName, setTaskName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const [tasks, setTasks] = useState<string[]>([
    "Learn React components",
    "Understand TypeScript props",
  ]);

  function handleAddTask() {
    if (!taskName.trim()) {
      return;
    }

    setTasks((previousTasks) => [
      ...previousTasks,
      taskName.trim(),
    ]);

    setTaskName("");
    setShowModal(false);
  }

  function handleDeleteTask(index: number) {
    setTasks((previousTasks) =>
      previousTasks.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="app">
      <h1>TaskFlow - Component Practice</h1>

      <Card
        title="My Tasks"
        footer={
          <Button
            label="Add New Task"
            onClick={() => setShowModal(true)}
          />
        }
      >
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          tasks.map((task, index) => (
            <div className="task-item" key={index}>
              <span>{task}</span>

              <Button
                label="Delete"
                variant="danger"
                onClick={() => handleDeleteTask(index)}
              />
            </div>
          ))
        )}
      </Card>

      <Modal
        title="Create New Task"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <Input
          label="Task Name"
          value={taskName}
          placeholder="Enter your task"
          onChange={setTaskName}
        />

        <Button
          label="Create Task"
          onClick={handleAddTask}
        />
      </Modal>
    </div>
  );
}

export default App;
