import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';
import { api } from '@/app/api/api';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const page = request.nextUrl.searchParams.get('page') ?? '1';
    const perPage = request.nextUrl.searchParams.get('perPage') ?? '12';

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Missing access token' },
        { status: 401 },
      );
    }

    const cookieHeader = [
      `accessToken=${accessToken}`,
      refreshToken ? `refreshToken=${refreshToken}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    const res = await api.get('recipes/own', {
      params: {
        page,
        perPage,
      },
      headers: {
        Cookie: cookieHeader,
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
