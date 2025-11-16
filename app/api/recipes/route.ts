import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';
import { api } from '@/app/api/api';

export async function GET(request: NextRequest) {
  try {
    const page = request.nextUrl.searchParams.get('page') ?? '';
    const perPage = request.nextUrl.searchParams.get('perPage');
    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search') ?? '';
    const ingredient = request.nextUrl.searchParams.get('ingredient');

    const res = await api.get('recipes', {
      params: {
        page,
        perPage,
        category,
        search,
        ingredient,
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
