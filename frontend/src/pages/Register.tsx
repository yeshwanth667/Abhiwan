// src/pages/Register.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { registerSchema } from '../schemas/registerSchema';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth.api';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const handleSubmit = async (values: {
        name: string;
        email: string;
        password: string;
        role: 'manager' | 'employee';
    }) => {
        try {
            const res = await registerUser(values);
            console.log('✅ Registered:', res);
            navigate('/login');
        } catch (err) {
            alert('❌ Registration failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
                <h3 className="text-center mb-4">Create an Account</h3>

                <Formik
                    initialValues={{ name: '', email: '', password: '', role: 'employee' }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <Field name="name" type="text" className="form-control" />
                                <div className="text-danger small"><ErrorMessage name="name" /></div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <Field name="email" type="email" className="form-control" />
                                <div className="text-danger small"><ErrorMessage name="email" /></div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Field name="password" type="password" className="form-control" />
                                <div className="text-danger small"><ErrorMessage name="password" /></div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Role</label>
                                <Field name="role" as="select" className="form-select">
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                </Field>
                                <div className="text-danger small"><ErrorMessage name="role" /></div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>

                            <div className="mt-3 text-center">
                                <span>Already have an account? </span>
                                <Link to="/login">Login</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Register;
