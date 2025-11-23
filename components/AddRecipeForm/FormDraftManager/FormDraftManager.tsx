import { useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';

import { RecipeFormValues } from '@/types/recipe';
import { useRecipeDraftStore } from '@/lib/store/recipeDraftStore';

interface FormDraftManagerProps {
  initialValues: RecipeFormValues;
  setInitialValuesLoaded: (loaded: boolean) => void;
}

const areDraftValuesDifferent = (
  draft: any,
  initialValues: RecipeFormValues,
): boolean => {
  if (draft.thumbName !== null) {
    return true;
  }

  const serializableDraft = { ...draft };
  delete serializableDraft.thumbName;

  const serializableInitial = { ...initialValues };
  delete serializableInitial.thumb;

  const draftString = JSON.stringify(serializableDraft);
  const initialString = JSON.stringify(serializableInitial);

  return draftString !== initialString;
};

const FormDraftManager = ({
  initialValues,
  setInitialValuesLoaded,
}: FormDraftManagerProps) => {
  const { values, setValues } = useFormikContext<RecipeFormValues>();
  const { draft, setDraft, clearDraft } = useRecipeDraftStore();

  const isDraftSaved = useMemo(() => {
    return areDraftValuesDifferent(draft, initialValues);
  }, [draft, initialValues]);

  useEffect(() => {
    if (isDraftSaved) {
      setValues(
        {
          ...draft,
        } as RecipeFormValues,
        false,
      );
    }
    setInitialValuesLoaded(true);
  }, [setValues, draft, isDraftSaved, setInitialValuesLoaded]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (areDraftValuesDifferent(values, initialValues)) {
        setDraft(values);
      }
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [values, setDraft, initialValues]);

  return null;
};

export default FormDraftManager;
