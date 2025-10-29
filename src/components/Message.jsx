import "./Message.css"

function Message({ content, role }) {
  const isOwnMessage = role === "user"

  return (
    <article className={`message-row ${isOwnMessage ? "own" : "bot"}`}>
      <section className="message-bubble">
        <p>{content}</p>
      </section>
    </article>
  )
}

export default Message
