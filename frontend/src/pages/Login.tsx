// src/pages/Login.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginSchema } from '../schemas/loginSchema';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const res = await loginUser(values);
            login(res.token);

            const decoded: any = jwtDecode(res.token);
            const role = decoded.role;

            // Redirect based on role
            if (role === 'manager') {
                navigate('/manager');
            } else {
                navigate('/tasks');
            }

        } catch (err) {
            alert('❌ Login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Login to Your Account</h3>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <Field name="email" type="email" className="form-control" />
                                <div className="text-danger small mt-1"><ErrorMessage name="email" /></div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field name="password" type="password" className="form-control" />
                                <div className="text-danger small mt-1"><ErrorMessage name="password" /></div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="mt-3 text-center">
                                <span>Don't have an account? </span>
                                <Link to="/register">Register</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
