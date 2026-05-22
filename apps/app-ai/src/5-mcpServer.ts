import { MultiServerMCPClient } from '@langchain/mcp-adapters'
import { createAgent } from 'langchain'

// 创建 MCP 客户端
const client = new MultiServerMCPClient({
  // 连接文件系统 MCP 服务器
  filesystem: {
    transport: 'stdio',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/directory'],
  },

  // 连接数学计算 MCP 服务器
  math: {
    transport: 'stdio',
    command: 'node',
    args: ['./mcp-servers/math-server.js'],
  },
})

// 获取所有 MCP 工具（自动转换为 LangChain 工具格式）
const mcpTools = await client.getTools()

// 创建 Agent
const agent = createAgent({
  model: 'openai:gpt-4o',
  tools: mcpTools,
})

// 使用
const result = await agent.invoke({
  messages: [{ role: 'user', content: '读取 README.md 文件的内容并总结' }],
})

console.log('---->', result)
