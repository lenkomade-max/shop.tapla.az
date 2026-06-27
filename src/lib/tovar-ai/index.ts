// ============================================================================
// Tovar.AI — barrel export
// ============================================================================

export { analyzeProductImage } from './stage1-vision'
export { planCardPrompts } from './stage2-planner'
export { generateSingleCard, generateAllCards } from './stage3-generate'
export { checkCardQuality } from './stage4-qa'
export { runTovarAIPipeline } from './pipeline'
export {
  TOVAR_AI_CONFIG,
  type VisionOutput,
  type CardPrompt,
  type PromptsOutput,
  type CardResult,
  type QACheck,
  type QAResult,
  type GenerationStatus,
  type PipelineInput,
  type PipelineResult,
  type GenerationRecord,
} from './types'
