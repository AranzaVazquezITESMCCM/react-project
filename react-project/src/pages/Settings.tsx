import React, { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser, updateUserProfile } from '../services/authService';
import { useTemperatureUnit } from '../services/useTemperatureUnit';

interface SettingsProfilePageProps {
  onBack?: () => void;
}

const SettingsProfilePage: React.FC<SettingsProfilePageProps> = ({ onBack }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [userName, setUserName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Usar el hook de temperatura
  const { tempUnit, toggleTempUnit } = useTemperatureUnit();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setUserName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, []);

  function handleEditProfile(): void {
    setIsEditing(true);
    setError('');
    setSuccess('');
  }

  function handleSaveProfile(): void {
    setError('');
    setSuccess('');

    if (!userName || !email) {
      setError('Name and email are required');
      return;
    }

    if (!user) {
      setError('User not found');
      return;
    }

    const result = updateUserProfile(user.id, userName, email);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setUser(getCurrentUser());
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message);
    }
  }

  function handleCancelEdit(): void {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (user) {
      setUserName(user.name);
      setEmail(user.email);
    }
  }

  function handleLogout(): void {
    const confirmed: boolean = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logoutUser();
      if (onBack) {
        onBack();
      }
    }
  }

  function handleBackClick(): void {
    if (onBack) {
      onBack();
    }
  }

  const userInitials: string = userName.split(' ').map(function(n: string): string {
    return n[0];
  }).join('').toUpperCase();

  const avatarStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    fontSize: '2.5rem'
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="bg-white shadow-sm">
        <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: '1200px' }}>
          <div className="d-flex align-items-center">
            <button
              onClick={handleBackClick}
              className="btn btn-link text-dark p-0 me-3 text-decoration-none"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h4 className="mb-0 fw-bold">Settings</h4>
          </div>
        </div>
      </div>
     
      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: '1200px' }}>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Profile</h5>
           
            <div className="text-center mb-4">
              <div className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center text-white fw-bold" style={avatarStyle}>
                {userInitials}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            {isEditing ? (
              <>
                <div className="mb-3">
                  <label className="text-muted small mb-2 d-block">User Name</label>
                  <input
                    type="text"
                    className="form-control p-3"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-muted small mb-2 d-block">Email Address</label>
                  <input
                    type="email"
                    className="form-control p-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary flex-fill py-2"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="btn btn-outline-secondary flex-fill py-2"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-3">
                  <label className="text-muted small mb-2 d-block">User Name</label>
                  <div className="bg-light rounded p-3">
                    <strong>{userName}</strong>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-muted small mb-2 d-block">Email Address</label>
                  <div className="bg-light rounded p-3">
                    {email}
                  </div>
                </div>

                <button
                  onClick={handleEditProfile}
                  className="btn btn-primary w-100 py-2"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">Preferences</h5>

            <button
              onClick={toggleTempUnit}
              className="btn btn-light w-100 text-start mb-3 p-3 d-flex justify-content-between align-items-center"
            >
              <span className="fw-semibold">Temperature Units</span>
              <span className="badge bg-primary px-3 py-2">{tempUnit}</span>
            </button>

            <div className="alert alert-info small mb-3">
              <strong>ℹ️ Note:</strong> Temperature unit preference is now saved and will apply across all pages.
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger w-100 mt-4 p-3 d-flex align-items-center justify-content-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfilePage;