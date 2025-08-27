import React, { useEffect, useState, useCallback } from 'react';

const HeroArea = () => {
  const [dealImages, setDealImages] = useState<string[]>([]);
  const [greetingImage, setGreetingImage] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % dealImages.length);
  }, [dealImages.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + dealImages.length) % dealImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    fetch('/api/user/getUserDetails')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setGreetingImage(data.greetingOfTheDay || 'ad-1.png');

        if (Array.isArray(data.dealOfTheDayImages)) {
          setDealImages(data.dealOfTheDayImages);
        } else {
          setDealImages(['ad-1.png', 'ad-2.png']);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching images:', err);
        setGreetingImage('ad-1.png');
        setDealImages(['ad-1.png', 'ad-2.png']);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dealImages.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [dealImages.length, nextSlide]);

  if (loading) {
    return (
      <section className="mt-4 md:mt-0">
        <div className="flex justify-center items-center h-48">
          <div className="text-center">Loading deals...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-4 md:mt-0 relative">
      {/* Greeting Image */}
      {greetingImage && (
        <div className="mb-0 sm:mb-6">
          <img
            src={greetingImage}
            alt="Greeting of the Day"
            className="w-full h-auto object-cover rounded-none sm:rounded-xl sm:h-[250px]"
          />
        </div>
      )}

      {/* Deals Slider */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {dealImages.map((imageUrl, index) => (
            <div key={index} className="w-full flex-shrink-0">
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
        {dealImages.length > 1 && (
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
        {dealImages.length > 1 && (
          <div className="flex justify-center mt-3 sm:mt-5">
            {dealImages.map((_, index) => (
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
    </section>
  );
};

export default HeroArea;
