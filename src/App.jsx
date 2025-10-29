import { useState, useRef } from "react"
import "./App.css"
import { chainWithMemory } from "./utils/chains"

import Message from "./components/Message"

function App() {
  const inputRef = useRef()
  const [messages, setMessages] = useState([])

  async function sendAnswer(event) {
    event.preventDefault()

    const question = inputRef.current.value
    inputRef.current.value = ""

    setMessages((prevState) => {
      return [...prevState, { role: "user", content: question }]
    })

    const answer = await chainWithMemory({ question })

    console.log(answer)

    setMessages((prevState) => {
      return [...prevState, { role: "assistant", content: answer }]
    })
  }

  const messageComponents = messages.map((message, index) => {
    return <Message content={message.content} role={message.role} key={index} />
  })

  return (
    <main className="chat">
      <section className="chat__messages">{messageComponents}</section>
      <form className="chat__form" onSubmit={sendAnswer}>
        <input type="text" ref={inputRef} />
        <button type="submit">Fråga</button>
      </form>
    </main>
  )
}

export default App
