import { OllamaEmbeddings } from "@langchain/ollama"
import { createClient } from "@supabase/supabase-js"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY

const embeddings = new OllamaEmbeddings({ model: "llama3.1:8b" })
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY)

const vectorstore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "technova_documents",
  queryName: "match_technova_documents",
})

const retrieveDocuments = vectorstore.asRetriever() // 4 är default om man lämnar tomt

export { retrieveDocuments }
