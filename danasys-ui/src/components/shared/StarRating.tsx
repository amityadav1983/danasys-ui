import React from 'react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showValue = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const renderStar = (index: number) => {
    const filled = rating >= index + 1;
    const halfFilled = rating >= index + 0.5 && rating < index + 1;

    return (
      <div key={index} className="relative inline-block">
        {/* Empty star background */}
        <svg
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        {/* Filled star overlay */}
        {filled && (
          <svg
            className={`absolute inset-0 ${sizeClasses[size]} text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}

        {/* Half star overlay */}
        {halfFilled && (
          <svg
            className={`absolute inset-0 ${sizeClasses[size]} text-yellow-400 overflow-hidden`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-star-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-${index})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-0.5">
      <div className="flex items-center">
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className={`${textSizeClasses[size]} text-gray-600 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
