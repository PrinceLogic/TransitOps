import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './dashboard.css';

/* Navigation config (structural, not data) */
const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'grid' },
    { id: 'fleet', label: 'Fleet', path: '/fleet', icon: 'truck' },
    { id: 'drivers', label: 'Drivers', path: '/drivers', icon: 'users' },
    { id: 'trips', label: 'Trips', path: '/trips', icon: 'map' },
    { id: 'maintenance', label: 'Maintenance', path: '/maintenance', icon: 'wrench' },
    { id: 'fuel', label: 'Fuel & Expenses', path: '/fuel', icon: 'fuel' },
    { id: 'analytics', label: 'Analytics', path: '/analytics', icon: 'chart' },
];

/* Stat card definitions (labels only — values come from API) */
const statDefinitions = [
    { key: 'activeVehicles', label: 'Active Vehicles' },
    { key: 'availableVehicles', label: 'Available Vehicles' },
    { key: 'vehiclesInMaintenance', label: 'Vehicles in\nMaintenance' },
    { key: 'activeTrips', label: 'Active Trips' },
    { key: 'pendingTrips', label: 'Pending Trips' },
    { key: 'driversOnDuty', label: 'Drivers on\nDuty' },
    { key: 'fleetUtilization', label: 'Fleet\nUtilization' },
];

/* Vehicle status definitions (labels/colors only — counts come from API) */
const statusDefinitions = [
    { key: 'available', label: 'Available', colorClass: 'available' },
    { key: 'onTrip', label: 'On Trip', colorClass: 'on-trip' },
    { key: 'inShop', label: 'In Shop', colorClass: 'in-shop' },
    { key: 'retired', label: 'Retired', colorClass: 'retired' },
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

function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    /* ---- Dynamic state (populated from API) ---- */
    const [stats, setStats] = useState({});
    const [trips, setTrips] = useState([]);
    const [vehicleStatus, setVehicleStatus] = useState({});
    const [totalFleet, setTotalFleet] = useState(0);
    const [fleetUtilization, setFleetUtilization] = useState(0);
    const [user, setUser] = useState({ name: '', role: '' });
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    /* ---- Fetch dashboard data ---- */
    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true);

                // TODO: Replace with actual API calls
                // const res = await fetch('/api/dashboard');
                // const data = await res.json();
                // setStats(data.stats);
                // setTrips(data.recentTrips);
                // setVehicleStatus(data.vehicleStatus);
                // setTotalFleet(data.totalFleet);
                // setFleetUtilization(data.fleetUtilization);
                // setUser(data.user);

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    /* ---- Derived values ---- */
    const circumference = 2 * Math.PI * 22;
    const offset = circumference - (fleetUtilization / 100) * circumference;

    /* Format stat value for display */
    const getStatValue = (key) => {
        const val = stats[key];
        if (val === undefined || val === null) return '—';
        if (key === 'fleetUtilization') return `${val}%`;
        return String(val).padStart(2, '0');
    };

    /* Get vehicle status count */
    const getStatusCount = (key) => vehicleStatus[key] ?? 0;

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
                    {navItems.map((item) => (
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
                            placeholder="Search vehicles, drivers, or trips..."
                            id="header-search-input"
                        />
                    </div>

                    <div className="header-actions">
                        <button className="dispatch-btn" id="dispatch-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Dispatch
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

                {/* Filters */}
                <div className="filters-bar">
                    <span className="filters-label">Filters</span>
                    <select className="filter-select" id="filter-vehicle-type" defaultValue="all">
                        <option value="all">All Vehicles</option>
                        <option value="vans">Vans</option>
                        <option value="trucks">Trucks</option>
                        <option value="mini">Mini</option>
                    </select>
                    <select className="filter-select" id="filter-status" defaultValue="all">
                        <option value="all">Status: All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select className="filter-select" id="filter-region" defaultValue="all">
                        <option value="all">Region: All</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                        <option value="east">East</option>
                        <option value="west">West</option>
                    </select>
                    <button className="clear-filters" id="clear-filters">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Clear Filters
                    </button>
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    {statDefinitions.map((stat) => (
                        <div className="stat-card" key={stat.key}>
                            <div className="stat-label" style={{ whiteSpace: 'pre-line' }}>
                                {stat.label}
                            </div>
                            <div className="stat-value">{getStatValue(stat.key)}</div>
                        </div>
                    ))}
                </div>

                {/* Content: Trips + Vehicle Status */}
                <div className="dashboard-content">
                    {/* Recent Trips */}
                    <div className="recent-trips">
                        <div className="section-header">
                            <h2 className="section-title">Recent Trips</h2>
                            <button className="section-menu-btn" id="trips-menu-btn" aria-label="More options">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                                </svg>
                            </button>
                        </div>

                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Trip</th>
                                    <th>Vehicle</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>ETA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.length > 0 ? (
                                    trips.map((trip) => (
                                        <tr key={trip.id}>
                                            <td className="trip-id">{trip.id}</td>
                                            <td className="trip-vehicle">{trip.vehicle || '—'}</td>
                                            <td className="trip-driver">{trip.driver || '—'}</td>
                                            <td>
                                                <span className={`status-badge ${trip.status}`}>
                                                    {trip.statusText}
                                                </span>
                                            </td>
                                            <td className={`trip-eta ${trip.etaClass || ''}`}>
                                                {trip.eta || '—'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#8a988a', padding: '32px 24px' }}>
                                            {loading ? 'Loading trips...' : 'No trips to display'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <button className="view-all-link" id="view-all-trips">
                            View All Trips
                        </button>
                    </div>

                    {/* Vehicle Status */}
                    <div className="vehicle-status">
                        <div className="section-header">
                            <h2 className="section-title">Vehicle Status</h2>
                            <button className="status-info-btn" aria-label="Vehicle status info">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                            </button>
                        </div>

                        <div className="status-bars">
                            {statusDefinitions.map((s) => {
                                const count = getStatusCount(s.key);
                                const pct = totalFleet > 0 ? (count / totalFleet) * 100 : 0;
                                return (
                                    <div className="status-bar-row" key={s.key}>
                                        <span className="status-bar-label">{s.label}</span>
                                        <div className="status-bar-track">
                                            <div
                                                className={`status-bar-fill ${s.colorClass}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="status-bar-count">
                                            {String(count).padStart(2, '0')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="total-fleet">
                            <div className="total-fleet-info">
                                <span className="total-fleet-label">Total Fleet</span>
                                <span className="total-fleet-value">{totalFleet || '—'}</span>
                            </div>
                            <div className="circular-progress">
                                <svg width="56" height="56" viewBox="0 0 56 56">
                                    <circle className="bg" cx="28" cy="28" r="22" />
                                    <circle
                                        className="fill"
                                        cx="28"
                                        cy="28"
                                        r="22"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;