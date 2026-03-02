
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  async getReportSummary(projectName: string, geneList: string[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `请分析项目 "${projectName}" 中的以下显著差异表达基因列表：${geneList.join(', ')}。
    请用中文总结其生物学意义，并建议 2-3 条用于下游验证的信号通路。`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "暂时无法生成总结报告。";
    }
  }

  async suggestPipeline(sampleType: string, species: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `请为来自 ${species} 的 ${sampleType} 数据推荐一套最优的生物信息学分析流程。
    请列出关键的软件工具（如比对、定量、质控）并说明推荐原因。请用中文回答。`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "无法提供流程建议方案。";
    }
  }
}
