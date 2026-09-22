import { DiningTable } from '../../types';
import { MOCK_FLOOR_TABLES } from '../../constants';
import { LocalDbService } from '../../services/localDbService';

export const FLOOR_PLAN_STORAGE_KEY = 'newgate_floor_plan_tables';

/**
 * Loads the saved floor plan from localStorage or fallback to default tables
 */
export const loadSavedFloorPlan = (fallbackTables: DiningTable[] = MOCK_FLOOR_TABLES): DiningTable[] => {
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FLOOR_PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Check LocalDbService fallback
      const localState = LocalDbService.getTableState();
      if (localState?.tables && Array.isArray(localState.tables) && localState.tables.length > 0) {
        return localState.tables;
      }
    }
  } catch (e) {
    console.warn('[floorPlanStorage] Failed to read saved floor plan:', e);
  }
  return fallbackTables;
};

/**
 * Persists the floor plan tables to localStorage and LocalDbService,
 * ensuring businessId tags and preserving tables of other businesses.
 */
export const saveFloorPlan = (tables: DiningTable[], businessId: string = 'B001'): DiningTable[] => {
  const bizId = businessId || 'B001';
  
  // Tag all current tables with businessId if missing
  const currentBizTables = tables.map(t => ({
    ...t,
    businessId: t.businessId || bizId
  }));

  let merged: DiningTable[] = currentBizTables;
  try {
    if (typeof window !== 'undefined') {
      const existingRaw = localStorage.getItem(FLOOR_PLAN_STORAGE_KEY);
      if (existingRaw) {
        const existing: DiningTable[] = JSON.parse(existingRaw);
        if (Array.isArray(existing)) {
          const currentIds = new Set(currentBizTables.map(t => t.id));
          // Retain tables belonging to other businesses and avoid duplicates by id
          const otherBizTables = existing.filter(t => 
            t.businessId && t.businessId !== bizId && !currentIds.has(t.id)
          );
          merged = [...otherBizTables, ...currentBizTables];
        }
      }
      localStorage.setItem(FLOOR_PLAN_STORAGE_KEY, JSON.stringify(merged));
      LocalDbService.saveTableState(merged, {});
      window.dispatchEvent(new CustomEvent('floor_plan_saved', { detail: merged }));
    }
  } catch (e) {
    console.warn('[floorPlanStorage] Failed to save floor plan:', e);
  }

  return merged;
};
