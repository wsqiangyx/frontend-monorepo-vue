// 需要先创建一个模型实例
import { ChatOpenAI } from '@langchain/openai'
// 第一步：加载环境变量（必须在最顶部）
import 'dotenv/config'
const { OPENAI_API_KEY, API_URL } = process.env

export const model = new ChatOpenAI('gpt-5.4', {
  apiKey: OPENAI_API_KEY,
  // 强制开启 JSON 输出模式
  // 注意：这只是保证输出是合法 JSON，不保证字段结构
  responsesFormat: { type: 'json_object' },
  // 指定使用的 API Base URL
  // 适用于代理服务器或兼容 OpenAI 接口的服务
  configuration: {
    baseURL: API_URL,
  },
})
