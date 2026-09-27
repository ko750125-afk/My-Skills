import fs from 'fs/promises';
import path from 'path';
import { X } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button } from '@/components/ui/button';

interface SkillEntry {
  id: string;
  title: string;
  path: string;
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // JSON 파일에서 스킬 경로 찾기
  const jsonPath = path.join(process.cwd(), 'skills.json');
  let skill: SkillEntry | undefined;
  
  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const skills: SkillEntry[] = JSON.parse(data);
    skill = skills.find(s => s.id === resolvedParams.id);
  } catch (err) {
    console.error('Failed to read skills.json', err);
  }

  if (!skill) return <div className="p-8 text-xl font-bold">Skill not found in skills.json</div>;

  // 해당 절대 경로에서 SKILL.md 파일 읽기
  let markdownContent = '';
  const skillMdPath = path.join(skill.path, 'SKILL.md');
  
  try {
    markdownContent = await fs.readFile(skillMdPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read SKILL.md', err);
    markdownContent = `> ⚠️ **Error**: 지정된 경로에서 \`SKILL.md\` 파일을 찾을 수 없습니다.\n\n경로: \`${skillMdPath}\`\n해당 위치에 파일이 존재하는지 확인해주세요.`;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-muted/10 p-6">
      {/* 상단 헤더 영역 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold">{skill.title}</h1>
          <p className="text-sm font-mono text-muted-foreground mt-1">📁 {skill.path}</p>
        </div>
        <Link href="/">
          <Button variant="ghost" size="icon">
            <X className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      {/* 마크다운 뷰어 영역 */}
      <div className="flex-1 overflow-y-auto bg-card border border-border shadow-sm rounded-lg p-8">
        <div className="prose prose-neutral dark:prose-invert max-w-4xl mx-auto prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
