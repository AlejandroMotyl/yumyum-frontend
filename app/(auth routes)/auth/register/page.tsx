'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import 'izitoast/dist/css/iziToast.min.css';

import styles from './page.module.css';

const RegisterPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .max(16, 'Max 16 characters')
      .required('Name is required'),

    email: Yup.string()
      .email('Invalid email')
      .max(128, 'Max 128 characters')
      .required('Email is required'),

    password: Yup.string()
      .min(8, 'Min 8 characters')
      .max(128, 'Max 128 characters')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm your password'),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...credentials } = values;

      const res = await register(credentials);
      setUser(res.user);

      import('izitoast').then((iziToast) => {
        iziToast.default.success({
          title: 'Success',
          message: 'You have successfully registered!',
          position: 'topRight',
        });
      });

      router.push('/');
    } catch (err: any) {
      import('izitoast').then((iziToast) => {
        iziToast.default.error({
          title: 'Error',
          message: err?.response?.data?.message || 'Registration failed',
          position: 'topRight',
        });
      });
    }
  };
  return (
    <main className={styles.page}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Register</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <label className={styles.label}>Name</label>
            <Field name="name" className={styles.input} />
            <ErrorMessage name="name" component="p" className={styles.error} />

            <label className={styles.label}>Email</label>
            <Field name="email" type="email" className={styles.input} />
            <ErrorMessage name="email" component="p" className={styles.error} />

            <label className={styles.label}>Password</label>
            <Field name="password" type="password" className={styles.input} />
            <ErrorMessage
              name="password"
              component="p"
              className={styles.error}
            />

            <label className={styles.label}>Confirm password</label>
            <Field
              name="confirmPassword"
              type="password"
              className={styles.input}
            />
            <ErrorMessage
              name="confirmPassword"
              component="p"
              className={styles.error}
            />

            <button type="submit" className={styles.submitButton}>
              Create account
            </button>
          </Form>
        </Formik>

        <p className={styles.loginLink}>
          Already have an account? <a href="/auth/login">Log in</a>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
