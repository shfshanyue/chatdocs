# ChatGPT 知识库聊天机器人

使用 GPT-4 API 与 LangChain 构建适用于多个大型 `pdf`/`md`/`mdx`/`txt`/`epub` 等任意文件格式的 ChatGPT 智能知识库 AI 机器人。

## 环境要求

1. `node.js >= 18`
2. `docker`
3. `docker compose`

## 环境变量

| Name | Description | Default |
| --- | --- | --- |
| `DATABASE_URL` | DataBase URL for postgres. | `null` |
| `OPENAI_API_KEY` | Your API Key for OpenAI. | `null` |
| `OPENAI_BASE_URL` | Custom base url for OpenAI API. | `https://api.openai.com` |
| `OPENAI_API_MODEL` | ID of the model to use. [List models](https://platform.openai.com/docs/api-reference/models/list) | `gpt-3.5-turbo` |

## 搭建属于你自己的知识库

1. 进入 `docs` 文件夹, 置换为你们知识库的文档，包括且不限于 `pdf`/`md`/`mdx`/`txt` 等
1. 按照部署步骤进行上线

## 部署

### development

``` bash
# 装包
$ pnpm i

$ cp .env.example .env

# 修改环境变量，见上表
$ vim .env

# 启动 pgvector 数据库
$ docker compose up pgvector

# 迁移数据库
$ npx prisma migrate deploy

# 注入 vector
$ npx tsx scripts/inject.ts

# 启动服务
$ npm run dev
```

### docker

``` bash
$ docker compose up
```
