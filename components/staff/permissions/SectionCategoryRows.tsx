import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PermissionCategoryDef, RolePermissionAccess, RolePermissionMatrixState } from './types';
import { Role } from '../../../types';
import { PermissionToggle } from './PermissionToggle';
import { getLinkedPosOptionId, getPosOptionName } from './permissionCatalog';

interface SectionCategoryRowsProps {
  cat: PermissionCategoryDef;
  roles: Role[];
  matrix: RolePermissionMatrixState;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
  onChangePermission: (roleId: string, permissionId: string, value: RolePermissionAccess) => void;
}

export const SectionCategoryRows: React.FC<SectionCategoryRowsProps> = ({
  cat,
  roles,
  matrix,
  isExpanded,
  isHighlighted,
  onToggle,
  onChangePermission,
}) => {
  return (
    <>
      {/* Expandable Section Header Row: Click to expand / collapse all options */}
      <tr
        id={`section-${cat.id}`}
        onClick={onToggle}
        className={`cursor-pointer transition-all duration-300 border-y-2 select-none ${
          isHighlighted
            ? 'bg-indigo-100 border-indigo-400 ring-2 ring-indigo-500'
            : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-300'
        }`}
      >
        <td
          colSpan={roles.length + 1}
          className="px-4 py-3 sticky left-0 z-10 bg-inherit"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {/* Expand / Collapse Icon */}
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                  isExpanded
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-300 text-slate-700 hover:bg-indigo-500 hover:text-white'
                }`}
              >
                {isExpanded ? (
                  <ChevronDown size={15} strokeWidth={2.5} />
                ) : (
                  <ChevronRight size={15} strokeWidth={2.5} />
                )}
              </span>

              {/* Section Number Badge */}
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-xs">
                #{cat.number}
              </span>

              {/* Section Title */}
              <span className="font-extrabold text-slate-900 text-sm">
                {cat.name}
              </span>

              {/* Options count badge */}
              <span className="px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-300 text-[11px] font-bold shadow-2xs">
                {cat.permissions.length} options
              </span>
            </div>

            {/* Right Hint Info */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-slate-500 font-normal">
                {cat.description}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                {isExpanded ? 'Click to collapse' : 'Click to expand options'}
              </span>
            </div>
          </div>
        </td>
      </tr>

      {/* All options sitting cleanly under this section — shown when expanded */}
      {isExpanded &&
        cat.permissions.map((perm) => {
          const posOptionId = getLinkedPosOptionId(perm.id);
          const posOptionName = posOptionId ? getPosOptionName(posOptionId) : '';

          return (
            <tr key={perm.id} className="hover:bg-slate-50/80 transition-colors animate-fade-in">
              <td className="px-5 py-3 border-r border-slate-200 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                <span className="font-bold text-slate-900 block text-xs">
                  {perm.name}
                  {posOptionId && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] bg-slate-50 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-sm font-semibold ml-2" title={`Linked to: ${posOptionName}`}>
                      🔗 {posOptionName}
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">{perm.description}</span>
                {(perm.hasScope || perm.hasDollarLimit || perm.hasPercentLimit || perm.hasAgeLimit) && (
                  <div className="flex gap-1.5 mt-1">
                    {perm.hasScope && (
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-medium">
                        Supports Scope
                      </span>
                    )}
                    {(perm.hasDollarLimit || perm.hasPercentLimit) && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                        Limit Configurable
                      </span>
                    )}
                  </div>
                )}
              </td>

              {/* Pure On/Off Toggle Switch for each role without text */}
              {roles.map((role) => {
                const access = matrix[role.id]?.[perm.id] || 'DENY';
                const isReadOnly = role.id === 'R-ADMIN';
                const isPosEnabledForRole = posOptionId ? matrix[role.id]?.[posOptionId] === 'ALLOW' : true;

                return (
                  <td key={`${role.id}-${perm.id}`} className={`px-3 py-3 text-center border-r border-slate-200 transition-colors duration-200 ${!isPosEnabledForRole && access === 'ALLOW' ? 'bg-amber-50/30' : ''}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <PermissionToggle
                        access={access}
                        isReadOnly={isReadOnly}
                        onChange={(val) => onChangePermission(role.id, perm.id, val)}
                      />
                      {!isPosEnabledForRole && access === 'ALLOW' && (
                        <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider scale-90" title={`Requires ${posOptionName} to be active for this role`}>
                          ⚠️ No POS Access
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
    </>
  );
};
