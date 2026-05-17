import type { FC } from 'react';
import type { BrandConfig, ACType } from '../types';
import { BRANDS, AC_TYPE_LABELS } from '../services/irDatabase';

interface BrandSelectorProps {
  selectedBrand: string | null;
  selectedType: ACType | null;
  onSelect: (brandId: string, acType: ACType) => void;
  onClose: () => void;
}

const BrandSelector: FC<BrandSelectorProps> = ({ selectedBrand, selectedType, onSelect, onClose }) => {
  const handleSelect = (brand: BrandConfig, type: ACType) => {
    onSelect(brand.id, type);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f23] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold">选择空调品牌</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 text-sm text-gray-400">
          请选择您空调的品牌和类型，以便匹配正确的红外码库。
        </div>

        <div className="space-y-3">
          {BRANDS.map(brand => (
            <div
              key={brand.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: selectedBrand === brand.id ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedBrand === brand.id ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              <div className="p-3 font-medium text-sm">{brand.name}</div>
              <div className="flex gap-2 px-3 pb-3">
                {brand.types.map(type => (
                  <button
                    key={type}
                    onClick={() => handleSelect(brand, type)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200 active:scale-95"
                    style={{
                      background: selectedBrand === brand.id && selectedType === type
                        ? 'rgba(0,212,255,0.25)'
                        : 'rgba(255,255,255,0.05)',
                      color: selectedBrand === brand.id && selectedType === type
                        ? '#00d4ff'
                        : '#888',
                      border: `1px solid ${
                        selectedBrand === brand.id && selectedType === type
                          ? 'rgba(0,212,255,0.4)'
                          : 'rgba(255,255,255,0.05)'
                      }`,
                    }}
                  >
                    {AC_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSelector;
