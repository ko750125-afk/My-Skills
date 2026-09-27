import fs from 'fs/promises';
import path from 'path';
import { X } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button } from '@/components/ui/button';

import defaultSkills from '../../../../skills.json';

interface SkillEntry {
  id: string;
  title: string;
  path: string;
}

export default async function SkillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // JSON 파일에서 스킬 경로 찾기 (실시간 파일 or 번들 폴백)
  const jsonPath = path.join(process.cwd(), 'skills.json');
  let skill: SkillEntry | undefined;
  
  try {
    const data = await fs.readFile(jsonPath, 'utf-8');
    const skills: SkillEntry[] = JSON.parse(data);
    skill = skills.find(s => s.id === resolvedParams.id);
  } catch (err) {
    skill = (defaultSkills as SkillEntry[]).find(s => s.id === resolvedParams.id);
  }

  if (!skill) {
    skill = (defaultSkills as SkillEntry[]).find(s => s.id === resolvedParams.id);
  }

  if (!skill) return (
    <div className="p-8 text-center max-w-md mx-auto mt-20 bg-card border rounded-xl p-8 shadow-sm">
      <h2 className="text-xl font-bold mb-2">스킬을 찾을 수 없습니다</h2>
      <p className="text-sm text-muted-foreground mb-4">등록되지 않았거나 삭제된 스킬입니다.</p>
      <Link href="/"><Button variant="default">목록으로 돌아가기</Button></Link>
    </div>
  );

  // 해당 절대 경로에서 SKILL.md 파일 읽기
  let markdownContent = '';
  const skillMdPath = path.join(skill.path, 'SKILL.md');
  let isLocalFileAvailable = true;
  
  try {
    markdownContent = await fs.readFile(skillMdPath, 'utf-8');
  } catch (err) {
    isLocalFileAvailable = false;
    markdownContent = `### 💡 로컬 전용 마크다운 안내
본 스킬의 상세 내용(\`SKILL.md\`)은 **대표님 개인 PC 로컬 드라이브**에 보관되어 있습니다.

* **스킬명:** ${skill.title}
* **보관 경로:** \`${skill.path}\`

> **안내:** 웹 배포(Vercel) 환경에서는 보안상 개인 PC의 로컬 파일에 직접 접근할 수 없습니다.  
> 마크다운 전문 열람 및 편집은 **대표님 컴퓨터의 로컬 주소(\`http://localhost:3000\`)**에서 이용해 주시기 바랍니다.`;
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
