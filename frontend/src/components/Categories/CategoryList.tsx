import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../../services/api';
import { Category } from '../../types';
import Layout from '../Layout/Layout';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoriesAPI.getCategories();
      setCategories(categoriesData);
    } catch (err: any) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.deleteCategory(id);
        setCategories(categories.filter(category => category.id !== id));
      } catch (err: any) {
        setError('Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Categories">
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading categories...</div>
      </Layout>
    );
  }

  return (
    <Layout title="Categories">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Event Categories</h1>
        <Link to="/categories/new" className="btn btn-primary">
          Create New Category
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        <div className="card-body">
          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              No categories found. <Link to="/categories/new" className="btn btn-primary btn-sm">Create your first category</Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Color</th>
                    <th>Events</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: category.color,
                            }}
                          />
                          <span style={{ fontWeight: '500' }}>{category.name}</span>
                        </div>
                      </td>
                      <td>{category.description || 'No description'}</td>
                      <td>
                        <span
                          className="badge"
                          style={{ backgroundColor: category.color, color: 'white' }}
                        >
                          {category.color}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">0 events</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            to={`/categories/${category.id}/edit`}
                            className="btn btn-sm btn-outline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
