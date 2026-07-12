import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser, isRouteAllowed } from '../../utils/auth';
import '../dashboard/dashboard.css';
import './maintenance.css';

/* Navigation config */
const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'grid' },
    { id: 'fleet', label: 'Fleet', path: '/fleet', icon: 'truck' },
    { id: 'drivers', label: 'Drivers', path: '/drivers', icon: 'users' },
    { id: 'trips', label: 'Trips', path: '/trips', icon: 'map' },
    { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: 'wrench' },
    { id: 'fuel', label: 'Fuel & Expenses', path: '/fuel', icon: 'fuel' },
    { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'chart' },
];

/* SVG Icons */
function NavIcon({ type }) {
    const icons = {
        grid: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
        ),
        truck: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
        ),
        users: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        map: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
            </svg>
        ),
        wrench: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
        fuel: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        chart: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
        settings: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    };
    return icons[type] || null;
}

const serviceLogData = [
    { id: 1, vehicle: 'VAN-05', service: 'Oil Change', cost: '2,500', status: 'In Shop', statusClass: 'in-shop' },
    { id: 2, vehicle: 'TRUCK-11', service: 'Engine Repair', cost: '18,000', status: 'Completed', statusClass: 'completed' },
    { id: 3, vehicle: 'MINI-03', service: 'Tyre Replace', cost: '6,200', status: 'In Shop', statusClass: 'in-shop' },
];

function Maintenance() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const user = getUser() || { name: '—', role: '—' };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="7" height="7" rx="2" fill="#1a2e1a" />
                            <rect x="14" y="3" width="7" height="7" rx="2" fill="#f59e0b" />
                            <rect x="3" y="14" width="7" height="7" rx="2" fill="#1a2e1a" opacity="0.4" />
                            <rect x="14" y="14" width="7" height="7" rx="2" fill="#1a2e1a" />
                        </svg>
                    </div>
                    {sidebarOpen && <span className="sidebar-logo-text">TransitOps</span>}
                </div>

                <nav className="sidebar-nav">
                    {navItems.filter(item => isRouteAllowed(user, item.path)).map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                            id={`nav-${item.id}`}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <NavIcon type={item.icon} />
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        className="sidebar-nav-item"
                        onClick={() => navigate('/settings')}
                        id="nav-settings"
                        title={!sidebarOpen ? 'Settings' : undefined}
                    >
                        <NavIcon type="settings" />
                        {sidebarOpen && <span>Settings</span>}
                    </button>
                </div>

                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    id="sidebar-toggle"
                    aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                    title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {sidebarOpen ? (
                            <polyline points="15 18 9 12 15 6" />
                        ) : (
                            <polyline points="9 18 15 12 9 6" />
                        )}
                    </svg>
                </button>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            id="header-search-input"
                        />
                    </div>

                    <div className="header-actions">
                        <button className="dispatch-btn" id="dispatch-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Dispatch Rx
                        </button>

                        <div className="header-user" id="header-user">
                            <div className="header-user-info">
                                <div className="header-user-name">{user.name || '—'}</div>
                                <div className="header-user-role">{user.role || '—'}</div>
                            </div>
                            <div className="header-user-avatar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="maintenance-page-content">
                    {/* Left Column: Log Service Record */}
                    <div className="log-service-section">
                        <span className="section-title">Log Service Record</span>
                        
                        <div className="maintenance-form">
                            <div className="m-form-group">
                                <label className="m-form-label">Vehicle</label>
                                <input type="text" className="m-form-input" defaultValue="VAN-05" />
                            </div>
                            
                            <div className="m-form-group">
                                <label className="m-form-label">Service Type</label>
                                <input type="text" className="m-form-input" defaultValue="Oil Change" />
                            </div>
                            
                            <div className="m-form-group">
                                <label className="m-form-label">Cost</label>
                                <input type="number" className="m-form-input" defaultValue="2500" />
                            </div>
                            
                            <div className="m-form-group">
                                <label className="m-form-label">Date</label>
                                <input type="text" className="m-form-input" defaultValue="07/07/2026" />
                            </div>
                            
                            <div className="m-form-group">
                                <label className="m-form-label">Status</label>
                                <input type="text" className="m-form-input" defaultValue="Active" />
                            </div>
                            
                            <button className="btn-save-record">Save</button>
                        </div>

                        {/* Status Flow Diagram */}
                        <div className="status-flow-diagram">
                            <div className="flow-row">
                                <span className="flow-state available">Available</span>
                                <div className="flow-arrow-container">
                                    <div className="flow-arrow-line"></div>
                                    <div className="flow-arrow-head"></div>
                                    <span className="flow-action-text">creating active record</span>
                                </div>
                                <span className="flow-state in-shop">In Shop</span>
                            </div>
                            <div className="flow-row">
                                <span className="flow-state in-shop">In Shop</span>
                                <div className="flow-arrow-container">
                                    <div className="flow-arrow-line"></div>
                                    <div className="flow-arrow-head"></div>
                                    <span className="flow-action-text">closing record (set retired)</span>
                                </div>
                                <span className="flow-state available">Available</span>
                            </div>
                            <div className="maintenance-note">
                                Note: In shop vehicles are removed from the dispatch pool
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Service Log */}
                    <div className="service-log-section">
                        <span className="section-title">Service Log</span>
                        
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th>VEHICLE</th>
                                    <th>SERVICE</th>
                                    <th>COST</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceLogData.map((log) => (
                                    <tr key={log.id}>
                                        <td className="log-vehicle">{log.vehicle}</td>
                                        <td className="log-service">{log.service}</td>
                                        <td className="log-cost">{log.cost}</td>
                                        <td>
                                            <span className={`m-badge ${log.statusClass}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maintenance;
