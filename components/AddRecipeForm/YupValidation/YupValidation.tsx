import * as Yup from 'yup';

export const validationSchema = Yup.object({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(64, 'Title must be at most 64 characters')
    .trim()
    .required('Enter the recipe name'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must be at most 200 characters')
    .trim()
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
        id: Yup.string().nullable(),
        name: Yup.string().nullable(),
        amount: Yup.string()
          .nullable()
          .min(2, 'Minimum 2 characters')
          .max(50, 'Maximum 50 characters'),
      }),
    )
    .min(0, 'Must contain at least 0 elements (check handled in handleSubmit)')
    .max(17, 'Maximum 16 ingredients to add.'),
  instructions: Yup.string()
    .max(1200)
    .trim()
    .required('Specify the instructions'),
  thumb: Yup.mixed().nullable().optional(),
});

export const ingredientValidationSchema = Yup.object({
  id: Yup.string().required('Choose an ingredient'),
  name: Yup.string().required(),
  amount: Yup.string()
    .required('Specify the quantity')
    .min(1, 'Specify the quantity'),
});
