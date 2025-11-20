'use client';

import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import * as Yup from 'yup';
import { login } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

import styles from './page.module.css';
import { useState } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [showPassword, setShowPassword] = useState(false);

  interface LoginFormValues {
    email: string;
    password: string;
  }

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
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
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const user = await login(values);

      setUser(user);

      import('izitoast').then((iziToast) => {
        iziToast.default.success({
          title: 'Success',
          message: 'You have successfully logged in!',
          position: 'topRight',
        });
      });

      router.push('/');
    } catch (err: any) {
      import('izitoast').then((iziToast) => {
        iziToast.default.error({
          title: 'Error',
          message: err?.response?.data?.message || 'Login failed',
          position: 'topRight',
        });
      });
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>

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
                <label className={styles.label}>Enter your password</label>

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
            </ul>

            <button type="submit" className={styles.submitButton}>
              Login
            </button>
          </Form>
        </Formik>

        <p className={styles.loginLink}>
          Don’t have an account? <Link href="/auth/register">Register</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
