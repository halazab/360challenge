import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoriesAPI } from '../../services/api';
import { Category } from '../../types';
import Layout from '../Layout/Layout';

const CategoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#007bff',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedColors = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6c757d',
    '#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'
  ];

  useEffect(() => {
    if (isEditing && id) {
      const fetchCategory = async () => {
        try {
          const category = await categoriesAPI.getCategory(parseInt(id));
          setFormData({
            name: category.name,
            description: category.description,
            color: category.color,
          });
        } catch (err: any) {
          setError('Failed to load category');
        }
      };
      fetchCategory();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing && id) {
        await categoriesAPI.updateCategory(parseInt(id), formData);
      } else {
        await categoriesAPI.createCategory(formData);
      }

      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={isEditing ? 'Edit Category' : 'Create New Category'}>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{isEditing ? 'Edit Category' : 'Create New Category'}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="color" className="form-label">
                Color *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="color"
                  id="color"
                  name="color"
                  className="form-control"
                  value={formData.color}
                  onChange={handleChange}
                  style={{ width: '60px', height: '40px' }}
                  required
                />
                <span
                  className="badge"
                  style={{ backgroundColor: formData.color, color: 'white' }}
                >
                  {formData.name || 'Preview'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: color,
                      border: formData.color === color ? '3px solid #000' : '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/categories')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryForm;
