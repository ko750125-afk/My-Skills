import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const JSON_PATH = path.join(process.cwd(), 'skills.json');

export async function GET() {
  try {
    const data = await fs.readFile(JSON_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const newSkill = await req.json();
    
    let skills: any[] = [];
    try {
      const data = await fs.readFile(JSON_PATH, 'utf-8');
      skills = JSON.parse(data);
    } catch (e) {
      // file might not exist
    }

    const id = Date.now().toString();
    skills.push({ id, ...newSkill });
    
    await fs.writeFile(JSON_PATH, JSON.stringify(skills, null, 2));
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save skill' }, { status: 500 });
  }
}
