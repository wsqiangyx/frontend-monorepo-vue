// src/tools/weather.ts

import { tool } from '@langchain/core/tools'
import { z } from 'zod'

export const getWeather = tool(
  async ({ city }) => {
    try {
      // 第一步：地理编码（城市名 → 经纬度）
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
      )
      const geoData = await geoRes.json()

      if (!geoData.results?.length) {
        return `找不到城市：${city}`
      }

      const { latitude, longitude } = geoData.results[0]

      // 第二步：获取天气数据
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m`,
      )
      const weatherData = await weatherRes.json()
      const current = weatherData.current

      // 第三步：格式化返回结果
      return JSON.stringify({
        city,
        temperature: `${current.temperature_2m}°C`,
        precipitation: `${current.precipitation}mm`,
        windSpeed: `${current.wind_speed_10m}km/h`,
      })
    } catch (error) {
      return `天气查询失败：${error instanceof Error ? error.message : '未知错误'}`
    }
  },

  // 元数据
  {
    name: 'get_weather',
    description: '查询指定城市的当前实时天气，返回温度、降水量和风速。适合回答关于天气的问题。',
    schema: z.object({
      city: z.string().describe("城市名称，支持中英文，如 '北京' 或 'Beijing'"),
      country: z.string().optional().describe('国家代码（ISO 3166），默认 CN'),
    }),
  },
)
