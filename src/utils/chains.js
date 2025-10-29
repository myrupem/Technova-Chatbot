import { ChatOllama } from "@langchain/ollama"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { standAloneQuestionTemplate, answerTemplate } from "./promptTemplates"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ConversationSummaryBufferMemory } from "langchain/memory"

import { retrieveDocuments } from "./setupRetriever"

const llm = new ChatOllama({
  model: "llama3.1:8b",
  temperature: 0.4,
})

const memory = new ConversationSummaryBufferMemory({
  llm: new ChatOllama({ model: "llama3.1:8b", temperature: 0 }),
  maxTokenLimit: 1000,
})

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n")
}

const standAloneQuestionChain = RunnableSequence.from([
  standAloneQuestionTemplate,
  llm,
  new StringOutputParser(),
])

const retrieveDocumentsChain = RunnableSequence.from([
  (data) => {
    console.log(data)
    return data.standAloneQuestion
  },
  retrieveDocuments,
  combineDocuments,
])

const answerChain = RunnableSequence.from([
  (data) => {
    console.log(data)
    return data
  },
  answerTemplate,
  llm,
  new StringOutputParser(),
])

const coreChain = RunnableSequence.from([
  {
    standAloneQuestion: standAloneQuestionChain,
    originalQuestion: new RunnablePassthrough(),
  },
  {
    context: retrieveDocumentsChain,
    question: ({ originalQuestion }) => originalQuestion.question,
  },
  answerChain,
])

export async function chainWithMemory(input) {
  const history = memory.loadMemoryVariables({})
  const response = await coreChain.invoke({
    question: input.question,
    history,
  })
  await memory.saveContext({ input: input.question }, { output: response })
  return response
}
