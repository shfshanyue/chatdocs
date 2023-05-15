import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { Prisma, PrismaClient, Document } from '@prisma/client'
import { prisma } from '@/utils/prism';
import { createVectorStore } from '@/utils/vector';

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader('docs', {
      '.pdf': (path) => new PDFLoader(path),
      '.docx': (path) => new DocxLoader(path),
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path),
      '.mdx': (path) => new TextLoader(path),
    }, true);

    console.log('正在载入文档')
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    });

    console.log('正在切割文档')
    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log('正在存储向量数据库', docs)
    // TODO: fromDocuments 不生效，需要再次 addModels，且 id 无去重，需重新优化
    // const vectorStore = await PrismaVectorStore.fromDocuments(docs, embeddings, {
    //   db: prisma,
    //   prisma: Prisma,
    //   tableName: 'Document',
    //   vectorColumnName: 'vector',
    //   columns: {
    //     id: PrismaVectorStore.IdColumn,
    //     content: PrismaVectorStore.ContentColumn,
    //   },
    // });
    const vectorStore = createVectorStore()
    const documents = await prisma.$transaction(
      docs.map((doc) => prisma.document.create({ data: { content: doc.pageContent } }))
    )
    console.log(documents)
    await vectorStore.addModels(documents)
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('Done');
})();
