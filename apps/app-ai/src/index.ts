// src/index.ts

// 第一步：加载环境变量（必须在最顶部）
import 'dotenv/config'
const { OPENAI_API_KEY, API_URL } = process.env

// 第二步：导入 LangChain 核心功能
import { createAgent, tool } from 'langchain'
import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'

// 第三步：定义天气查询工具
const getWeather = tool(
  async ({ city }) => {
    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`)
    if (!res.ok) return `${city}：无法获取天气数据`

    const data = await res.json()
    const current = data.current_condition[0]
    const temp = current.temp_C
    const humidity = current.humidity
    const desc = current.lang_zh[0]?.value ?? current.weatherDesc[0]?.value

    return `${city}：${desc}，${temp}°C，湿度 ${humidity}%`
  },
  {
    name: 'get_weather',
    description: '查询指定城市的当前天气',
    schema: z.object({
      city: z.string().describe('要查询天气的城市名称'),
    }),
  },
)

// 自定义一个询问时间的工具
const getTime = tool(
  () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const second = now.getSeconds()
    return `当前时间是：${year}-${month}-${day} ${hour}:${minute}:${second}`
  },
  {
    name: 'get_time',
    description: '查询当前时间',
    schema: z.object({}),
  },
)

// 第四步：创建 Agent

// openai只需传入模型的标识即可
// const agent = createAgent({
//   model: "openai:gpt-4o",
//   tools: [getWeather],
// });

// 千问模型需要先创建一个模型实例
const model = new ChatOpenAI('gpt-5.4', {
  apiKey: OPENAI_API_KEY,
  configuration: {
    baseURL: API_URL,
  },
})
// 创建的模型作为model参数传给createAgent
const agent = createAgent({
  model,
  tools: [getWeather, getTime],
})

/*// 第五步：调用 Agent 并输出结果
const stream = await agent.stream(
  { messages: [{ role: 'user', content: '北京和上海今天天气怎么样？' }] },
  { streamMode: 'values' },
)

// 遍历流式数据
for await (const chunk of stream) {
  const lastMessage = chunk.messages.at(-1)
  if (lastMessage instanceof AIMessage) {
    process.stdout.write(lastMessage.content as string)
  }
}*/
// 第五步：调用 Agent 并输出结果
const stream = await agent.stream(
  { messages: [{ role: 'user', content: '现在几点了？' }] },
  { streamMode: 'messages' },
)

// 遍历流式数据
for await (const [message] of stream) {
  // console.log('-->', message, metadata)
  // 逐字符输出，实现打字机效果
  process.stdout.write(message.content as string)
}
