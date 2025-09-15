import { useState } from 'react'
import './App.css'
import './App_custom.css'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to CS 5500!</h1>
        <h3>Runyuan Feng</h3>
        <p>This is my first React Vite TypeScript project.</p>
        <button onClick={() => setCount(count + 1)} className="homepage_item">
          Count: {count}
        </button>
        <button onClick={() => setCount(0)} className="homepage_item btn_danger">
          Reset
        </button>
        <input type="text" placeholder="Input count number..." className="homepage_item custom_input" />
        <button onClick={() => setCount(Number((document.querySelector('input') as HTMLInputElement).value))} className="homepage_item">
          Set Count
        </button>
      </header>
    </div>
  )
}

export default App