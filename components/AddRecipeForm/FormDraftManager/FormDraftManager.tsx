import { useEffect } from 'react';
import { useFormikContext } from 'formik';

import { RecipeFormValues } from '@/types/recipe';
import { useRecipeDraftStore } from '@/lib/store/recipeDraftStore';

interface FormDraftManagerProps {
  initialValues: RecipeFormValues;
  setInitialValuesLoaded: (loaded: boolean) => void;
}

const FormDraftManager = ({
  initialValues,
  setInitialValuesLoaded,
}: FormDraftManagerProps) => {
  const { values, setValues } = useFormikContext<RecipeFormValues>();
  const { draft, setDraft, clearDraft } = useRecipeDraftStore();

  useEffect(() => {
    if (draft.title && draft.title !== initialValues.title) {
      setValues(
        {
          ...draft,

          thumb: null,
        } as RecipeFormValues,
        false,
      );
    }
    setInitialValuesLoaded(true);
  }, [setValues, initialValues.title, draft.title, setInitialValuesLoaded]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (
        values.title !== initialValues.title ||
        values.description !== initialValues.description
      ) {
        setDraft(values);
      }
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [values, setDraft, initialValues.title, initialValues.description]);

  return null;
};

export default FormDraftManager;
