import React, { useState } from 'react';
import { Feedback, FeedbackSettings, Customer } from '../../types';
import { Star, Settings, MessageSquare, ExternalLink, Send, ChevronRight, User, ThumbsUp } from 'lucide-react';

interface FeedbackAppProps {
  feedbacks?: Feedback[];
  settings?: FeedbackSettings;
  feedbackSettings?: FeedbackSettings;
  onUpdateSettings?: (settings: FeedbackSettings) => void;
  onAddFeedback?: (feedback: Feedback) => void;
  onDeleteFeedback?: (id: string) => void;
  customers?: Customer[];
}

const DEFAULT_SETTINGS: FeedbackSettings = {
  enabled: true,
  publicReviewUrl: 'https://g.page/r/example-review-link',
  minRatingForPublic: 4,
  autoSendSms: true
};

const FeedbackApp: React.FC<FeedbackAppProps> = ({ 
  feedbacks = [], 
  settings, 
  feedbackSettings,
  onUpdateSettings, 
  onAddFeedback, 
  customers = [] 
}) => {
  const effectiveSettings = settings || feedbackSettings || DEFAULT_SETTINGS;
  const [activeTab, setActiveTab] = useState<'reviews' | 'settings' | 'simulate'>('reviews');

  // Settings State
  const [tempSettings, setTempSettings] = useState<FeedbackSettings>(effectiveSettings);

  // Simulation State
  const [simCustomer, setSimCustomer] = useState<string>(customers[0]?.id || '');
  const [simRating, setSimRating] = useState<number>(0);
  const [simNotes, setSimNotes] = useState<string>('');
  const [simSubmitted, setSimSubmitted] = useState(false);

  const handleSaveSettings = () => {
    if (onUpdateSettings) onUpdateSettings(tempSettings);
  };

  const handleSimulateSubmit = () => {
    if (simRating === 0) return;
    
    if (simRating <= 4) {
      const selectedCust = customers.find(c => c.id === simCustomer);
      const newFeedback: Feedback = {
        id: `FB-${Date.now()}`,
        customerId: simCustomer || 'GUEST',
        customerName: selectedCust?.name || 'Guest Customer',
        rating: simRating,
        comment: simNotes,
        timestamp: new Date().toISOString()
      };
      if (onAddFeedback) {
        onAddFeedback(newFeedback);
      }
    }
    setSimSubmitted(true);
  };

  const resetSimulation = () => {
    setSimRating(0);
    setSimNotes('');
    setSimSubmitted(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Feedback & Reviews</h2>
          <p className="text-slate-500 mt-1">Manage customer feedback rules and view incoming reviews.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare size={16} className="inline mr-2" />
            Inbox
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings size={16} className="inline mr-2" />
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('simulate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'simulate' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ExternalLink size={16} className="inline mr-2" />
            Simulate Email Flow
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No Feedback Yet</h3>
                <p className="text-slate-500 mt-2">Internal feedback (4 stars or below) will appear here.</p>
              </div>
            ) : (
              feedbacks.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(fb => (
                <div key={fb.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    {fb.customerName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{fb.customerName || 'Anonymous'}</h4>
                        <p className="text-xs text-slate-500">{new Date(fb.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < fb.rating ? 'fill-current' : 'text-slate-200'} />
                        ))}
                      </div>
                    </div>
                    {fb.comment && (
                      <div className="bg-slate-50 p-4 rounded-lg mt-3 border border-slate-100 text-slate-700">
                        "{fb.comment}"
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-3xl">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Settings size={20} className="text-indigo-600" />
              Automated Feedback Rules
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Google Restaurant Page URL</label>
                <input 
                  type="url" 
                  value={tempSettings.googleReviewUrl}
                  onChange={e => setTempSettings({...tempSettings, googleReviewUrl: e.target.value})}
                  placeholder="https://g.page/r/..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                />
                <p className="text-xs text-slate-500 mt-2">Customers who leave 5 stars will be redirected here.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">5-Star Thank You Message</label>
                <textarea 
                  value={tempSettings.fiveStarMessage}
                  onChange={e => setTempSettings({...tempSettings, fiveStarMessage: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">4-Star & Below Thank You Message (Internal Notes)</label>
                <textarea 
                  value={tempSettings.lowStarMessage}
                  onChange={e => setTempSettings({...tempSettings, lowStarMessage: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                />
                <p className="text-xs text-slate-500 mt-2">Shown when asking customers for private feedback on how we can improve.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulate' && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-800 p-4 text-center">
              <p className="text-slate-300 text-sm">Simulating Email Received by Customer</p>
            </div>
            
            <div className="p-8 text-center">
              {!simSubmitted ? (
                <>
                  <div className="mb-6 text-left">
                     <label className="block text-sm font-medium text-slate-600 mb-2">Select Customer to Simulate:</label>
                     <select 
                        value={simCustomer}
                        onChange={(e) => setSimCustomer(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg"
                     >
                       {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">How was your meal?</h3>
                    <p className="text-slate-500">Please rate your experience with us.</p>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setSimRating(star)}
                        className={`p-3 rounded-full transition-transform hover:scale-110 ${simRating >= star ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                      >
                        <Star size={48} className="fill-current" />
                      </button>
                    ))}
                  </div>

                  {simRating > 0 && simRating <= 4 && (
                    <div className="animate-fade-in text-left bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                      <p className="text-slate-700 font-medium mb-4">{settings.lowStarMessage}</p>
                      <textarea 
                        value={simNotes}
                        onChange={e => setSimNotes(e.target.value)}
                        placeholder="Please tell us how we can improve..."
                        rows={4}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button 
                        onClick={handleSimulateSubmit}
                        disabled={!simNotes.trim()}
                        className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  {simRating === 5 && (
                    <div className="animate-fade-in text-left bg-emerald-50 border border-emerald-100 p-6 rounded-xl mb-6">
                      <div className="flex items-center gap-3 mb-4 text-emerald-700">
                         <ThumbsUp size={24} />
                         <h4 className="font-bold text-lg">We're so glad you enjoyed it!</h4>
                      </div>
                      <p className="text-emerald-800 mb-6">{settings.fiveStarMessage}</p>
                      <a 
                        href={settings.googleReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setSimSubmitted(true)}
                        className="block w-full text-center bg-white border border-emerald-200 text-emerald-700 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                      >
                        Review us on Google
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star size={40} className="fill-current" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h3>
                  <p className="text-slate-500 mb-8">Your feedback has been recorded.</p>
                  
                  <button 
                    onClick={resetSimulation}
                    className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto"
                  >
                    Send another mock review <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackApp;
