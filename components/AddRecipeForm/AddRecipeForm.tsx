'use client';

import { useState, useEffect } from 'react';
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  FormikHelpers,
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

interface RecipeFormValues {
  title: string;
  description: string;
  time: string;
  cals?: string;
  category: string;
  ingredients: [{ id: string; name: string; amount: string }];
  instructions: string;
  thumb?: File | null;
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
        amount: Yup.string().required('Specify the quantity'),
      }),
    )
    .min(2, 'Add at least 2 ingredients')
    .max(16, 'Maximum 16 ingredients'),
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

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('time', values.time);
      if (values.cals) formData.append('cals', values.cals);
      formData.append('category', values.category);
      formData.append('instructions', values.instructions);
      if (values.thumb) formData.append('thumb', values.thumb);

      const ingredientsForBackend = values.ingredients.map((ing) => ({
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
      router.push(`/recipes/id/${res.data._id}`);
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className={css.addRecipeForm}>
            {/* --- Upload Photo Block --- */}
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
                  <div className={css.imagePlaceholder}>
                    <span className={css.imagePlaceholderIcon}></span>
                  </div>
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

            <p className={css.addRecipeFormBlockTitle}>General Information</p>

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

            <label className={css.addRecipeFormBlockSubtitle}>
              Calories
              <Field
                name="cals"
                type="number"
                className={css.addRecipeFormInput}
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
                className={css.addRecipeFormInput}
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

            {/* --- Ingredients Block --- */}
            <div className={css.addRecipeIngredientsGroup}>
              <label className={css.addRecipeFormBlockTitle}>Ingredients</label>{' '}
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div>
                    {values.ingredients.map((ing, index) => (
                      <div key={index} className={css.ingredientRow}>
                        <label className={css.addRecipeFormBlockSubtitle}>
                          Name
                          <Field
                            as="select"
                            name={`ingredients[${index}].id`}
                            className={css.addRecipeFormInput}
                            onChange={(e: any) => {
                              const selected = ingredientsList.find(
                                (i) => i._id === e.target.value,
                              );
                              setFieldValue(
                                `ingredients[${index}].id`,
                                selected?._id || '',
                              );
                              setFieldValue(
                                `ingredients[${index}].name`,
                                selected?.name || '',
                              );
                            }}
                          >
                            <option value="">Broccoli</option>
                            {ingredientsList.map((i) => (
                              <option key={i._id} value={i._id}>
                                {i.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name={`ingredients[${index}].id`}
                            component="div"
                            className={css.errorMessage}
                          />
                        </label>

                        <label className={css.addRecipeFormBlockSubtitle}>
                          Amount
                          <Field
                            name={`ingredients[${index}].amount`}
                            className={css.addRecipeFormInput}
                            placeholder="100g"
                          />
                          <ErrorMessage
                            name={`ingredients[${index}].amount`}
                            component="div"
                            className={css.errorMessage}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className={css.removeButton}
                        >
                          <span className={css.removeIcon}></span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ id: '', name: '', amount: '' })}
                      className={css.addIngredientButton}
                    >
                      Add new Ingredient
                    </button>
                    <ErrorMessage name="ingredients">
                      {(msg) => {
                        if (typeof msg === 'string') {
                          return <div className={css.errorMessage}>{msg}</div>;
                        }
                        return null;
                      }}
                    </ErrorMessage>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* --- Instructions Block --- */}
            <label className={css.addRecipeFormBlockTitle}>
              Instructions
              <Field
                name="instructions"
                as="textarea"
                rows={5}
                className={css.addRecipeFormTextarea}
                placeholder="Enter a text"
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={css.addRecipeFormButtonSubmit}
            >
              Publish Recipe
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
