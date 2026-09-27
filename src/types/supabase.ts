export interface Skill {
  id: string;
  title: string;
  description: string;
  content: string;
  type: string;
  tech_stack: string[];
  is_pinned: boolean;
  api_endpoint: string;
  created_at: string;
}

export interface ExecutionLog {
  id: string;
  skill_id: string;
  input_payload: Record<string, any>;
  output_result: Record<string, any>;
  status: 'pending' | 'success' | 'error';
  latency_ms: number;
  created_at: string;
}
