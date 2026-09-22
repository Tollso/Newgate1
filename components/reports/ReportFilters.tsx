import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, ChevronDown, Check, Clock, Sparkles, Filter, 
  Users, ShoppingBag, Sun, Monitor, Tag, RotateCcw, SlidersHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomDateModal } from './CustomDateModal';

interface DateRangeSelectorProps {
    value: string;
    onChange: (val: string) => void;
}

export const getMultiplierForDateRange = (dateRange: string): number => {
    if (!dateRange) return 1.0;
    if (dateRange === 'Yesterday') return 0.9;
    if (dateRange === 'This Week') return 5.0;
    if (dateRange === 'Last Week') return 5.2;
    if (dateRange === 'Last 7 Days') return 6.5;
    if (dateRange === 'This Month') return 22.0;
    if (dateRange === 'Last Month') return 28.0;
    if (dateRange === 'Last 30 Days') return 28.0;
    if (dateRange === 'Last 3 Months') return 85.0;
    if (dateRange === 'Last 6 Months') return 170.0;
    if (dateRange === 'This Year') return 250.0;
    if (dateRange === 'Last Year') return 340.0;
    if (dateRange === 'Last 12 Months') return 340.0;
    if (dateRange.startsWith('Custom')) return 12.0;
    return 1.0;
};

