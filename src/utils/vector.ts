import { OpenAI } from 'langchain/llms/openai'
import { PrismaVectorStore } from 'langchain/vectorstores/prisma'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Prisma, PrismaClient, Document } from '@prisma/client'
import { prisma } from './prism';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `假设你是 GPT-4 模型，请你扮演一个中国法律专家的角色。
我将提供一个法律情境，你需要提供相关建议和法律规定。请只针对这种情况提供建议。根据文档中的具体条款回答问题，只使用文档中的信息。

请注意，如果法律规定有任何更新，请参考最新内容。你的输出必须是中文。如果你不确定，或者答案没有明确写在文档中，请回答：“对不起，我无法提供帮助。”

上下文: {context}
问题: {question}
请给出答案：`

export const makeChain = (vectorstore: PrismaVectorStore<Document, 'Document', any>) => {
  const model = new OpenAI({
    temperature: 0.5,
    modelName: 'gpt-3.5-turbo',
  }, {
    basePath: process.env.OPENAI_BASE_URL + '/v1'
  });

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorstore.asRetriever(),
    {
      qaTemplate: QA_PROMPT,
      // questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    },
  );
  return chain;
}

export const createVectorStore = () => {
  const embeddings = new OpenAIEmbeddings({}, {
    basePath: process.env.OPENAI_BASE_URL + '/v1'
  });

  const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
    embeddings,
    {
      prisma: Prisma,
      tableName: 'Document',
      vectorColumnName: 'vector',
      columns: {
        id: PrismaVectorStore.IdColumn,
        content: PrismaVectorStore.ContentColumn,
      },
    }
  )

  return vectorStore
}
