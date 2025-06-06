import { ColorLens, Download, Edit, EditNote, Google, RecordVoiceOver, Reddit, Search, Tag, Visibility } from "@mui/icons-material";
import { ApiType, ApiName, ModelApiType } from "../types/ApiTypes";
import { AIIcon, AnthropicIcon, ArxivIcon, AzureIcon, BarkIcon, CohereIcon, DeepseekIcon, GeminiIcon, GroqIcon, LlamaIcon, LMStudioIcon, 
  MistralIcon, OpenAiIcon, WikipediaIcon, WolframAlphaIcon } from "./CustomIcons";
import { ModelType } from "../types/ModelTypes";
import { HOST } from "./Constants";

// Base interfaces for API configurations
interface BaseApiConfig {
  api_key: string;
  base_url: string;
}

interface GoogleSearchConfig {
  api_key: string;
  cse_id: string;
}

interface LocalApiConfig {
  base_url: string;
}

interface RedditConfig {
  client_id: string;
  client_secret: string;
}

interface WolframConfig {
  app_id: string;
}

interface ExaConfig {
  api_key: string;
}

// Type for empty config (equivalent to Python's dict)
type EmptyConfig = Record<string, never>;

// Map API names to their configuration types
export type ApiConfigType = {
  [ApiName.OPENAI]: BaseApiConfig;
  [ApiName.ANTHROPIC]: BaseApiConfig;
  [ApiName.GEMINI]: BaseApiConfig;
  [ApiName.MISTRAL]: BaseApiConfig;
  [ApiName.COHERE]: BaseApiConfig;
  [ApiName.LLAMA]: BaseApiConfig;
  [ApiName.AZURE]: BaseApiConfig;
  [ApiName.GROQ]: BaseApiConfig;
  [ApiName.DEEPSEEK]: BaseApiConfig;
  [ApiName.GOOGLE_SEARCH]: GoogleSearchConfig;
  [ApiName.REDDIT]: RedditConfig;
  [ApiName.WIKIPEDIA]: EmptyConfig;
  [ApiName.EXA]: ExaConfig;
  [ApiName.ARXIV]: EmptyConfig;
  [ApiName.GOOGLE_KNOWLEDGE_GRAPH]: ExaConfig;
  [ApiName.WOLFRAM_ALPHA]: WolframConfig;
  [ApiName.LM_STUDIO]: LocalApiConfig;
  [ApiName.CUSTOM]: BaseApiConfig;
  [ApiName.BARK]: EmptyConfig;
  [ApiName.PIXART]: EmptyConfig;
};

// API capabilities mapping
export const API_CAPABILITIES: Record<ApiName, Set<ApiType>> = {
  [ApiName.OPENAI]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.IMG_GENERATION,
    ApiType.SPEECH_TO_TEXT,
    ApiType.TEXT_TO_SPEECH,
    ApiType.EMBEDDINGS
  ]),
  [ApiName.ANTHROPIC]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION
  ]),
  [ApiName.GEMINI]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.IMG_GENERATION,
    ApiType.SPEECH_TO_TEXT,
    ApiType.EMBEDDINGS
  ]),
  [ApiName.MISTRAL]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.EMBEDDINGS
  ]),
  [ApiName.COHERE]: new Set([
    ApiType.LLM_MODEL
  ]),
  [ApiName.LLAMA]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION
  ]),
  [ApiName.GROQ]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.TEXT_TO_SPEECH
  ]),
  [ApiName.DEEPSEEK]: new Set([
    ApiType.LLM_MODEL
  ]),
  [ApiName.AZURE]: new Set([
    ApiType.LLM_MODEL
  ]),
  [ApiName.GOOGLE_SEARCH]: new Set([
    ApiType.GOOGLE_SEARCH
  ]),
  [ApiName.REDDIT]: new Set([
    ApiType.REDDIT_SEARCH
  ]),
  [ApiName.WIKIPEDIA]: new Set([
    ApiType.WIKIPEDIA_SEARCH
  ]),
  [ApiName.EXA]: new Set([
    ApiType.EXA_SEARCH
  ]),
  [ApiName.ARXIV]: new Set([
    ApiType.ARXIV_SEARCH
  ]),
  [ApiName.GOOGLE_KNOWLEDGE_GRAPH]: new Set([
    ApiType.GOOGLE_KNOWLEDGE_GRAPH
  ]),
  [ApiName.WOLFRAM_ALPHA]: new Set([
    ApiType.WOLFRAM_ALPHA
  ]),
  [ApiName.BARK]: new Set([
    ApiType.TEXT_TO_SPEECH
  ]),
  [ApiName.PIXART]: new Set([
    ApiType.IMG_GENERATION
  ]),
  [ApiName.LM_STUDIO]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.EMBEDDINGS
  ]),
  [ApiName.CUSTOM]: new Set([
    ApiType.LLM_MODEL,
    ApiType.IMG_VISION,
    ApiType.IMG_GENERATION,
    ApiType.SPEECH_TO_TEXT,
    ApiType.TEXT_TO_SPEECH,
    ApiType.EMBEDDINGS
  ]),
};