const extractCustomDates = (val: string): string | null => {
    if (!val) return null;
    if (val === 'Custom' || val === 'Custom Date Range') return null;
    if (val.startsWith('Custom')) {
        const match = val.match(/\((.*?)\)/);
        if (match && match[1]) return match[1];
        const cleaned = val.replace(/^Custom\s*(Range)?\s*/i, '').trim();
        return cleaned || null;
    }
    return null;
};

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const sections = [
        {
            title: 'Short Term',
            options: ['Today', 'Yesterday', 'This Week', 'Last Week', 'Last 7 Days']
        },
        {
            title: 'Monthly',
            options: ['This Month', 'Last Month', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months']
        },
        {
            title: 'Yearly & Custom',
            options: ['This Year', 'Last Year', 'Last 12 Months', 'Custom Date Range']
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const customDates = extractCustomDates(value);
    let displayValue = value;
    if (value === 'Custom' || value === 'Custom Date Range') {
        displayValue = 'Custom Date Range';
    } else if (customDates) {
        displayValue = `Custom: ${customDates}`;
    }

    return (
        <div className={`relative ${isOpen ? 'z-[100]' : 'z-10'}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between min-w-[220px] w-full bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-indigo-300 rounded-xl px-3.5 py-1.5 shadow-xs hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
            >
                <div className="flex items-center gap-2.5 truncate pr-2">
                    <div className="p-1.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-lg shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                        <Calendar size={14} />
                    </div>
                    <div className="flex flex-col text-left truncate">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600/90 leading-none mb-0.5">
                            Date Horizon
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{displayValue}</span>
                    </div>
                </div>
                <ChevronDown size={15} className={`text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden left-0"
                    >
                        <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200">
                                <Sparkles size={14} className="text-amber-400" />
                                <span>Reporting Horizon</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                                Interactive
                            </span>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-1.5 space-y-2">
                            {sections.map((section, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="px-2 pt-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        {section.title}
                                    </div>
                                    <div className="space-y-0.5">
                                        {section.options.map((option) => {
                                            const isCustomOption = option === 'Custom Date Range';
                                            const isSelected = isCustomOption
                                                ? (value === 'Custom' || value.startsWith('Custom'))
                                                : value === option;

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isCustomOption) {
                                                            setIsCustomModalOpen(true);
                                                        } else {
                                                            onChange(option);
                                                            setIsOpen(false);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-all ${
                                                        isCustomOption
                                                            ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100/80 my-1 font-bold'
                                                            : isSelected
                                                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-bold'
                                                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    {isCustomOption ? (
                                                        <div className="flex flex-col truncate pr-2">
                                                            <span className="truncate flex items-center gap-1.5">
                                                                <Calendar size={13} className="text-indigo-500" />
                                                                {option}
                                                            </span>
                                                            {customDates && (
                                                                <span className="text-[10px] font-medium text-indigo-600 mt-0.5">
                                                                    Active: {customDates}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="truncate">{option}</span>
                                                    )}
                                                    {isSelected && <Check size={15} className={isCustomOption ? 'text-indigo-600' : 'text-white'} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <Clock size={13} className="text-indigo-500 shrink-0" />
                            <span>Reports calculate 12:00 AM – 11:59 PM</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CustomDateModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                onApply={(val) => {
                    onChange(val);
                    setIsCustomModalOpen(false);
                    setIsOpen(false);
                }}
            />
        </div>
    );
};

interface FilterSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: string[] | { label: string, value: string }[];
    icon?: React.ReactNode;
    placeholder?: string;
    label?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ value, onChange, options, icon, placeholder, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const safeOptions = options || [];
    const selectedLabel = typeof safeOptions[0] === 'string' 
        ? value 
        : (safeOptions as {label: string, value: string}[]).find(o => o?.value === value)?.label || placeholder || value;

    const isActive = Boolean(
        value && 
        value !== 'All' && 
        value !== 'ALL' && 
        !value.toLowerCase().startsWith('all ')
    );

    const getContextIcon = () => {
        if (icon) return icon;
        const l = (label || '').toLowerCase();
        if (l.includes('employee') || l.includes('staff')) return <Users size={13} className={isActive ? 'text-indigo-600' : 'text-indigo-500'} />;
        if (l.includes('order') || l.includes('type')) return <ShoppingBag size={13} className={isActive ? 'text-indigo-600' : 'text-emerald-500'} />;
        if (l.includes('daypart') || l.includes('time')) return <Sun size={13} className={isActive ? 'text-indigo-600' : 'text-amber-500'} />;
        if (l.includes('device') || l.includes('terminal')) return <Monitor size={13} className={isActive ? 'text-indigo-600' : 'text-violet-500'} />;
        if (l.includes('discount') || l.includes('category')) return <Tag size={13} className={isActive ? 'text-indigo-600' : 'text-pink-500'} />;
        return <SlidersHorizontal size={13} className={isActive ? 'text-indigo-600' : 'text-indigo-500'} />;
    };

    const firstOptionVal = typeof safeOptions[0] === 'string' 
        ? safeOptions[0] 
        : (safeOptions[0] as {value: string})?.value || 'All';

    return (
        <div className={`relative ${isOpen ? 'z-[100]' : 'z-10'}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between min-w-[170px] w-full rounded-xl px-3 py-1.5 text-xs transition-all duration-200 group border shadow-xs ${
                    isActive
                        ? 'bg-gradient-to-r from-indigo-50 via-violet-50/60 to-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-indigo-100/60 ring-2 ring-indigo-500/10'
                        : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
            >
                <div className="flex items-center gap-2 truncate pr-1">
                    <div className={`p-1 rounded-md transition-colors ${isActive ? 'bg-indigo-200/60' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                        {getContextIcon()}
                    </div>
                    <div className="flex flex-col text-left truncate">
                        {label && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600 leading-none mb-0.5">
                                {label}
                            </span>
                        )}
                        <span className={`text-xs truncate ${isActive ? 'font-bold text-indigo-950' : 'font-semibold text-slate-700'}`}>
                            {selectedLabel}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                    {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" title="Filter active" />
                    )}
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-2 w-full min-w-[180px] max-h-72 overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl py-1.5"
                    >
                        {label && (
                            <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                                    Filter by {label}
                                </span>
                                {isActive && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(firstOptionVal);
                                            setIsOpen(false);
                                        }}
                                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
                                    >
                                        <RotateCcw size={10} /> Reset
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="p-1 space-y-0.5">
                            {options.map((option, idx) => {
                                const optValue = typeof option === 'string' ? option : option.value;
                                const optLabel = typeof option === 'string' ? option : option.label;
                                const isSelected = value === optValue;
                                
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            onChange(optValue);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-all ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-200'
                                                : 'text-slate-700 hover:bg-slate-100/80 hover:text-indigo-600'
                                        }`}
                                    >
                                        <span className="truncate">{optLabel}</span>
                                        {isSelected && <Check size={14} className="text-white shrink-0 ml-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
