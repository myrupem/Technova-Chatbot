import { ChatPromptTemplate } from "@langchain/core/prompts"

const standAloneQuestionTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Ta ut det absoluta viktigaste i frågan, och omformulera till en tydlig, enkel fråga.",
  ],
  ["user", "Fråga: {question}."],
])

const answerTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Du är en hjälpsam kundsupportassistent för ett fiktivt företag som säljer teknikprodukter online. Använd endast den tillhandahållna kontexten för att svara på frågan. Om informationen finns i kontexten, svara direkt. Ta med i ditt svar vilken rubrik som avsnittet du hämtat infon kommer ifrån. Svara alltid vänligt och serviceinriktat. Kontext: {context}, fråga: {question}. Svara inte på något annat än det kontexten handlar om.",
  ],
  ["user", "Kontext: {context}, Fråga: {question}. Svar:"],
])

export { standAloneQuestionTemplate, answerTemplate }
