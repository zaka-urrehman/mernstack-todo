import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")


  useEffect(() => {
    async function getTodos() {
      const res = await fetch("/api/todos")
      const todos = await res.json()
      setTodos(todos)
    }

    getTodos()
  }, [todos])

  const handleSubmit = (e) => {
    e.preventDefault()
    async function addTodo() {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: input }),
          headers: {
            "Content-Type": "application/json"
          },
        })

        const newTodo = await res.json()
        setTodos([...todos, newTodo])
      } catch (error) {
        console.log(error)
      }
    }
    addTodo()
    setInput("")
  }

  const deleteTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    const result = await res.json()
    console.log(result)
  }
  const updateTodo =  (id) => {
    const markCompleted = async () => {try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
      });
      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error('Error marking todo as completed:', error);
    }}

    markCompleted();

    
  };

  return (
    <main>

      <div>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type='submit'>Add Todo</button>
        </form>
      </div>

      <div>
        {todos.map((todo) => (
          <div key={todo._id} className={`todo-item ${todo.status === true ? "completed" : ""}`} >
            <p>{todo.todo}</p>
            <input type='checkbox' checked={todo.status} onChange={() => updateTodo(todo._id)} />
            <button onClick={() => deleteTodo(todo._id)}>X</button>
          </div>
        ))}
      </div>


    </main>
  );
}

export default App;
