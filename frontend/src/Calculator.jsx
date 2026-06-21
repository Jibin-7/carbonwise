import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';

/**
 * UI SVG Icon Components
 * Code Quality: Abstracts visual elements to keep the main component logic clean and readable.
 */
const Icons = {
  Car: () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8M4 17l1-5h14l1 5M4 17a2 2 0 002 2h12a2 2 0 002-2M4 17v-1a2 2 0 012-2h12a2 2 0 012 2v1M6 13h12M9 21v-2m6 2v-2" />
    </svg>
  ),
  Flight: () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Bolt: () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Leaf: () => (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

function Calculator() {
  const navigate = useNavigate();
  
  // State Architecture
  const [formData, setFormData] = useState({
    transport: '',
    flights: '',
    electricity: '',
    diet: 'vegetarian'
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);

  // Maintainability: Load existing user token for historical tracking
  useEffect(() => {
    const stored = localStorage.getItem('carbonData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.user_token) setSessionToken(parsed.user_token);
      } catch (e) {
        console.error("Session fetch error.");
      }
    }
  }, []);

  // Security: Strict frontend bounds validation before API calls
  const validateForm = () => {
    const errors = {};
    const t = Number(formData.transport);
    const f = Number(formData.flights);
    const e = Number(formData.electricity);

    if (formData.transport === '' || t < 0 || t > 15000) {
      errors.transport = "Must be between 0 and 15,000 miles.";
    }
    if (formData.flights === '' || f < 0 || f > 720) {
      errors.flights = "Must be between 0 and 720 hours.";
    }
    if (formData.electricity === '' || e < 0 || e > 10000) {
      errors.electricity = "Must be between 0 and 10,000 kWh.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    // Efficiency: Constructing precise payload mapped to backend schema
    const payload = {
      transport: Number(formData.transport),
      flights: Number(formData.flights),
      electricity: Number(formData.electricity),
      diet: formData.diet,
      ...(sessionToken && { user_token: sessionToken })
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/calculate`, payload);
      
      // Merge new data with potential existing token logic
      const dataToStore = response.data;
      localStorage.setItem('carbonData', JSON.stringify(dataToStore));
      
      // Usability: Provide a brief visual loading state for premium feel
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (err) {
      setServerError(err.response?.data?.description || "A network protocol error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Environmental Analysis</h1>
        <p className="text-slate-500 mt-2">Enter your lifestyle metrics to generate a precise carbon compliance report.</p>
      </div>

      {serverError && (
        <div aria-live="assertive" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <div className="flex-shrink-0 text-red-500 mt-0.5 mr-3">
             {/* Alert Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-sm font-medium text-red-800">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        
        {/* Section 1: Transportation */}
        <fieldset>
          <legend className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2 w-full">Mobility Profile</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ground Transport */}
            <div>
              <label htmlFor="transport" className="block text-sm font-medium text-slate-700 mb-1">
                Ground Commute <span className="text-slate-400 font-normal">(Miles/Week)</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Car />
                </div>
                <input 
                  id="transport" name="transport" type="number" 
                  aria-invalid={!!fieldErrors.transport} aria-describedby="transport-error"
                  className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg focus:outline-none transition-shadow
                    ${fieldErrors.transport ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 hover:bg-white'}
                  `}
                  placeholder="e.g., 150" value={formData.transport} onChange={handleInputChange} 
                />
              </div>
              {fieldErrors.transport && <p className="mt-1.5 text-xs text-red-600 font-medium" id="transport-error">{fieldErrors.transport}</p>}
            </div>

            {/* Aviation */}
            <div>
              <label htmlFor="flights" className="block text-sm font-medium text-slate-700 mb-1">
                Aviation <span className="text-slate-400 font-normal">(Hours/Year)</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Flight />
                </div>
                <input 
                  id="flights" name="flights" type="number" 
                  aria-invalid={!!fieldErrors.flights} aria-describedby="flights-error"
                  className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg focus:outline-none transition-shadow
                    ${fieldErrors.flights ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 hover:bg-white'}
                  `}
                  placeholder="e.g., 12" value={formData.flights} onChange={handleInputChange} 
                />
              </div>
              {fieldErrors.flights && <p className="mt-1.5 text-xs text-red-600 font-medium" id="flights-error">{fieldErrors.flights}</p>}
            </div>
          </div>
        </fieldset>

        {/* Section 2: Housing & Lifestyle */}
        <fieldset>
          <legend className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2 w-full">Infrastructure & Lifestyle</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Electricity */}
            <div>
              <label htmlFor="electricity" className="block text-sm font-medium text-slate-700 mb-1">
                Grid Electricity <span className="text-slate-400 font-normal">(kWh/Month)</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Bolt />
                </div>
                <input 
                  id="electricity" name="electricity" type="number" 
                  aria-invalid={!!fieldErrors.electricity} aria-describedby="electricity-error"
                  className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg focus:outline-none transition-shadow
                    ${fieldErrors.electricity ? 'border-red-300 ring-1 ring-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 hover:bg-white'}
                  `}
                  placeholder="e.g., 350" value={formData.electricity} onChange={handleInputChange} 
                />
              </div>
              {fieldErrors.electricity && <p className="mt-1.5 text-xs text-red-600 font-medium" id="electricity-error">{fieldErrors.electricity}</p>}
            </div>

            {/* Diet */}
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-slate-700 mb-1">
                Primary Dietary Intake
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Leaf />
                </div>
                <select 
                  id="diet" name="diet" 
                  className="block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg focus:outline-none border-slate-300 border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 hover:bg-white appearance-none cursor-pointer"
                  value={formData.diet} onChange={handleInputChange}
                >
                  <option value="vegan">Strict Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="meat">Omnivore (Meat-Inclusive)</option>
                </select>
                {/* Custom select arrow for cross-browser consistency */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-end border-t border-slate-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex justify-center items-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600
              ${isSubmitting ? 'bg-emerald-500 cursor-not-allowed opacity-80' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'}
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Protocol...
              </>
            ) : 'Generate Analytics'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Calculator;