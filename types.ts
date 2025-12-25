
export enum NexusType {
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  LOGIC = 'LOGIC'
}

export enum NexusSubtype {
  WEBHOOK = 'WEBHOOK',
  SCHEDULE = 'SCHEDULE',
  HTTP_REQUEST = 'HTTP_REQUEST',
  AI_GENERATE = 'AI_GENERATE',
  DELAY = 'DELAY',
  CONDITION = 'CONDITION',
  LOGGER = 'LOGGER',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  GMAIL = 'GMAIL',
  SHEETS_READ = 'SHEETS_READ',
  SHEETS_WRITE = 'SHEETS_WRITE',
  AGENT = 'AGENT',
  CHAT_TRIGGER = 'CHAT_TRIGGER',
  STATIC_DATA = 'STATIC_DATA',
  WEB_SEARCH = 'WEB_SEARCH',
  // Premium Connectors
  NOTION = 'NOTION',
  RAZORPAY = 'RAZORPAY',
  AIRTABLE = 'AIRTABLE',
  SHOPIFY = 'SHOPIFY'
}

export type PlanTier = 'FREE' | 'STARTER' | 'PRO';
export type Region = 'IN' | 'GLOBAL';

export interface UsageStats {
  executionsThisMonth: number;
  maxExecutions: number;
  workflowsUsed: number;
  maxWorkflows: number;
  agentsUsed: number;
  maxAgents: number;
}

export interface UserPlan {
  tier: PlanTier;
  region: Region;
  status: 'active' | 'past_due' | 'canceled';
  expiresAt: number;
}

export interface DNSRecord {
  id: string;
  type: 'A' | 'CNAME' | 'TXT';
  host: string;
  value: string;
  ttl: string;
  status: 'active' | 'pending';
}

export interface DomainInfo {
  name: string;
  status: 'connected' | 'pending' | 'error';
  records: DNSRecord[];
}

export type AIProvider = 'openai' | 'gemini';
export type AppTheme = 'cyber' | 'nova' | 'matrix' | 'minimal';

export interface NexusConfig {
  url?: string;
  method?: string;
  headers?: string;
  body?: string;
  cron?: string;
  prompt?: string;
  delayMs?: number;
  condition?: string;
  content?: string;
  provider?: AIProvider;
  model?: string;
  apiKey?: string;
  systemMessage?: string;
  memoryWindow?: number;
  useGrounding?: boolean;
  enabledTools?: string[];
  sheetId?: string;
  range?: string;
  phoneNumber?: string;
  message?: string;
  [key: string]: any;
}

export interface Nexus {
  id: string;
  type: NexusType;
  subtype: NexusSubtype;
  label: string;
  position: { x: number; y: number };
  config: NexusConfig;
  status?: 'idle' | 'running' | 'success' | 'error';
  lastOutput?: any;
  groundingUrls?: string[];
  outputs?: string[]; 
  isPremium?: boolean;
}

export interface Synapse {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: number;
  nexusId: string;
  status: 'success' | 'error';
  message: string;
  duration: number;
  inputData?: any;
  outputData?: any;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  category: 'Trending' | 'Agentic' | 'Crypto' | 'General' | 'Enterprise' | 'India';
  nexuses: Nexus[];
  synapses: Synapse[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}
