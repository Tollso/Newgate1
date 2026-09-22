import { Schedule, Employee } from '../../types';

/**
 * Parses a time string (e.g. "09:00 AM", "4:30 PM", "13:30", "12:00 PM") and returns the hour value in decimal.
 */
export const parseTimeToHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  
  const normalized = timeStr.trim().replace(/\s+/g, ' ');
  
  // 12-hour format with optional space before AM/PM
  const ampmMatch = normalized.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3].toUpperCase();
    
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours + minutes / 60;
  }
  
  // 24-hour format (e.g. "17:30")
  const standardMatch = normalized.match(/^(\d+):(\d+)$/);
  if (standardMatch) {
    const hours = parseInt(standardMatch[1], 10);
    const minutes = parseInt(standardMatch[2], 10);
    return hours + minutes / 60;
  }
  
  // Simple hour-only match (e.g. "9 AM", "5 PM")
  const simpleMatch = normalized.match(/^(\d+)\s*(AM|PM)$/i);
  if (simpleMatch) {
    let hours = parseInt(simpleMatch[1], 10);
    const ampm = simpleMatch[2].toUpperCase();
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours;
  }
  
  return 0;
};

/**
 * Calculates duration of a shift in hours, handling crossing of midnight.
 */
export const getShiftDurationInHours = (start: string, end: string): number => {
  const startH = parseTimeToHours(start);
  const endH = parseTimeToHours(end);
  let diff = endH - startH;
  if (diff < 0) {
    diff += 24; // Crosses midnight
  }
  return diff;
};

/**
 * Looks up the employee's pay rate or returns a sensible default rate based on their role.
 */
export const getHourlyRateForShift = (shift: Schedule, employeesList: Employee[]): number => {
  const employee = employeesList.find(emp => emp.id === shift.employeeId);
  if (employee && employee.hourlyRate > 0) {
    return employee.hourlyRate;
  }
  
  // Intelligent fallbacks based on role
  const roleLower = (shift.role || '').toLowerCase();
  if (roleLower.includes('manager')) return 35.00;
  if (roleLower.includes('chef') || roleLower.includes('cook')) return 24.00;
  if (roleLower.includes('bartender')) return 22.00;
  if (roleLower.includes('server')) return 18.00;
  if (roleLower.includes('host')) return 16.00;
  
  return 18.00; // General default rate
};

/**
 * Computes all metrics across the scheduled shifts.
 */
export const calculateLaborMetrics = (schedules: Schedule[], employeesList: Employee[]) => {
  const uniqueEmployees = new Set<string>();
  let totalHours = 0;
  let totalLaborCost = 0;
  
  schedules.forEach(shift => {
    const hours = getShiftDurationInHours(shift.shiftStart, shift.shiftEnd);
    const rate = getHourlyRateForShift(shift, employeesList);
    totalHours += hours;
    totalLaborCost += hours * rate;
    if (shift.employeeId) {
      uniqueEmployees.add(shift.employeeId);
    } else {
      uniqueEmployees.add(shift.employeeName);
    }
  });
  
  const avgHourlyRate = totalHours > 0 ? totalLaborCost / totalHours : 0;
  
  return {
    totalHours,
    totalLaborCost,
    shiftCount: schedules.length,
    employeeCount: uniqueEmployees.size,
    avgHourlyRate
  };
};

/**
 * Calculates labor cost grouped by date for the next 7 days starting from today.
 * Returns an array of { date: string, displayDate: string, cost: number } objects.
 */
export const getLaborCostTrendNext7Days = (schedules: Schedule[], employeesList: Employee[]) => {
  const result: { date: string; displayDate: string; cost: number }[] = [];
  
  // Generate next 7 days starting from today
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const displayDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    result.push({
      date: dateStr,
      displayDate,
      cost: 0
    });
  }
  
  schedules.forEach(shift => {
    if (!shift.shiftStart) return;
    const shiftDate = shift.shiftStart.split('T')[0];
    const match = result.find(r => r.date === shiftDate);
    if (match) {
      const hours = getShiftDurationInHours(shift.shiftStart, shift.shiftEnd);
      const rate = getHourlyRateForShift(shift, employeesList);
      match.cost += hours * rate;
    }
  });
  
  return result;
};

/**
 * Simple CSV parser that handles basic quoting and parses fields correctly.
 */
export const parseCSVLines = (csvText: string): string[][] => {
  const lines: string[][] = [];
  const rows = csvText.split(/\r?\n/);
  
  rows.forEach(row => {
    const trimmed = row.trim();
    if (!trimmed) return;
    
    const fields: string[] = [];
    let insideQuotes = false;
    let currentField = '';
    
    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());
    lines.push(fields);
  });
  
  return lines;
};

/**
 * Parses raw CSV string to Schedule objects, mapping headers intelligently.
 */
export const parseSchedulesFromCSV = (csvText: string, employeesList: Employee[]): Schedule[] => {
  const data = parseCSVLines(csvText);
  if (data.length < 2) return [];
  
  const headers = data[0].map(h => h.toLowerCase().replace(/[\s_-]+/g, ''));
  const rows = data.slice(1);
  
  const empIdx = headers.findIndex(h => h.includes('employee') || h.includes('name'));
  const startIdx = headers.findIndex(h => h.includes('start') || h.includes('begin'));
  const endIdx = headers.findIndex(h => h.includes('end') || h.includes('stop'));
  const roleIdx = headers.findIndex(h => h.includes('role') || h.includes('position'));
  const sectionIdx = headers.findIndex(h => h.includes('section') || h.includes('area') || h.includes('zone'));
  
  if (empIdx === -1 || startIdx === -1 || endIdx === -1) {
    throw new Error('CSV must contain column headers for Employee Name, Start Time, and End Time.');
  }
  
  const schedules: Schedule[] = [];
  
  rows.forEach((row, idx) => {
    if (row.length < 3) return;
    
    const empName = row[empIdx];
    const startVal = row[startIdx];
    const endVal = row[endIdx];
    const roleVal = roleIdx !== -1 && row[roleIdx] ? row[roleIdx] : 'Server';
    const sectionVal = sectionIdx !== -1 && row[sectionIdx] ? row[sectionIdx] : undefined;
    
    if (!empName || !startVal || !endVal) return;
    
    // Find matching employee by name (case-insensitive) or create general one
    const matchedEmployee = employeesList.find(
      emp => emp.name.toLowerCase() === empName.toLowerCase() || 
             emp.name.toLowerCase().includes(empName.toLowerCase())
    );
    
    const employeeId = matchedEmployee ? matchedEmployee.id : `E-CSV-${idx}-${Date.now()}`;
    const employeeName = matchedEmployee ? matchedEmployee.name : empName;
    const finalRole = matchedEmployee ? matchedEmployee.role : roleVal;
    
    schedules.push({
      id: `SCH-CSV-${idx}-${Date.now()}`,
      employeeId,
      employeeName,
      shiftStart: startVal,
      shiftEnd: endVal,
      role: finalRole,
      assignedSection: sectionVal || undefined,
      source: 'External'
    });
  });
  
  return schedules;
};

