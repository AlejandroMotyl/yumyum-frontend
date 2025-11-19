import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '@/app/api/api';
import { logErrorResponse } from '../../../_utils/utils';
import { Recipe } from '@/types/recipe';
import { cookies } from 'next/headers';

type Params = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function POST(_: Request, { params }: Params) {
  try {
    const { recipeId } = await params;
    const cookieStore = await cookies();

    const res = await api.post<Recipe>(
      `recipes/favorites/${recipeId}`,
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

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

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { recipeId } = await params;
    const cookieStore = await cookies();

    const res = await api.delete<Recipe>(`recipes/favorites/${recipeId}`, {
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
