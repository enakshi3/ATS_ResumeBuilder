import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Palette, Shield, CreditCard, Save } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, setUser } = useAuth();
    // ✅ Profile state
    const fullName = user?.name?.split(' ') || [];

const [profile, setProfile] = useState({
    firstName: fullName[0] || '',
    lastName: fullName.slice(1).join(' ') || '',
    email: user?.email || '',
    jobTitle: '',
});

    // ✅ Profile image state
    const [profileImage, setProfileImage] = useState(null);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    // ✅ Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    // ✅ Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    // ✅ Handle save
    const handleSave = () => {
    const updatedUser = {
        ...user,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    console.log('Saved Profile:', updatedUser);
};

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account preferences</p>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <>
                            <h2>Profile Settings</h2>

                            <div className="settings-section">
                                {/* ✅ Profile Image Upload */}
                                <div className="avatar-section">
                                    <div className="user-avatar large">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" />
                                        ) : (
                                            <User size={32} />
                                        )}
                                    </div>

                                    <label className="btn btn-secondary btn-sm">
                                        Change Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>

                                {/* ✅ Profile Form */}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="label">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="input"
                                            value={profile.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="label">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="input"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group full">
                                        <label className="label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="input"
                                            value={profile.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group full">
                                        <label className="label">Job Title</label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            className="input"
                                            value={profile.jobTitle}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* ✅ Save Button */}
                                <button className="btn btn-primary" onClick={handleSave}>
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <>
                            <h2>Notification Preferences</h2>
                            <div className="settings-section">
                                <p>Notification settings UI remains unchanged.</p>
                            </div>
                        </>
                    )}

                    {activeTab === 'appearance' && (
                        <>
                            <h2>Appearance</h2>
                            <div className="settings-section">
                                <p>Theme selection UI remains unchanged.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
