import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: Request) {
  try {
    const { folderPath } = await req.json();
    
    // 윈도우 환경에서 탐색기 열기 (start 명령어)
    exec(`start "" "${folderPath}"`, (error) => {
      if (error) {
        console.error('Failed to open explorer:', error);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
