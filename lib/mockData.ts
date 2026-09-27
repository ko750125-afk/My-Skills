import { Skill } from '../types/supabase';

export const mockSkills: Skill[] = [
  {
    id: '1',
    title: 'StudyNote AI',
    description: '학습 자료를 바탕으로 요약 노트와 테스트 문제를 자동 생성하는 에이전트',
    content: '## 아키텍처\n이 에이전트는 사용자가 업로드한 텍스트나 PDF를 기반으로 LangChain을 통해 문맥을 파악하고 요약 노트를 생성합니다.',
    type: 'Agent',
    tech_stack: ['Next.js', 'LangChain', 'Supabase'],
    is_pinned: true,
    api_endpoint: '/api/skills/studynote',
    created_at: '2023-10-01T12:00:00Z',
  },
  {
    id: '2',
    title: '일본어 회화 시나리오 봇',
    description: '자연스러운 일본어 구어체와 뉘앙스를 학습하기 위한 대화형 프롬프트',
    content: '## 프롬프트 구조\n주어진 상황과 역할극에 맞게 Gemini가 일본어 네이티브 스피커처럼 응답합니다.',
    type: 'Prompt',
    tech_stack: ['Gemini', 'Prompt Engineering'],
    is_pinned: false,
    api_endpoint: '/api/skills/jp-conversation',
    created_at: '2023-10-02T15:30:00Z',
  }
];
