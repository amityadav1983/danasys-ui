import React from 'react';
import { Link } from 'react-router-dom';
import { convertTextToURLSlug } from '../../utils/helper';
import './BrandCarousel.css';

interface BrandCarouselProps {
  brands: string[];
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands }) => {
  // Create a duplicated array for infinite scroll effect
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex items-center">
        <div className="flex animate-scroll whitespace-nowrap">
          {duplicatedBrands.map((brand, index) => (
            <Link
              key={`${brand}-${index}`}
              to={`brand/${convertTextToURLSlug(brand)}`}
              className="flex-shrink-0 mx-4"
            >
             <div
  className="w-[160px] h-[170px] border-2 border-blue-700 rounded-md flex items-center justify-center p-4 bg-white mx-2 text-lg font-semibold"
  style={{
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
  }}
>
                <img
                  src={`/brands/${convertTextToURLSlug(brand)}.webp`}
                  alt={brand}
                  className="max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to text if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('span');
                    fallback.className = 'text-sm _text-default hover:text-primary transition-colors';
                    fallback.textContent = brand;
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
