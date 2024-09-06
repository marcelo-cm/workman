import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];
  return NextResponse.json(items, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return new NextResponse(JSON.stringify({ message: 'Received request' }), {
    status: StatusCodes.OK,
  });
}
