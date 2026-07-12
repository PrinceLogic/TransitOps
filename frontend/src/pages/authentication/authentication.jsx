import { useState } from 'react';
import './authentication.css';

function Authentication() {
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log({ email, password, role, mode: isLogin ? 'login' : 'signup' });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setRole('');
    };

    return (
        <div className="auth-page">
            {/* Left Branding Panel */}
            <div className="auth-left">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="7" height="7" rx="2" fill="#0b1120" />
                            <rect x="14" y="3" width="7" height="7" rx="2" fill="#f59e0b" />
                            <rect x="3" y="14" width="7" height="7" rx="2" fill="#0b1120" opacity="0.4" />
                            <rect x="14" y="14" width="7" height="7" rx="2" fill="#0b1120" />
                        </svg>
                    </div>
                    <span className="auth-logo-text">TransitOps</span>
                </div>

                <div className="auth-left-content">
                    <div className="auth-badge">
                        <span className="auth-badge-dot"></span>
                        GLOBAL NETWORK
                    </div>

                    <h1 className="auth-headline">
                        Precision logistics.
                        <br />
                        <span className="highlight">Real-time control.</span>
                    </h1>

                    <p className="auth-subtitle">
                        Join the industry-leading platform for high-stakes operational
                        management. Streamline your freight, coordinate in real-time,
                        and eliminate cognitive fatigue.
                    </p>

                    <div className="auth-decoration">
                        <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
                            <path
                                className="auth-wave-path"
                                d="M0 30 Q 25 5, 50 30 T 100 30 T 150 30 T 200 30"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="auth-right">
                <div className={`auth-form-container ${isLogin ? 'login-mode' : ''}`}>
                    <h2 className="auth-form-title">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="auth-form-subtitle">
                        {isLogin
                            ? 'Sign in to your TransitOps dashboard.'
                            : 'Join our global logistics network today.'}
                    </p>

                    <form onSubmit={handleSubmit} id="auth-form">
                        {/* Email */}
                        <div className="auth-form-group">
                            <label className="auth-form-label" htmlFor="auth-email">
                                Email Address
                            </label>
                            <div className="auth-input-wrapper">
                                <input
                                    id="auth-email"
                                    className="auth-form-input"
                                    type="email"
                                    placeholder="operator@transitops.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="auth-form-group">
                            <label className="auth-form-label" htmlFor="auth-password">
                                Password
                            </label>
                            <div className="auth-input-wrapper">
                                <input
                                    id="auth-password"
                                    className="auth-form-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    minLength={8}
                                    style={{ paddingRight: '48px' }}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        /* Eye open icon */
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        /* Eye closed icon */
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="auth-form-hint">Must be at least 8 characters long.</p>
                        </div>

                        {/* Operational Role (signup only) */}
                        {!isLogin && (
                            <div className="auth-form-group">
                                <label className="auth-form-label" htmlFor="auth-role">
                                    Operational Role
                                </label>
                                <select
                                    id="auth-role"
                                    className={`auth-form-select ${role ? 'has-value' : ''}`}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select your role...
                                    </option>
                                    <option value="fleet-manager">Fleet Manager</option>
                                    <option value="dispatcher">Dispatcher</option>
                                    <option value="driver">Driver</option>
                                    <option value="logistics-coordinator">Logistics Coordinator</option>
                                    <option value="warehouse-manager">Warehouse Manager</option>
                                    <option value="operations-director">Operations Director</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" className="auth-submit-btn" id="auth-submit">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}

export default Authentication;
