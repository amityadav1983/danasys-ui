import React, { useEffect, useState, useCallback } from 'react';

interface HeroAreaProps {
  greetingImage?: string;
  dealImages?: string[];
}

const HeroArea: React.FC<HeroAreaProps> = ({ greetingImage, dealImages }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    const maxSlides = Math.ceil((dealImages?.length || 0) / 2);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  }, [dealImages]);

  const prevSlide = () => {
    const maxSlides = Math.ceil((dealImages?.length || 0) / 2);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const maxSlides = Math.ceil((dealImages?.length || 0) / 2);
    if (maxSlides > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [dealImages, nextSlide]);

  const maxSlides = Math.ceil((dealImages?.length || 0) / 2);

  return (
    <section className="mt-0 relative">
      {/* Greeting Image */}
      {greetingImage && (
        <div className="mb-0">
          <img
            src={greetingImage}
            alt="Greeting of the Day"
            className="w-full h-auto object-cover rounded-none sm:rounded-xl sm:h-[500px] sm:object-contain sm:w-full "
          />
        </div>
      )}

      {/* Deals Section */}
      {dealImages && dealImages.length > 0 && (
        dealImages.length === 1 ? (
          // Single image - centered
          <div className="flex justify-center">
            <img
              src={dealImages[0]}
              alt="Deal of the Day"
              className="w-full max-w-md object-contain h-[350px] rounded-xl"
            />
          </div>
        ) : (
          // Multiple images - slider
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 50}%)` }}
            >
              {dealImages.map((imageUrl, index) => (
                <div key={index} className="w-1/2 flex-shrink-0">
                  {/* Desktop Image */}
                  <img
                    src={imageUrl}
                    alt={`Deal of the Day ${index + 1}`}
                    className="w-full hidden sm:block object-contain h-[350px] rounded-xl"
                  />
                  {/* Mobile Image */}
                  <img
                    src={imageUrl}
                    alt={`Deal of the Day ${index + 1}`}
                    className="w-full sm:hidden h-auto object-cover rounded-none"
                  />
                </div>
              ))}
            </div>

            {/* Navigation Buttons - hidden on mobile */}
            {maxSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-transform hover:scale-110 duration-200"
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-transform hover:scale-110 duration-200"
                  aria-label="Next slide"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {maxSlides > 1 && (
              <div className="flex justify-center mt-3 sm:mt-5">
                {Array.from({ length: maxSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full mx-1 sm:mx-2 transition-all duration-200 ${
                      index === currentSlide ? 'bg-gray-800 scale-100' : 'bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
};

export default HeroArea;
