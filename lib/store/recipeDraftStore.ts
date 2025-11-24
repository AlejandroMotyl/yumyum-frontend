import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecipeFormValues } from '@/types/recipe';
import { initialValues } from '@/constants/initialValues';

interface DraftStoreState {
  draft: Omit<RecipeFormValues, 'thumb'> & { thumbName: string | null };
  setDraft: (values: RecipeFormValues) => void;
  clearDraft: () => void;
}

const initialDraftValues = {
  ...initialValues,
  thumbName: null,
};

export const useRecipeDraftStore = create<DraftStoreState>()(
  persist(
    (set) => ({
      draft: initialDraftValues,

      setDraft: (values: RecipeFormValues) =>
        set(() => ({
          draft: {
            ...values,
            thumbName: values.thumb instanceof File ? values.thumb.name : null,
          },
        })),

      clearDraft: () => set({ draft: initialDraftValues }),
    }),
    {
      name: 'recipe-draft-storage',
    },
  ),
);
