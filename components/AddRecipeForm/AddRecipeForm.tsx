'use client';

import { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
  FormikErrors,
  FormikTouched,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import css from './AddRecipeForm.module.css';
import 'izitoast/dist/css/iziToast.min.css';
import {
  Category,
  Ingredient,
  IngredientValue,
  RecipeFormValues,
} from '@/types/recipe';
import {
  createRecipe,
  getCategories,
  getIngredients,
} from '@/lib/api/clientApi';
import { FormikSelect } from './FormikSelect/FormikSelect';
import { SelectOption } from '@/types/formik';
import { useRecipeDraftStore } from '@/lib/store/recipeDraftStore';
import FormDraftManager from './FormDraftManager/FormDraftManager';
import {
  ingredientValidationSchema,
  validationSchema,
} from './YupValidation/YupValidation';
import { initialValues } from '@/constants/initialValues';
import Loader from '../Loader/Loader';
import PageTransition from '../PageTransition/PageTransition';

const getIziToast = async () => {
  if (typeof window !== 'undefined') {
    const iziToastModule = await import('izitoast');
    return iziToastModule.default;
  }
  return null;
};

interface AddIngredientButtonProps {
  push: (obj: IngredientValue) => void;
  values: RecipeFormValues;
  css: any;
  errors: FormikErrors<RecipeFormValues>;
  touched: FormikTouched<RecipeFormValues>;
  getIziToast: () => Promise<any>;
}

export const RecipeForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
    data: cat,
  }));

  const ingredientOptions: SelectOption[] = ingredientsList.map((ing) => ({
    value: ing._id,
    label: ing.name,
    data: ing,
  }));

  const [isInitialValuesLoaded, setIsInitialValuesLoaded] = useState(false);
  const clearDraft = useRecipeDraftStore((state) => state.clearDraft);

  useEffect(() => {
    const fetchAllData = async () => {
      const iziToast = await getIziToast();
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        if (iziToast) {
          iziToast.error({
            title: 'Error loading categories',
            message: `Failed to load category list`,
            position: 'topRight',
          });
        }
      }

      try {
        const ingredientsData = await getIngredients();
        setIngredientsList(ingredientsData);
      } catch (error) {
        if (iziToast) {
          iziToast.error({
            title: 'Error loading ingrdients',
            message: `Failed to load ingredient list..`,
            position: 'topRight',
          });
        }
      }
    };

    fetchAllData();
  }, []);

  const handleSubmit = async (
    values: RecipeFormValues,
    { setSubmitting }: FormikHelpers<RecipeFormValues>,
  ) => {
    const iziToast = await getIziToast();

    const finalIngredients = values.ingredients.slice(0, -1);

    if (finalIngredients.length < 2) {
      if (iziToast) {
        iziToast.error({
          title: 'Error',
          message: 'Please add at least 2 ingredients.',
          position: 'topRight',
        });
      }
      setSubmitting(false);
      return;
    }

    try {
      await Yup.array()
        .of(ingredientValidationSchema)
        .validate(finalIngredients, { abortEarly: false });
    } catch (err: any) {
      if (iziToast) {
        iziToast.error({
          title: 'Validation Error',
          message: 'Some added ingredients are incomplete or invalid.',
          position: 'topRight',
        });
      }
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('time', values.time);
      if (values.cals) formData.append('cals', values.cals);
      formData.append('category', values.category);
      formData.append('instructions', values.instructions);
      if (values.thumb) formData.append('thumb', values.thumb);

      const ingredientsForBackend = finalIngredients.map((ing) => ({
        id: ing.id,
        measure: ing.amount,
      }));

      formData.append('ingredients', JSON.stringify(ingredientsForBackend));

      const res = await createRecipe(formData);
      clearDraft();

      if (iziToast) {
        iziToast.success({ title: 'Success', message: 'Recipe created!' });
      }
      router.push(`/recipes/${res.data._id}`);
    } catch (err: any) {
      if (iziToast) {
        iziToast.error({
          title: 'Error',
          message: err.response?.data?.message || 'An error occurred',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className={css.addRecipeTitle}>Add Recipe</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          setFieldValue,
          isSubmitting,
          errors,
          touched,
          validateForm,
          setTouched,
        }) => {
          const isFieldInvalid = (
            fieldName: keyof RecipeFormValues | string,
          ) => {
            const error = errors[fieldName as keyof RecipeFormValues];
            const touch = touched[fieldName as keyof RecipeFormValues];
            return error && touch ? css['is-invalid'] : '';
          };

          return (
            <Form className={css.addRecipeForm}>
              <FormDraftManager
                initialValues={initialValues}
                setInitialValuesLoaded={setIsInitialValuesLoaded}
              />
              {!isInitialValuesLoaded ? (
                <Loader />
              ) : (
                <PageTransition>
                  {/* --- Upload Photo Block --- */}
                  <div className={css.addRecipeImgBlock}>
                    <label className={css.addRecipeFormBlockTitle}>
                      Upload Photo
                      <div className={css.customFileInputWrapper}>
                        <input
                          type="file"
                          accept="image/*"
                          className={css.hiddenFileInput}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFieldValue('thumb', file);
                            setPreview(file ? URL.createObjectURL(file) : null);
                          }}
                        />
                        {preview ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className={css.addRecipeFormPreviewImage}
                          />
                        ) : (
                          <picture className={css.imagePlaceholder}>
                            <source
                              media="(min-width: 1440px)"
                              srcSet="/img-default/default-img-desktop.jpg"
                            />

                            <source
                              media="(min-width: 768px)"
                              srcSet="/img-default/default-img-tablet.jpg"
                            />

                            <img
                              src="/img-default/default-img-mobile.jpg"
                              alt="Default Recipe Placeholder"
                              className={css.defaultPlaceholderImage}
                              width="361"
                              height="383"
                            />
                          </picture>
                        )}
                        {values.thumb && (
                          <span className={css.fileNameDisplay}>
                            {(values.thumb as File).name}
                          </span>
                        )}
                      </div>
                      <ErrorMessage
                        name="thumb"
                        component="div"
                        className={css.errorMessage}
                      />
                    </label>
                  </div>

                  {/* ---  General Block --- */}
                  <div className={css.addRecipeInfoBlock}>
                    <div className={css.addRecipeGeneralGroup}>
                      <p className={css.addRecipeFormBlockTitle}>
                        General Information
                      </p>

                      <label className={css.addRecipeFormBlockSubtitle}>
                        Recipe Title
                        <Field
                          name="title"
                          className={`${css.addRecipeFormInput} ${isFieldInvalid('title')}`}
                          placeholder="Enter the name of your recipe"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className={css.errorMessage}
                        />
                      </label>

                      <label className={css.addRecipeFormBlockSubtitle}>
                        Recipe Description
                        <Field
                          name="description"
                          as="textarea"
                          rows={4}
                          className={`${css.addRecipeFormTextarea} ${isFieldInvalid('description')}`}
                          placeholder="Enter a brief description of your recipe"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className={css.errorMessage}
                        />
                      </label>

                      <label className={css.addRecipeFormBlockSubtitle}>
                        Cooking time in minutes
                        <Field
                          name="time"
                          type="number"
                          className={`${css.addRecipeFormInput} ${isFieldInvalid('time')}`}
                          placeholder="10"
                        />
                        <ErrorMessage
                          name="time"
                          component="div"
                          className={css.errorMessage}
                        />
                      </label>
                      <div className={css.addRecipeCalsAndCategoryWrapper}>
                        <label className={css.addRecipeFormBlockSubtitle}>
                          Calories
                          <Field
                            name="cals"
                            type="number"
                            className={`${css.addRecipeFormCalsInput} ${isFieldInvalid('cals')}`}
                            placeholder="150 cals"
                          />
                          <ErrorMessage
                            name="cals"
                            component="div"
                            className={css.errorMessage}
                          />
                        </label>
                        <div className={css.addRecipeFormSelectCategoryWrapper}>
                          <FormikSelect
                            label="Category"
                            name="category"
                            options={categoryOptions}
                            placeholder="Soup"
                          />
                        </div>
                      </div>
                    </div>

                    {/* --- Ingredients Block --- */}
                    <div className={css.addRecipeIngredientsGroup}>
                      <label className={css.addRecipeFormBlockTitle}>
                        Ingredients
                      </label>

                      <FieldArray name="ingredients">
                        {({ push, remove }) => {
                          const lastIndex = values.ingredients.length - 1;

                          return (
                            <div>
                              {values.ingredients.length > 0 && (
                                <div className={css.ingredientRow}>
                                  <div
                                    className={
                                      css.addRecipeFormBlockIngSubtitle
                                    }
                                  >
                                    <div
                                      className={
                                        css.addRecipeFormSelectIngredientWrapper
                                      }
                                    >
                                      <FormikSelect
                                        label="Name"
                                        name={`ingredients[${lastIndex}].id`}
                                        options={ingredientOptions}
                                        placeholder="Broccoli"
                                        width="100%"
                                        onChange={(
                                          option: SelectOption | null,
                                        ) => {
                                          const selectedName = option
                                            ? option.label
                                            : '';
                                          setFieldValue(
                                            `ingredients[${lastIndex}].name`,
                                            selectedName,
                                          );
                                        }}
                                      />
                                    </div>
                                    <ErrorMessage
                                      name={`ingredients[${lastIndex}].id`}
                                      component="div"
                                      className={css.errorMessage}
                                    />

                                    <label
                                      className={css.addRecipeFormBlockSubtitle}
                                    >
                                      Amount
                                      <Field
                                        name={`ingredients[${lastIndex}].amount`}
                                        className={
                                          css.addRecipeFormIngredientsInput
                                        }
                                        placeholder="100g"
                                      />
                                      {values.ingredients.slice(0, -1).length <
                                        2 && (
                                        <div className={css.errorMessage}>
                                          Please add at least 2 ingredients.
                                        </div>
                                      )}
                                      <ErrorMessage
                                        name={`ingredients[${lastIndex}].amount`}
                                        component="div"
                                        className={css.errorMessage}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}
                              <div className={css.addIngredientButtonWrapper}>
                                <AddIngredientButton
                                  push={push}
                                  values={values}
                                  css={css}
                                  errors={
                                    errors as FormikErrors<RecipeFormValues>
                                  }
                                  touched={
                                    touched as FormikTouched<RecipeFormValues>
                                  }
                                  getIziToast={getIziToast}
                                />
                              </div>

                              {values.ingredients.length > 1 && (
                                <div className={css.ingredientsTable}>
                                  <div className={css.tableHeader}>
                                    <span>Name:</span>
                                    <span>Amount:</span>
                                    <span></span>
                                  </div>

                                  {values.ingredients
                                    .slice(0, -1)
                                    .map((ing, index) => (
                                      <div key={index} className={css.tableRow}>
                                        <span className={css.tableName}>
                                          {ing.name}
                                        </span>
                                        <span className={css.tableAmount}>
                                          {ing.amount}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                          className={css.removeButton}
                                        >
                                          <svg className={css.removeIcon}>
                                            <use href="/sprite-new.svg#icon-bin-medium" />
                                          </svg>
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        }}
                      </FieldArray>
                    </div>

                    {/* --- Instructions Block --- */}

                    <div className={css.addRecipeInstructionsGroup}>
                      <label className={css.addRecipeFormBlockTitle}>
                        Instructions
                        <Field
                          name="instructions"
                          as="textarea"
                          rows={5}
                          className={`${css.addRecipeFormInstructionsTextarea} ${isFieldInvalid('instructions')}`}
                          placeholder="Enter a text"
                        />
                        <ErrorMessage
                          name="instructions"
                          component="div"
                          className={css.errorMessage}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={css.addRecipeFormButtonSubmit}
                      onClick={async () => {
                        const iziToast = await getIziToast();
                        const formErrors = await validateForm();

                        if (Object.keys(formErrors).length > 0) {
                          const allTouched = Object.keys(values).reduce(
                            (acc, key) => {
                              acc[key] = true;
                              return acc;
                            },
                            {} as Record<string, boolean>,
                          );
                          setTouched(allTouched);

                          if (iziToast) {
                            iziToast.error({
                              title: 'Error',
                              message: 'Please, fill all required fields.',
                              position: 'topRight',
                            });
                          }
                        }
                      }}
                    >
                      Publish Recipe
                    </button>
                  </div>
                </PageTransition>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

const AddIngredientButton = ({
  push,
  values,
  css,
  errors,
  touched,
  getIziToast,
}: AddIngredientButtonProps) => {
  const { setTouched } = useFormikContext<RecipeFormValues>();
  const lastIndex = values.ingredients.length - 1;

  const handleAdd = async () => {
    const iziToast = await getIziToast();

    setTouched({
      ...touched,
      ingredients: [
        ...(
          (touched.ingredients as FormikTouched<IngredientValue>[]) || []
        ).slice(0, lastIndex),
        { id: true, name: true, amount: true },
      ],
    });

    const currentIng = values.ingredients[lastIndex];

    if (currentIng.id && currentIng.amount) {
      if (values.ingredients.length >= 17) {
        if (iziToast) {
          iziToast.error({
            title: 'Limit Reached',
            message: 'Maximum 16 ingredients allowed.',
            position: 'topRight',
          });
        }
        return;
      }

      push({ id: '', name: '', amount: '' });
    } else {
      if (iziToast) {
        iziToast.error({
          title: 'Error',
          message: 'Please select an ingredient and specify the amount.',
          position: 'topRight',
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={css.addIngredientButton}
    >
      Add new Ingredient
    </button>
  );
};
