export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/app/api/api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    const formData = await req.formData();

    const accessToken = cookieStore.get('accessToken');
    const cookieHeader = accessToken
      ? `${accessToken.name}=${accessToken.value}`
      : '';

    const apiRes = await api.post('recipes/create-recipe', formData, {
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    if (apiRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);

      const status = error.response?.status || 500;

      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
