import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="site">
      <main>
        <Hero />
        <Work />
        <About />
      </main>
      <Footer />
    </div>
  )
}

export default App