export const API_BASE_URLS: Partial<Record<ApiName, string>> = {
  [ApiName.OPENAI]: 'https://api.openai.com/v1',
  [ApiName.AZURE]: 'https://YOUR_RESOURCE_NAME.openai.azure.com',
  [ApiName.ANTHROPIC]: 'https://api.anthropic.com',
  [ApiName.GEMINI]: 'https://api.gemini.ai',
  [ApiName.MISTRAL]: 'https://api.mistral.ai',
  [ApiName.LLAMA]: 'https://api.llama-api.com',
  [ApiName.COHERE]: 'https://api.cohere.ai',
  [ApiName.GROQ]: 'https://api.groq.com/openai/v1',
  [ApiName.DEEPSEEK]: 'https://api.deepseek.com/v1',
  [ApiName.LM_STUDIO]: `http://${HOST}:1234/v1`,
};

// Helper type to get config type for a specific API
export type GetApiConfig<T extends ApiName> = ApiConfigType[T];

export const apiNameIcons: Record<ApiName, React.ReactElement> = {
  [ApiName.REDDIT]: <Reddit />,
  [ApiName.GOOGLE_KNOWLEDGE_GRAPH]: <Google />,
  [ApiName.GOOGLE_SEARCH]: <Google />,
  [ApiName.GEMINI]: <GeminiIcon />,
  [ApiName.GROQ]: <GroqIcon />, 
  [ApiName.DEEPSEEK]: <DeepseekIcon />,
  [ApiName.ANTHROPIC]: <AnthropicIcon />,
  [ApiName.WIKIPEDIA]: <WikipediaIcon />,
  [ApiName.ARXIV]: <ArxivIcon />,
  [ApiName.WOLFRAM_ALPHA]: <WolframAlphaIcon />,
  [ApiName.OPENAI]: <OpenAiIcon />,
  [ApiName.COHERE]: <CohereIcon />,
  [ApiName.LLAMA]: <LlamaIcon />, 
  [ApiName.AZURE]: <AzureIcon />,
  [ApiName.MISTRAL]: <MistralIcon />, 
  [ApiName.EXA]: <Search />,
  [ApiName.LM_STUDIO]: <LMStudioIcon />,
  [ApiName.BARK]: <BarkIcon />,
  [ApiName.PIXART]: <ColorLens />, 
  [ApiName.CUSTOM]: <Edit />,
};

export const apiTypeIcons: Record<ApiType, React.ReactElement> = {
  [ApiType.LLM_MODEL]: <AIIcon />,
  [ApiType.IMG_VISION]: <Visibility />,
  [ApiType.IMG_GENERATION]: <ColorLens />,
  [ApiType.SPEECH_TO_TEXT]: <EditNote />,
  [ApiType.TEXT_TO_SPEECH]: <RecordVoiceOver />,
  [ApiType.EMBEDDINGS]: <Tag />,
  [ApiType.GOOGLE_SEARCH]: <Google />,
  [ApiType.REDDIT_SEARCH]: <Reddit />,
  [ApiType.WIKIPEDIA_SEARCH]: <WikipediaIcon />,
  [ApiType.ARXIV_SEARCH]: <ArxivIcon />,
  [ApiType.EXA_SEARCH]: <Search />,
  [ApiType.GOOGLE_KNOWLEDGE_GRAPH]: <Google />,
  [ApiType.WOLFRAM_ALPHA]: <WolframAlphaIcon />,
  [ApiType.REQUESTS]: <Download />,
};

