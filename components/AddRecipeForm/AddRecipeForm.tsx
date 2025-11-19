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
import { api } from '@/lib/api/api';
import { useRouter } from 'next/navigation';
import css from './AddRecipeForm.module.css';
import 'izitoast/dist/css/iziToast.min.css';

const getIziToast = async () => {
  if (typeof window !== 'undefined') {
    const iziToastModule = await import('izitoast');
    return iziToastModule.default;
  }
  return null;
};

interface Category {
  _id: string;
  name: string;
}

interface Ingredient {
  _id: string;
  name: string;
}

interface IngredientValue {
  id: string;
  name: string;
  amount: string;
}

interface RecipeFormValues {
  title: string;
  description: string;
  time: string;
  cals?: string;
  category: string;
  ingredients: IngredientValue[];
  instructions: string;
  thumb?: File | null;
}

type IngredientErrors = FormikErrors<IngredientValue> | string | undefined;

interface RecipeFormErrors {
  ingredients?: IngredientErrors[];
}

interface AddIngredientButtonProps {
  push: (obj: IngredientValue) => void;
  values: RecipeFormValues;
  css: any;

  errors: FormikErrors<RecipeFormValues>;

  touched: FormikTouched<RecipeFormValues>;
  getIziToast: () => Promise<any>;
}

const validationSchema = Yup.object({
  title: Yup.string().min(2).max(64).required('Enter the recipe name'),
  description: Yup.string()
    .min(10)
    .max(200)
    .required('Enter a short description'),
  time: Yup.number()
    .min(1, 'Minimum 1 minute')
    .max(360, 'Maximum 360 minutes')
    .required('Specify the cooking time'),
  cals: Yup.number()
    .min(1, 'Calories cannot be less than 1')
    .max(10000, 'Calories cannot be more than 10,000')
    .nullable(),
  category: Yup.string().required('Choose a category'),
  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required('Choose an ingredient'),
        name: Yup.string().required(),
        amount: Yup.string()
          .required('Specify the quantity')
          .min(1, 'Specify the quantity'),
      }),
    )
    .min(1, 'Add at least 1 ingredient (placeholder included).'),
  instructions: Yup.string().max(1200).required('Specify the instructions'),
  thumb: Yup.mixed().nullable().optional(),
});

export const RecipeForm = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredientsList, setIngredientsList] = useState<Ingredient[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchIngredients = async () => {
      try {
        const res = await api.get('/ingredients');
        setIngredientsList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
    fetchIngredients();
  }, []);

  const initialValues: RecipeFormValues = {
    title: '',
    description: '',
    time: '',
    cals: '',
    category: '',
    ingredients: [{ id: '', name: '', amount: '' }],
    instructions: '',
    thumb: null,
  };

  const handleSubmit = async (
    values: RecipeFormValues,
    { setSubmitting }: FormikHelpers<RecipeFormValues>,
  ) => {
    const iziToast = await getIziToast();

    const finalIngredients = values.ingredients.slice(0, -1);

    if (finalIngredients.length === 0) {
      if (iziToast) {
        iziToast.error({
          title: 'Error',
          message: 'Please add at least one ingredient.',
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

      const res = await api.post('add-recipe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (iziToast) {
        iziToast.success({ title: 'Success', message: 'Recipe created!' });
      }
      router.push(`/recipes/${res.data._id}`);
    } catch (err: any) {
      console.error(err);
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
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className={css.addRecipeForm}>
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
                    <div className={css.imagePlaceholder}></div>
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
                    className={css.addRecipeFormInput}
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
                    rows={3}
                    className={css.addRecipeFormTextarea}
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
                    className={css.addRecipeFormInput}
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
                      className={css.addRecipeFormCalsInput}
                      placeholder="150 cals"
                    />
                    <ErrorMessage
                      name="cals"
                      component="div"
                      className={css.errorMessage}
                    />
                  </label>

                  <label className={css.addRecipeFormBlockSubtitle}>
                    Category
                    <Field
                      name="category"
                      as="select"
                      className={css.addRecipeFormCategoryInput}
                    >
                      <option value="">Soup</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className={css.errorMessage}
                    />
                  </label>
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
                            <label className={css.addRecipeFormBlockSubtitle}>
                              Name
                              <Field
                                as="select"
                                name={`ingredients[${lastIndex}].id`}
                                className={css.addRecipeFormIngredientsInput}
                                onChange={(e: any) => {
                                  const selected = ingredientsList.find(
                                    (i) => i._id === e.target.value,
                                  );

                                  setFieldValue(
                                    `ingredients[${lastIndex}].id`,
                                    selected?._id || '',
                                  );
                                  setFieldValue(
                                    `ingredients[${lastIndex}].name`,
                                    selected?.name || '',
                                  );
                                }}
                                value={values.ingredients[lastIndex].id}
                              >
                                <option value="">Select ingredient</option>{' '}
                                {ingredientsList.map((i) => (
                                  <option key={i._id} value={i._id}>
                                    {i.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name={`ingredients[${lastIndex}].id`}
                                component="div"
                                className={css.errorMessage}
                              />
                            </label>

                            <label className={css.addRecipeFormBlockSubtitle}>
                              Amount
                              <Field
                                name={`ingredients[${lastIndex}].amount`}
                                className={css.addRecipeFormIngredientsInput}
                                placeholder="100g"
                              />
                              <ErrorMessage
                                name={`ingredients[${lastIndex}].amount`}
                                component="div"
                                className={css.errorMessage}
                              />
                            </label>
                          </div>
                        )}

                        <AddIngredientButton
                          push={push}
                          values={values}
                          css={css}
                          errors={
                            errors as unknown as FormikErrors<RecipeFormValues>
                          }
                          touched={
                            touched as unknown as FormikTouched<RecipeFormValues>
                          }
                          getIziToast={getIziToast}
                        />

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
                                    <svg
                                      className={css.removeIcon}
                                      width="15"
                                      height="15"
                                    >
                                      <use href="/sprite.svg#icon-Genericdelete"></use>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}

                        <ErrorMessage name="ingredients">
                          {(msg) => {
                            if (typeof msg === 'string') {
                              return (
                                <div className={css.errorMessage}>{msg}</div>
                              );
                            }
                            return null;
                          }}
                        </ErrorMessage>
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
                    className={css.addRecipeFormInstructionsTextarea}
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
              >
                Publish Recipe
              </button>
            </div>
          </Form>
        )}
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
  const { validateForm, setTouched } = useFormikContext<RecipeFormValues>();
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

    const validationErrors = await validateForm();

    const ingredientErrors = validationErrors.ingredients as
      | IngredientErrors[]
      | undefined;

    if (ingredientErrors && ingredientErrors[lastIndex]) {
      if (iziToast) {
        iziToast.error({
          title: 'Validation Error',
          message: 'Please select an ingredient and specify the amount.',
          position: 'topRight',
        });
      }
      return;
    }

    const ingToPush = values.ingredients[lastIndex];
    if (ingToPush.id && ingToPush.amount) {
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
