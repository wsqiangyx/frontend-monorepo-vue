import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

// 定义客服机器人的系统提示
const customerServicePrompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    `你是 TechCorp 公司的智能客服助手。

公司信息：
- 主营产品：企业级云存储服务
- 服务时间：7×24 小时
- 联系方式：support@techcorp.com

你的职责：
1. 解答产品相关问题
2. 协助处理技术问题
3. 收集用户反馈

回答要求：
- 语气友好、专业
- 如果不确定，引导用户联系人工客服
- 不要承诺具体的解决时间
- 涉及价格问题时，引导查看官网`,
  ],
  ['human', '{user_question}'],
])

// 使用示例
const model = new ChatOpenAI({ model: 'gpt-4o' })
const chain = customerServicePrompt.pipe(model)

const result = await chain.invoke({
  user_question: '你们的存储空间最大支持多少？',
})

console.log(result.content)
