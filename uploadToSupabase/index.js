import { readFile } from "fs/promises"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"
import { OllamaEmbeddings } from "@langchain/ollama"
import "dotenv/config"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY

try {
  const text = await readFile(`${process.cwd()}/document.txt`, "utf-8") //Samma namn som text dokumentet i samma mapp!

  const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    separators: ["\n\n", "\n", " ", ""],
    chunkOverlap: 50,
  })

  const splittedText = await text_splitter.createDocuments([text])
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY)

  const embeddings = new OllamaEmbeddings({ model: "llama3.1:8b" })
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "technova_documents",
  })

  // Lägg till dokumenten
  await vectorStore.addDocuments(splittedText)
} catch (error) {
  console.log(error)
}
