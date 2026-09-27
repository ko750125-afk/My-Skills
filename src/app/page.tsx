'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus } from 'lucide-react';

interface SkillEntry {
  id: string;
  title: string;
  path: string;
}

export default function HomePage() {
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newPath, setNewPath] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => setSkills(data));
  }, []);

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
      fetch('/api/skills').then(res => res.json()).then(data => setSkills(data));
    }
  };

  const handleOpenExplorer = async (folderPath: string) => {
    await fetch('/api/open-explorer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderPath })
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My All Skills</h1>
          <p className="text-muted-foreground text-sm">
            카드를 클릭하면 skill.md파일이 열립니다.
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant={isAdding ? "secondary" : "default"}>
          {isAdding ? "취소" : <><Plus className="w-4 h-4 mr-2" /> NEW SKILL</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-card/50 border-dashed border-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map(skill => (
          <Card
            key={skill.id}
            className="hover:border-primary transition-colors bg-card border shadow-sm group relative"
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenExplorer(skill.path);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                폴더 열기
              </Button>
            </div>
            <a href={`/skill/${skill.id}`} className="block h-full cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between pr-24">
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">{skill.title}</CardTitle>
                </div>
                <CardDescription className="font-mono text-xs break-all bg-muted/50 p-2 rounded">
                  {skill.path}
                </CardDescription>
              </CardHeader>
            </a>
          </Card>
        ))}
        {skills.length === 0 && !isAdding && (
          <div className="col-span-full text-center text-muted-foreground p-8 bg-muted/20 rounded-lg border border-dashed">
            우측 상단의 '새 스킬 등록' 버튼을 눌러 스킬 폴더를 등록해보세요.
          </div>
        )}
      </div>
    </div>
  );
}
