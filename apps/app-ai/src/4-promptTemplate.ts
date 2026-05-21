import { model } from './model'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { AIMessage, HumanMessage } from '@langchain/core/messages'

const template = ChatPromptTemplate.fromMessages([
  ['system', '你是一个帮助助手'],
  new MessagesPlaceholder('chat_message'),
  ['human', '{input}'],
])
const chain = template.pipe(model)

const chatHistory = [
  new HumanMessage('我叫张三'),
  new AIMessage('你好，张三！有什么可以帮助到你？'),
  new HumanMessage('我喜欢吃打卤面'),
  new AIMessage('好的，记下你喜欢吃打卤面！'),
]
const result = await chain.invoke({
  chat_history: chatHistory,
  input: '我叫什么名字?',
})

console.log('---->', result.content)
