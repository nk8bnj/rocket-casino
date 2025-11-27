import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import '../Auth/Auth.css';

export default function Login() {
	const navigate = useNavigate();
	const { signIn, error } = useAuthStore();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [validationError, setValidationError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError('');

		if (!formData.email || !formData.password) {
			setValidationError('Please enter email and password');
			return;
		}

		if (formData.password.length < 6) {
			setValidationError('Password must be at least 6 characters');
			return;
		}

		try {
			setIsLoading(true);
			await signIn(formData.email, formData.password);
			navigate('/game');
		} catch (err: unknown) {
			setValidationError(err instanceof Error ? err.message : 'Login failed');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card glass-card fade-in">
				<div className="auth-logo">
					<div className="logo-icon">
						<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
							<path
								d="M24 4L28 20L44 24L28 28L24 44L20 28L4 24L20 20L24 4Z"
								fill="url(#gradient)"
							/>
							<defs>
								<linearGradient id="gradient" x1="4" y1="4" x2="44" y2="44">
									<stop offset="0%" stopColor="#3b82f6" />
									<stop offset="100%" stopColor="#8b5cf6" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<h1 className="auth-title">Rocket Casino</h1>
					<p className="auth-subtitle">Welcome back!</p>
				</div>

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							className="input-field"
							placeholder="Enter your email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							className="input-field"
							placeholder="Enter password"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						/>
					</div>

					{(validationError || error) && (
						<div className="error-message">
							{validationError || error}
						</div>
					)}

					<button type="submit" className="btn btn-primary auth-button" disabled={isLoading}>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path
								d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z"
								fill="currentColor"
							/>
						</svg>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>

					<div className="auth-footer">
						<Link to="/register" className="auth-link">
							Don't have an account? Register
						</Link>
					</div>

					<p className="auth-notice">
						Your account data is stored locally in your browser
					</p>
				</form>
			</div>
		</div>
	);
}
