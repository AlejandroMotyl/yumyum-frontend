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
import iziToast from 'izitoast';

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
  title: Yup.string().min(2).max(100).required('Вкажіть назву рецепту'),
  description: Yup.string().min(10).max(1000).required('Вкажіть короткий опис'),
  time: Yup.number()
    .min(1, 'Мінімум 1 хвилина')
    .required('Вкажіть час приготування'),
  cals: Yup.number().min(0, 'Калорії не можуть бути від’ємні').nullable(),
  category: Yup.string().required('Оберіть категорію'),
  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.string().required('Оберіть інгредієнт'),
        name: Yup.string().required(),
        amount: Yup.string().required('Вкажіть кількість'),
      }),
    )
    .min(2, 'Додайте хоча б два інгредієнти'),
  instructions: Yup.string().min(10).required('Вкажіть інструкції'),
  photoFile: Yup.mixed().required('Завантажте фото страви'),
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

      iziToast.success({ title: 'Успіх', message: 'Рецепт створено!' });
      router.push(`/recipes/id/${res.data._id}`);
    } catch (err: any) {
      console.error(err);
      iziToast.error({
        title: 'Помилка',
        message: err.response?.data?.message || 'Сталася помилка',
      });
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
          <Form className={css.form}>
            <label className={css.formGroup}>
              Назва
              <Field
                name="title"
                className={css.input}
                placeholder="Введіть назву рецепту"
              />
              <ErrorMessage
                name="title"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <label className={css.formGroup}>
              Короткий опис
              <Field
                name="description"
                as="textarea"
                rows={3}
                className={css.textarea}
                placeholder="Короткий опис рецепту"
              />
              <ErrorMessage
                name="description"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <label className={css.formGroup}>
              Час приготування (хв)
              <Field
                name="time"
                type="number"
                className={css.input}
                placeholder="30"
              />
              <ErrorMessage
                name="time"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <label className={css.formGroup}>
              Калорії
              <Field
                name="cals"
                type="number"
                className={css.input}
                placeholder="250"
              />
              <ErrorMessage
                name="cals"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <label className={css.formGroup}>
              Категорія
              <Field name="category" as="select" className={css.input}>
                <option value="">Оберіть категорію</option>
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

            <div className={css.formGroup}>
              <label>Інгредієнти</label>
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div>
                    {values.ingredients.map((ing, index) => (
                      <div key={index} className={css.ingredientRow}>
                        <Field
                          as="select"
                          name={`ingredients[${index}].id`}
                          className={css.input}
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
                          <option value="">Оберіть інгредієнт</option>
                          {ingredientsList.map((i) => (
                            <option key={i._id} value={i._id}>
                              {i.name}
                            </option>
                          ))}
                        </Field>
                        <Field
                          name={`ingredients[${index}].amount`}
                          className={css.input}
                          placeholder="Кількість"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className={css.removeButton}
                        >
                          ❌
                        </button>
                        <ErrorMessage
                          name={`ingredients[${index}].amount`}
                          component="div"
                          className={css.errorMessage}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ id: '', name: '', amount: '' })}
                      className={css.addButton}
                    >
                      Додати інгредієнт
                    </button>
                    {/* Використовуємо render prop для обробки об'єкта помилки для масиву */}
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

            <label className={css.formGroup}>
              Інструкції
              <Field
                name="instructions"
                as="textarea"
                rows={5}
                className={css.textarea}
                placeholder="Інструкції з приготування"
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <label className={css.formGroup}>
              Фото страви
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFieldValue('thumb', file);
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
              {preview && (
                <img src={preview} alt="Прев’ю" className={css.previewImage} />
              )}
              <ErrorMessage
                name="thumb"
                component="div"
                className={css.errorMessage}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className={css.buttonSubmit}
            >
              Опублікувати рецепт
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
