import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Nodeify Chess</h1>
          <p className="subtitle">Chess knowledge explorer</p>
        </div>
      </header>

      <main className="workspace">
        <section className="panel hero-panel">
          <h2>Starting Position</h2>
          <p>
            This will become the root neuron of your chess exploration map.
          </p>
        </section>

        <section className="panel">
          <h2>Next Build Steps</h2>
          <ul>
            <li>Render a chessboard.</li>
            <li>Load the initial position.</li>
            <li>Generate legal moves with chess.js.</li>
            <li>Turn positions into connected nodes.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App