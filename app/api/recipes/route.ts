import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get('perPage') ?? 12);
    const category = request.nextUrl.searchParams.get('category') ?? '';
    const search = request.nextUrl.searchParams.get('search') ?? '';
    const ingredient = request.nextUrl.searchParams.get('ingredient') ?? '';

    const res = await api('/recipes', {
      params: {
        page,
        perPage,
        category,
        search,
        ingredient,
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 },
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
