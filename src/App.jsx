import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [editedTodo, setEditedTodo] = useState("");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addNewTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    const newTodos = [
      ...todos,
      { id: Date.now(), title: newTodo, completed: false },
    ];
    setTodos(newTodos);
    setNewTodo("");
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const completeTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const startEditing = (todo) => {
    setEditMode(true);
    setCurrentTodo(todo);
    setEditedTodo(todo.title);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (editedTodo.trim() === "") return;
    const updatedTodos = todos.map((todo) =>
      todo.id === currentTodo.id ? { ...todo, title: editedTodo } : todo
    );
    setTodos(updatedTodos);
    setEditMode(false);
    setCurrentTodo(null);
    setEditedTodo("");
  };

  return (
    <div className="App">
      <header>
        <h1>Todo List</h1>
      </header>
      <section className="container">
        <div className="form-container">
          <form onSubmit={editMode ? saveEdit : addNewTodo}>
            <input
              className="todo-input"
              type="text"
              value={editMode ? editedTodo : newTodo}
              onChange={(e) =>
                editMode
                  ? setEditedTodo(e.target.value)
                  : setNewTodo(e.target.value)
              }
            />
            <button className="todo-button" type="submit">
              {editMode ? "Save" : "Add"}
            </button>
          </form>
        </div>
        <div className="todo-container">
          <ul className="todo-list">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo ${todo.completed ? "completed" : ""}`}
              >
                <span>{todo.title}</span>
                <span>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => completeTodo(todo.id)}
                  />
                </span>
                <span>
                  <button
                    className="edit-button"
                    onClick={() => startEditing(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;