export const modelTypeIcons: Record<ModelType, React.ReactElement> = {
  [ModelType.CHAT]: <AIIcon />,
  [ModelType.INSTRUCT]: <AIIcon />,
  [ModelType.IMG_GEN]: <ColorLens />,
  [ModelType.STT]: <EditNote />,
  [ModelType.TTS]: <RecordVoiceOver />,
  [ModelType.EMBEDDINGS]: <Tag />,
  [ModelType.VISION]: <Visibility />,
};

export function isModelApiType(apiType: ApiType): apiType is ApiType & ModelApiType {
  return Object.values(ModelApiType).includes(apiType as any);
}

// Type definitions for validation responses
type ValidationStatus = "valid" | "warning";
type LLMApiStatus = "valid" | "not_found" | "invalid";

export interface TaskValidationResult {
    task_name: string;
    status: ValidationStatus;
    warnings: string[];
    child_tasks: TaskValidationResult[];
}

export interface ChatValidationResult {
    chat_name: string;
    status: ValidationStatus;
    warnings: string[];
    llm_api: LLMApiStatus;
    agent_tools: TaskValidationResult[];
    retrieval_tools: TaskValidationResult[];
}

/**
 * Helper function to check if a validation result contains any warnings
 * @param result The validation result to check
 * @returns true if there are any warnings, false otherwise
 */
export const hasValidationWarnings = (
  result: ChatValidationResult | TaskValidationResult
): boolean => {
  if ('llm_api' in result) {
      // This is a ChatValidationResult
      return result.status === 'warning' || 
             result.llm_api !== 'valid' ||
             result.warnings.length > 0 ||
             result.agent_tools.some(hasValidationWarnings) ||
             result.retrieval_tools.some(hasValidationWarnings);
  } else {
      // This is a TaskValidationResult
      return result.status === 'warning' ||
             result.warnings.length > 0 ||
             result.child_tasks.some(hasValidationWarnings);
  }
};

export const initializeApiConfigMap = (): ApiConfigType => {
  const configMap: Partial<ApiConfigType> = {};
  
  Object.values(ApiName).forEach(apiName => {
    switch(apiName) {
      case ApiName.OPENAI:
      case ApiName.ANTHROPIC:
      case ApiName.GEMINI:
      case ApiName.MISTRAL:
      case ApiName.COHERE:
      case ApiName.LLAMA:
      case ApiName.AZURE:
      case ApiName.GROQ:
      case ApiName.DEEPSEEK:
      case ApiName.CUSTOM:
        configMap[apiName] = {
          api_key: '',
          base_url: API_BASE_URLS[apiName] || ''
        };
        break;
      
      case ApiName.GOOGLE_SEARCH:
        configMap[apiName] = {
          api_key: '',
          cse_id: ''
        };
        break;
        
      case ApiName.REDDIT:
        configMap[apiName] = {
          client_id: '',
          client_secret: ''
        };
        break;
        
      case ApiName.WOLFRAM_ALPHA:
        configMap[apiName] = {
          app_id: ''
        };
        break;
        
      case ApiName.EXA:
      case ApiName.GOOGLE_KNOWLEDGE_GRAPH:
        configMap[apiName] = {
          api_key: ''
        };
        break;
        
      case ApiName.LM_STUDIO:
        configMap[apiName] = {
          base_url: API_BASE_URLS[apiName] || ''
        };
        break;
        
      case ApiName.WIKIPEDIA:
      case ApiName.ARXIV:
      case ApiName.BARK:
      case ApiName.PIXART:
        configMap[apiName] = {};
        break;
    }
  });

  return configMap as ApiConfigType;
};

export interface UserApiUpdatePayload {
  userId: string;
  enabledApis: ApiName[];
}

export const compareApiConfigs = (
  current: ApiConfigType,
  original: ApiConfigType
): boolean => {
  return JSON.stringify(current) === JSON.stringify(original);
};