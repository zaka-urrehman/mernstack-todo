import './App.css';
import {useEffect} from 'react'

function App() {

  useEffect(()=>{
    async function getTodos(){
      const res = await fetch("/api/todos")
      const todos =await res.json()
      console.log(todos)
      return todos
    }

    getTodos()
  },[])

  return (
    <main>

      Hello this is main page of the app

    </main>
  );
}

export default App;
