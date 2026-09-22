
import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Send, DollarSign, CreditCard } from 'lucide-react';
import { FeedbackSettings, Feedback } from '../../types';

interface ReceiptFeedbackProps {
    settings?: FeedbackSettings;
    onAddFeedback?: (feedback: Feedback) => void;
    onAddTip?: (tipAmount: number) => void;
}

const DEFAULT_FEEDBACK_SETTINGS: FeedbackSettings = {
    enabled: true,
    publicReviewUrl: 'https://g.page/r/example-review-link',
    fiveStarMessage: 'Thank you! Please share your experience on Google.',
    googleReviewUrl: 'https://g.page/r/example-review-link',
    lowStarMessage: 'We appreciate your honesty. Let us know how we can do better.',
    minRatingForPublic: 4,
    autoSendSms: true
};

const ReceiptFeedback: React.FC<ReceiptFeedbackProps> = ({ settings = DEFAULT_FEEDBACK_SETTINGS, onAddFeedback, onAddTip }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [addedTip, setAddedTip] = useState<number | null>(null);

    const handleSubmit = () => {
        if (rating > 0 && rating <= 4) {
            if (onAddFeedback) {
                onAddFeedback({
                    id: `FB-${Date.now()}`,
                    rating,
                    comment,
                    timestamp: new Date().toISOString()
                });
            }
        }
        if (addedTip && onAddTip) {
            onAddTip(addedTip);
        }
        setSubmitted(true);
    };

    if (submitted) {
        if (rating === 5) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in border border-emerald-100">
                        <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                            <Star size={32} className="fill-current" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">We're so glad you enjoyed it!</h2>
                        <p className="text-slate-600 mb-8">{settings.fiveStarMessage}</p>
                        <a 
                            href={settings.googleReviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                            Review us on Google
                        </a>
                        {addedTip && <p className="mt-6 text-emerald-600 font-bold">Tip Added: ${addedTip.toFixed(2)}</p>}
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in border border-slate-200">
                    <div className="mx-auto h-16 w-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-6">
                        <ThumbsUp size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
                    <p className="text-slate-500">Your feedback helps us serve you better.</p>
                    {addedTip && <p className="mt-4 text-emerald-600 font-bold">Tip Added: ${addedTip.toFixed(2)}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in">
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h1 className="text-xl font-bold">OmniCommand Cafe</h1>
                    <p className="text-indigo-100 text-sm mt-1">Receipt #REC-8291</p>
                </div>
                
                <div className="p-8 space-y-8">
                    {/* Feedback Section */}
                    <div className="text-center">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Rate Your Visit</label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    <Star 
                                        size={44} 
                                        className={`transition-colors ${star <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {rating > 0 && rating <= 4 && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-bold text-slate-700 mb-2">How can we improve?</label>
                            <p className="text-xs text-slate-500 mb-3">{settings.lowStarMessage}</p>
                            <div className="relative">
                                <MessageSquare size={18} className="absolute top-3 left-3 text-slate-400" />
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                    placeholder="Tell us what you liked or how we can improve..."
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {rating === 5 && (
                        <div className="animate-fade-in text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-emerald-700 font-medium">Awesome! We're glad you loved it.</p>
                        </div>
                    )}

                    {/* Post-Payment Tip Section */}
                    <div className="border-t border-slate-200 pt-6">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <DollarSign size={18} className="text-emerald-600" /> Add a Tip?
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Did you enjoy the service? You can add a tip to your previous payment.</p>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {[2, 5, 10].map(amt => (
                                <button 
                                    key={amt}
                                    onClick={() => setAddedTip(amt)}
                                    className={`py-2 border rounded-lg font-bold transition-colors ${addedTip === amt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-emerald-50'}`}
                                >
                                    ${amt}
                                </button>
                            ))}
                        </div>
                        {addedTip && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 p-3 rounded-lg mb-4">
                                <CreditCard size={16} />
                                Charging card ending in •••• 4242
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Send size={18} /> {addedTip ? 'Submit & Tip' : (rating === 5 ? 'Continue' : 'Submit Feedback')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptFeedback;
