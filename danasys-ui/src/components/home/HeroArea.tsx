import React, { useEffect, useState } from 'react';

const HeroArea = () => {
  const [dealImages, setDealImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/getUserDetails')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data.dealOfTheDayImages && Array.isArray(data.dealOfTheDayImages)) {
          // Only show the first image
          setDealImages(data.dealOfTheDayImages.slice(0, 1));
        } else {
          // Fallback to only first local image
          setDealImages(['ad-1.png']);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching deal images:', err);
        // Fallback to only first local image on error
        setDealImages(['ad-1.png']);
        setLoading(false);
      });
  }, []);

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
    <section className="mt-4 md:mt-0">
      {dealImages.map((imageUrl, index) => (
        <div key={index}>
          <img
            src={imageUrl}
            alt="Deal of the Day"
            className="w-full hidden sm:block object-contain h-[350px]"
          />
          <img
            src={imageUrl}
            alt="Deal of the Day"
            className="w-full sm:hidden object-contain h-[300px]"
          />
        </div>
      ))}
    </section>
  );
};

export default HeroArea;
