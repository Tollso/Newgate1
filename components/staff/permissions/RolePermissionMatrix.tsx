import React, { useState, useRef } from 'react';
import { Search, Plus, Shield, Maximize2, Minimize2 } from 'lucide-react';
import { ALL_PERMISSION_CATEGORIES } from './permissionCatalog';
import { RolePermissionAccess, RolePermissionMatrixState, PermissionCategoryDef } from './types';
import { Role } from '../../../types';
import { SectionCategoryRows } from './SectionCategoryRows';
import { AddRoleModal } from './AddRoleModal';
import { AddSectionModal } from './AddSectionModal';
import { AddSectionDropdown } from './AddSectionDropdown';

interface RolePermissionMatrixProps {
  roles: Role[];
  matrix: RolePermissionMatrixState;
  onChangePermission: (roleId: string, permissionId: string, value: RolePermissionAccess) => void;
  onAddRole: (roleName: string, cloneFromRoleId?: string) => string | void;
  onOpenEmployeeOverrides?: () => void;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  roles,
  matrix,
  onChangePermission,
  onAddRole,
  onOpenEmployeeOverrides,
}) => {
  const [categories, setCategories] = useState<PermissionCategoryDef[]>(ALL_PERMISSION_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Accordion state: map of categoryId -> boolean (default all expanded)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    ALL_PERMISSION_CATEGORIES.forEach((cat) => {
      init[cat.id] = true;
    });
    return init;
  });

  const [highlightedSectionId, setHighlightedSectionId] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const toggleSection = (catId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleExpandAll = () => {
    const nextState: Record<string, boolean> = {};
    categories.forEach((cat) => {
      nextState[cat.id] = true;
    });
    setExpandedSections(nextState);
  };

  const handleCollapseAll = () => {
    const nextState: Record<string, boolean> = {};
    categories.forEach((cat) => {
      nextState[cat.id] = false;
    });
    setExpandedSections(nextState);
  };

  // Jump to section handler: expands the section, resets filter if needed, and scrolls smoothly to it
  const handleSelectAndJumpToSection = (catId: string) => {
    setSelectedSection('ALL');
    setExpandedSections((prev) => ({
      ...prev,
      [catId]: true,
    }));

    setTimeout(() => {
      const el = document.getElementById(`section-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightedSectionId(catId);
        setTimeout(() => {
          setHighlightedSectionId(null);
        }, 2500);
      }
    }, 50);
  };

  const handleAddCustomSection = (newSection: PermissionCategoryDef) => {
    setCategories((prev) => [...prev, newSection]);
    setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
    newSection.permissions.forEach((perm) => {
      roles.forEach((r) => {
        onChangePermission(r.id, perm.id, r.id === 'R-ADMIN' ? 'ALLOW' : 'DENY');
      });
    });
    handleSelectAndJumpToSection(newSection.id);
  };

  const filteredCategories = categories
    .map((cat) => {
      if (selectedSection !== 'ALL' && cat.id !== selectedSection) return null;
      const permissions = cat.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (permissions.length === 0) return null;
      return { ...cat, permissions };
    })
    .filter(Boolean) as PermissionCategoryDef[];

  const allExpanded = categories.every((c) => expandedSections[c.id]);
  const noneExpanded = categories.every((c) => !expandedSections[c.id]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search and Section Quick Selector */}
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 15 sections & options..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <select
              value={selectedSection}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSection(val);
                if (val !== 'ALL') {
                  setExpandedSections((prev) => ({ ...prev, [val]: true }));
                }
              }}
              className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 max-w-[210px]"
            >
              <option value="ALL">All 15 Sections</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.number}. {cat.name} ({cat.permissions.length} options)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Section Dropdown with separate 15 sections & click-to-go */}
          <AddSectionDropdown
            categories={categories}
            selectedCategoryId={selectedSection}
            onSelectAndJumpToSection={handleSelectAndJumpToSection}
            onFilterSection={(id) => setSelectedSection(id)}
            onOpenCreateSectionModal={() => setShowAddSectionModal(true)}
          />

          {/* Expand / Collapse All Accordion Controls */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs">
            <button
              type="button"
              onClick={handleExpandAll}
              disabled={allExpanded}
              className={`px-2.5 py-2 font-bold flex items-center gap-1 transition-colors ${
                allExpanded
                  ? 'text-slate-300 cursor-default'
                  : 'text-slate-700 hover:bg-white hover:text-indigo-600 cursor-pointer'
              }`}
              title="Expand all sections to show all options"
            >
              <Maximize2 size={13} />
              <span className="hidden md:inline">Expand All</span>
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button
              type="button"
              onClick={handleCollapseAll}
              disabled={noneExpanded}
              className={`px-2.5 py-2 font-bold flex items-center gap-1 transition-colors ${
                noneExpanded
                  ? 'text-slate-300 cursor-default'
                  : 'text-slate-700 hover:bg-white hover:text-indigo-600 cursor-pointer'
              }`}
              title="Collapse all sections to headers"
            >
              <Minimize2 size={13} />
              <span className="hidden md:inline">Collapse All</span>
            </button>
          </div>

          {onOpenEmployeeOverrides && (
            <button
              onClick={onOpenEmployeeOverrides}
              className="px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Shield size={14} /> Employee Overrides
            </button>
          )}

          <button
            onClick={() => setShowAddRoleModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus size={14} /> Add Role
          </button>
        </div>
      </div>

      {/* Matrix Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div ref={tableContainerRef} className="overflow-x-auto max-h-[72vh]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 text-xs text-slate-600 font-bold sticky top-0 z-20 shadow-xs">
              <tr>
                <th className="px-5 py-3.5 border-r border-slate-200 bg-slate-100 min-w-[340px] sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                  Section Options & Capabilities
                </th>
                {roles.map((role) => (
                  <th key={role.id} className="px-3 py-3.5 text-center border-r border-slate-200 min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-slate-900 text-xs">{role.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {role.isSystem ? 'System' : 'Custom'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCategories.map((cat) => (
                <SectionCategoryRows
                  key={cat.id}
                  cat={cat}
                  roles={roles}
                  matrix={matrix}
                  isExpanded={expandedSections[cat.id] ?? true}
                  isHighlighted={highlightedSectionId === cat.id}
                  onToggle={() => toggleSection(cat.id)}
                  onChangePermission={onChangePermission}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddRoleModal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        roles={roles}
        onAddRole={onAddRole}
      />

      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        nextNumber={categories.length + 1}
        onAddSection={handleAddCustomSection}
      />
    </div>
  );
};
