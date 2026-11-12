/**
 * NOWHERE® Page 02 — SHOP ALL
 * Complete 27-product catalogue with category filters, sorting, quick add, and responsive grid.
 */

import React, { useMemo, useState } from 'react';
import { ALL_PRODUCTS, formatMoney, getProductImageStyle, ProductItem } from '../data/fashionData';
import { useCart } from '../context/CartContext';

interface ShopAllPageProps {
  onOpenProductDetail: (product: ProductItem) => void;
}

type CategoryFilter = 'All' | 'Top' | 'Bottom' | 'Outerwear' | 'Shoes' | 'Accessory';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'alpha';

export const ShopAllPage: React.FC<ShopAllPageProps> = ({ onOpenProductDetail }) => {
  const { addToBag } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [quickAddProduct, setQuickAddProduct] = useState<ProductItem | null>(null);
  const [selectedQuickSize, setSelectedQuickSize] = useState<string>('');
  const [quickAddError, setQuickAddError] = useState(false);

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'Tops', value: 'Top' },
    { label: 'Bottoms', value: 'Bottom' },
    { label: 'Outerwear', value: 'Outerwear' },
    { label: 'Shoes', value: 'Shoes' },
    { label: 'Accessories', value: 'Accessory' },
  ];

  const filteredAndSorted = useMemo(() => {
    let list = ALL_PRODUCTS.filter(item => {
      if (selectedCategory === 'All') return true;
      return item.category === selectedCategory;
    });

    switch (selectedSort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'alpha':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        // Default Vol. 01 order
        break;
    }

    return list;
  }, [selectedCategory, selectedSort]);

  const handleExecuteQuickAdd = (product: ProductItem) => {
    if (!selectedQuickSize) {
      setQuickAddError(true);
      return;
    }
    addToBag(product, selectedQuickSize, 1);
    setQuickAddProduct(null);
    setSelectedQuickSize('');
    setQuickAddError(false);
  };

  return (
    <div className="pt-20 md:pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header section */}
      <div className="border-b border-black pb-6 sm:pb-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
              MAJU STORE® / CATALOGUE
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase font-sans-tight mt-1">
              SHOP ALL
            </h1>
            <p className="text-xs sm:text-sm text-[#6f6f6f] mt-2 max-w-lg font-normal leading-relaxed">
              Vol. 01 — 27 foundational garments engineered for quiet distinction. Monochromatic studio cuts and tactile fabrics.
            </p>
          </div>

          <div className="text-xs font-mono text-[#6f6f6f] uppercase">
            Showing {filteredAndSorted.length} of 27 Pieces
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-dashed border-black/20">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-[10px] sm:text-[11px] uppercase tracking-wider px-3 sm:px-3.5 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.value
                    ? 'bg-black text-white font-medium shadow-xs'
                    : 'bg-white border border-dashed border-black/30 text-black hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs pt-1 sm:pt-0">
            <span className="text-[#6f6f6f] uppercase text-[10px] tracking-wider font-mono">Sort By:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-white border border-dashed border-black/40 rounded-full px-3 py-1 text-xs text-black uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer font-mono"
            >
              <option value="featured">Featured (Vol. 01)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {filteredAndSorted.map(product => (
          <div
            key={product.id}
            className="group flex flex-col justify-between bg-white rounded-xl sm:rounded-2xl border border-dashed border-black/20 hover:border-black transition-all p-3 sm:p-4 shadow-xs hover:shadow-lg"
          >
            {/* Image Box */}
            <div
              onClick={() => onOpenProductDetail(product)}
              className="relative aspect-square w-full rounded-lg bg-neutral-100 overflow-hidden cursor-pointer"
            >
              <div
                style={getProductImageStyle(product.lookNumber, product.itemNumber)}
                className="w-full h-full transition-transform duration-500 group-hover:scale-108"
              />

              {/* Look Tag */}
              <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                Look {String(product.lookNumber).padStart(2, '0')}
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-3 sm:mt-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-baseline justify-between gap-1 text-[10px] font-mono text-[#6f6f6f] uppercase tracking-wider">
                  <span>{product.category}</span>
                  <span className="text-black font-semibold tabular-nums text-xs font-mono">
                    {formatMoney(product.price)}
                  </span>
                </div>

                <h3
                  onClick={() => onOpenProductDetail(product)}
                  className="text-xs sm:text-sm font-semibold tracking-tight uppercase hover:underline cursor-pointer mt-1 truncate"
                >
                  {product.name}
                </h3>

                <p className="text-[10px] sm:text-[11px] text-[#6f6f6f] line-clamp-1 mt-0.5">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-dashed border-black/15 flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setQuickAddProduct(product);
                    setSelectedQuickSize(product.sizes[0] || '');
                    setQuickAddError(false);
                  }}
                  className="flex-1 btn-secondary !py-1.5 sm:!py-2 !text-[9px] sm:!text-[10px] text-center"
                >
                  Quick Add
                </button>
                <button
                  onClick={() => onOpenProductDetail(product)}
                  className="btn-primary !py-1.5 sm:!py-2 !px-2.5 sm:!px-3 !text-[9px] sm:!text-[10px]"
                  title="View Detail"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Modal */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-90 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-black shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-start pb-3 border-b border-black">
              <div>
                <div className="text-[10px] font-mono text-[#6f6f6f] uppercase">
                  QUICK ADD · LOOK {String(quickAddProduct.lookNumber).padStart(2, '0')}
                </div>
                <h3 className="text-base font-bold uppercase">{quickAddProduct.name}</h3>
                <span className="text-sm font-mono tabular-nums font-semibold mt-1">
                  {formatMoney(quickAddProduct.price)}
                </span>
              </div>
              <button
                onClick={() => setQuickAddProduct(null)}
                className="w-7 h-7 rounded-full border border-dashed border-black/40 flex items-center justify-center text-xs hover:bg-black hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Thumbnail */}
            <div className="my-4 flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
              <div
                style={getProductImageStyle(quickAddProduct.lookNumber, quickAddProduct.itemNumber)}
                className="w-14 h-14 rounded-md bg-neutral-200 border border-black/10 shrink-0"
              />
              <p className="text-xs text-[#6f6f6f]">{quickAddProduct.description}</p>
            </div>

            {/* Size Selector */}
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider text-[#6f6f6f] mb-2 font-medium">
                Select Size:
              </div>
              <div className="flex flex-wrap gap-2">
                {quickAddProduct.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedQuickSize(size);
                      setQuickAddError(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                      selectedQuickSize === size
                        ? 'bg-black text-white font-medium shadow-xs'
                        : 'bg-neutral-100 text-black hover:bg-neutral-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {quickAddError && (
                <div className="text-xs text-red-600 mt-2">Please choose a size</div>
              )}
            </div>

            {/* Confirm CTA */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleExecuteQuickAdd(quickAddProduct)}
                className="w-full btn-primary !py-3 text-xs tracking-wider"
              >
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
