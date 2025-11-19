import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '@/app/api/api';
import { logErrorResponse } from '../../_utils/utils';
import { Recipe } from '@/types/recipe';

type Params = {
  params: Promise<{
    recipeId: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { recipeId } = await params;

    const res = await api.get<Recipe>(`recipes/id/${recipeId}`);

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
