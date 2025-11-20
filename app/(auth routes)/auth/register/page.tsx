'use client';

import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { register } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

import styles from './page.module.css';
import { useState } from 'react';
import Link from 'next/link';

const RegisterPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      .trim()
      .matches(/^[^\s]*\s?[^\s]*$/, 'Only one space allowed')
      .max(16, 'Max 16 characters')
      .required('Name is required'),

    email: Yup.string()
      .trim()
      .matches(/^\S+$/, 'Email must not contain spaces')
      .email('Invalid email')

      .max(128, 'Max 128 characters')
      .required('Email is required'),

    password: Yup.string()
      .trim()
      .matches(/^\S+$/, 'Password must not contain spaces')
      .min(8, 'Min 8 characters')
      .max(128, 'Max 128 characters')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm your password'),
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...credentials } = values;

      const user = await register(credentials);
      setUser(user);

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
        <p className={styles.text}>
          Join our community of culinary enthusiasts, save your favorite
          recipes, and share your cooking creations
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className={styles.form}>
            <ul className={styles.formList}>
              <li>
                <label className={styles.label}>Enter your email address</label>
                <Field name="email">
                  {({ field, meta }: FieldProps) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="email@gmail.com"
                      autoComplete="off"
                      className={`${styles.input} ${
                        meta.touched && meta.error ? styles.errorInput : ''
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="email"
                  component="p"
                  className={styles.error}
                />
              </li>
              <li>
                <label className={styles.label}>Enter your name</label>
                <Field name="name">
                  {({ field, meta }: FieldProps) => (
                    <input
                      {...field}
                      placeholder="Max"
                      autoComplete="off"
                      className={`${styles.input} ${
                        meta.touched && meta.error ? styles.errorInput : ''
                      }`}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="p"
                  className={styles.error}
                />
              </li>
              <li>
                <label className={styles.label}>Create a strong password</label>

                <Field name="password">
                  {({ field, meta }: FieldProps) => (
                    <div
                      className={`${styles.passwordWrapper} ${
                        meta.touched && meta.error ? styles.errorWrapper : ''
                      }`}
                    >
                      <input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="********"
                        className={`${styles.input} ${
                          meta.touched && meta.error ? styles.errorInput : ''
                        }`}
                      />

                      <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <svg className={styles.eyeIcon}>
                          <use
                            href={`/sprite.svg#${
                              showPassword
                                ? 'icon-Controlseye-crossed'
                                : 'icon-Controlseye'
                            }`}
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="password"
                  component="p"
                  className={styles.error}
                />
              </li>
              <li>
                <label className={styles.label}>Repeat your password</label>
                <Field name="confirmPassword">
                  {({ field, meta }: FieldProps) => (
                    <div
                      className={`${styles.passwordWrapper} ${
                        meta.touched && meta.error ? styles.errorWrapper : ''
                      }`}
                    >
                      <input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="********"
                        className={`${styles.input} ${
                          meta.touched && meta.error ? styles.errorInput : ''
                        }`}
                      />

                      <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <svg className={styles.eyeIcon}>
                          <use
                            href={`/sprite.svg#${
                              showConfirmPassword
                                ? 'icon-Controlseye-crossed'
                                : 'icon-Controlseye'
                            }`}
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className={styles.error}
                />
              </li>
            </ul>
            <button type="submit" className={styles.submitButton}>
              Create account
            </button>
          </Form>
        </Formik>

        <p className={styles.loginLink}>
          Already have an account? <Link href="/auth/login">Log in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
