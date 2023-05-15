CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
