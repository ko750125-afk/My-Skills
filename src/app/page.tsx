'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Plus, Copy, Check, ExternalLink, Laptop, Cloud } from 'lucide-react';
import Link from 'next/link';
import defaultSkills from '../../skills.json';

interface SkillEntry {
  id: string;
  title: string;
  path: string;
}

export default function HomePage() {
  const [skills, setSkills] = useState<SkillEntry[]>(defaultSkills as SkillEntry[]);
  const [newTitle, setNewTitle] = useState('');
  const [newPath, setNewPath] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLocal, setIsLocal] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // 로컬 환경인지 Vercel 등 배포 환경인지 확인
    if (typeof window !== 'undefined') {
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      setIsLocal(isLocalHost);
    }

    // 최신 스킬 목록 fetch
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      })
      .catch(() => {
        // 실패 시 defaultSkills 유지
      });
  }, []);

  const handleCopyPath = (id: string, pathText: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(pathText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSkill = async () => {
    if (!newTitle.trim() || !newPath.trim()) return;

    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, path: newPath })
    });

    if (res.ok) {
      setNewTitle('');
      setNewPath('');
      setIsAdding(false);
      fetch('/api/skills')
        .then(res => res.json())
        .then(data => setSkills(data));
    }
  };

  const handleOpenExplorer = async (folderPath: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch('/api/open-explorer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderPath })
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight">My All Skills</h1>
            {isLocal ? (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1 py-1">
                <Laptop className="w-3.5 h-3.5" /> 로컬 모드
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 flex items-center gap-1 py-1">
                <Cloud className="w-3.5 h-3.5" /> 배포 열람 모드
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isLocal
              ? '카드를 클릭하면 로컬 SKILL.md 마크다운 파일이 열립니다.'
              : '현재 화면은 열람 전용 모드입니다. 아래 경로를 확인하거나 복사하여 활용하실 수 있습니다.'}
          </p>
        </div>

        {/* 신규 등록 버튼 (로컬 전용) or 배포 모드 안내 멘트 */}
        {isLocal ? (
          <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? 'secondary' : 'default'}>
            {isAdding ? '취소' : <><Plus className="w-4 h-4 mr-2" /> NEW SKILL</>}
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-lg shadow-sm">
            <span>⚠️ 로컬 환경에서만 스킬을 등록하고 확인하실 수 있습니다.</span>
          </div>
        )}
      </div>

      {/* 배포 환경 전용 안내 알림 카드 */}
      {!isLocal && (
        <div className="bg-muted/40 border border-border/80 rounded-lg p-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            💡 <strong>안내:</strong> 새 스킬 등록 및 상세 파일(SKILL.md) 확인은 내 컴퓨터의 로컬 주소(<code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">http://localhost:3000</code>)에서만 가능합니다.
          </p>
        </div>
      )}

      {/* 신규 등록 폼 (로컬) */}
      {isAdding && isLocal && (
        <Card className="bg-card/50 border-dashed border-2 shadow-sm animate-in fade-in-50 duration-200">
          <div className="p-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">스킬명</label>
              <Input
                placeholder="예: Vibe Coding Tutor"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
            </div>
            <div className="flex-2 flex-[2] space-y-2">
              <label className="text-sm font-medium">탐색기 폴더 경로 (절대 경로)</label>
              <Input
                placeholder="예: C:\Users\USER\.codex\skills\..."
                value={newPath}
                onChange={e => setNewPath(e.target.value)}
              />
            </div>
            <Button onClick={handleAddSkill} className="w-full md:w-auto">등록하기</Button>
          </div>
        </Card>
      )}

      {/* 스킬 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map(skill => (
          <Card
            key={skill.id}
            className="hover:border-primary/60 transition-all duration-200 bg-card border shadow-sm group relative flex flex-col justify-between overflow-hidden"
          >
            {/* 카드 액션 버튼 영역 (우측 상단) */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
              {/* 경로 복사 버튼 (항상 유용함) */}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleCopyPath(skill.id, skill.path, e)}
                className="h-8 px-2.5 text-xs bg-card/80 backdrop-blur hover:bg-muted"
                title="폴더 경로 복사"
              >
                {copiedId === skill.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <span>경로 복사</span>
                  </>
                )}
              </Button>

              {/* 로컬 전용 폴더 열기 버튼 */}
              {isLocal && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleOpenExplorer(skill.path, e)}
                  className="h-8 px-2.5 text-xs bg-card/80 backdrop-blur hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  title="윈도우 탐색기로 열기"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  열기
                </Button>
              )}
            </div>

            {/* 카드 본문 링크 */}
            <Link href={`/skill/${skill.id}`} className="block p-6 cursor-pointer flex-1">
              <CardHeader className="p-0">
                <div className="flex items-start justify-between pr-36">
                  <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {skill.title}
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </CardTitle>
                </div>
                <CardDescription
                  className="font-mono text-xs break-all bg-muted/60 hover:bg-muted p-2.5 rounded-md border border-border/50 text-foreground/80 mt-2 transition-colors flex items-center justify-between"
                  onClick={(e) => handleCopyPath(skill.id, skill.path, e)}
                >
                  <span className="truncate pr-2">{skill.path}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0 font-sans">클릭시 복사</span>
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}

        {skills.length === 0 && !isAdding && (
          <div className="col-span-full text-center text-muted-foreground p-12 bg-muted/20 rounded-xl border border-dashed">
            등록된 스킬이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
