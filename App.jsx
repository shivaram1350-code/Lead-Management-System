import { useEffect, useState, useCallback } from 'react';
import { leadsApi } from './services/api';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import Dashboard from './components/Dashboard';
import SearchFilter from './components/SearchFilter';
import './App.css';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', source: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getAll(filters);
      setLeads(response.data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await leadsApi.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Debounce search input by 300ms so we don't hammer the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, leads.length]);

  const handleAddLead = async (lead) => {
    try {
      setSubmitting(true);
      await leadsApi.create(lead);
      showToast('Lead added successfully');
      await fetchLeads();
      await fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await leadsApi.updateStatus(id, status);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
      showToast('Status updated');
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await leadsApi.delete(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      showToast('Lead deleted');
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>
            <span className="logo">🎯</span> Lead Management System
          </h1>
          <p className="subtitle">Mini CRM · Track and convert your leads</p>
        </div>
      </header>

      <main className="container app-main">
        <Dashboard stats={stats} />

        <section className="card">
          <LeadForm onSubmit={handleAddLead} submitting={submitting} />
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">All Leads</h2>
            <span className="lead-count">{leads.length} total</span>
          </div>
          <SearchFilter filters={filters} onChange={setFilters} />
          <LeadList
            leads={leads}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </section>
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      <footer className="app-footer">
        <div className="container">
          <p>Built with React, Node.js, and PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
