import React from 'react';
import { useThemeStore } from '../store/useThemeStore';

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  
  // Define the themes directly in the component to avoid dependency on store structure
  const availableThemes = ['light', 'dark', 'retro'];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Theme Settings</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select Theme</span>
            </label>
            
            <select 
              className="select select-bordered w-full max-w-xs"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {availableThemes.map((themeOption) => (
                <option key={themeOption} value={themeOption}>
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Current Theme: {theme}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-primary text-primary-content p-4">
                <h4>Primary</h4>
              </div>
              <div className="card bg-secondary text-secondary-content p-4">
                <h4>Secondary</h4>
              </div>
              <div className="card bg-accent text-accent-content p-4">
                <h4>Accent</h4>
              </div>
              <div className="card bg-neutral text-neutral-content p-4">
                <h4>Neutral</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;