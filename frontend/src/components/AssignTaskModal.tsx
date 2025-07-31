import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// import './Modal.css'; // Optional: custom styling

interface FormValues {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
}

interface AssignTaskModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: FormValues | null;
  onSubmit?: (values: FormValues) => void;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  onClose,
  onSuccess,
  initialValues,
  onSubmit,
}) => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const defaultValues: FormValues = {
    title: '',
    description: '',
    status: 'pending',
    assignedTo: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    status: Yup.string().required(),
    assignedTo: Yup.string().required('Assigned user is required'),
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (onSubmit) {
        await onSubmit(values); // Edit case
      } else {
        await axios.post('http://localhost:5000/api/tasks', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Task save failed', err);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <Formik
            initialValues={initialValues || defaultValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="modal-header">
                <h5 className="modal-title">{initialValues ? 'Edit Task' : 'Assign Task'}</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <Field name="title" className="form-control" />
                  <div className="text-danger">
                    <ErrorMessage name="title" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <Field name="description" as="textarea" className="form-control" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <Field as="select" name="status" className="form-control">
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Field>
                </div>

                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <Field as="select" name="assignedTo" className="form-control">
                    <option value="">Select an employee</option>
                    {employees.map((emp: any) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </Field>
                  <div className="text-danger">
                    <ErrorMessage name="assignedTo" />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {initialValues ? 'Update' : 'Assign'}
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
