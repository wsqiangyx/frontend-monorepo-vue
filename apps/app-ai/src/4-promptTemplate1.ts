import { model } from './model'
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

// 第一步：定义模板
const prompt = PromptTemplate.fromTemplate('请用 {language} 语言写一个函数，功能是：{description}')

// 第二步：创建模型, 已从外部导入 model

// 第三步：创建输出解析器
const parser = new StringOutputParser()

// 第四步：构建链：prompt → model → parser
const chain = prompt.pipe(model).pipe(parser)

// 第五步：调用链
const result = await chain.invoke({
  language: 'TypeScript',
  description: '判断一个字符串是否为回文',
})

console.log('-->', result)

// 定义一个 ChatPromptTemplate
const chatPrompt = ChatPromptTemplate.fromMessages([
  // system 消息：设定角色和规则
  { role: 'system', content: '你是一位专业的 {language} 开发顾问，回答要专业且简洁。' },
  // human 消息：用户的输入（支持变量）
  { role: 'human', content: '{question}' },
])

const chain1 = chatPrompt.pipe(model)
const result1 = await chain1.invoke({
  language: 'TypeScript',
  question: 'async/await 和 Promise 有什么区别？',
})
console.log('1-->', result1)
