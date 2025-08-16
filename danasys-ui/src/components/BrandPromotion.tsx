import { IoCheckmarkCircle } from 'react-icons/io5';
import Feat1 from '../assets/images/promo-feat-1.jpg';
import Feat2 from '../assets/images/promo-feat-2.avif';
import Feat3 from '../assets/images/promo-feat-3.png';
import Feat4 from '../assets/images/promo-feat-4.png';
import AppStoreLogo from '../assets/images/app-store.webp';
import PlayStoreLogo from '../assets/images/play-store.webp';

type Feature = {
  imgSrc: string;
  title: string;
  description: string;
  bannerText: string;
};

export const allFeatures: Feature[] = [
  {
    imgSrc: Feat1,
    title: 'CHEAPER PRICES',
    description: 'THAN YOUR LOCAL SUPERMARKET',
    bannerText: 'Best Prices And Offer',
  },
  {
    imgSrc: Feat2,
    title: 'GET YOUR ORDER DELIVERED TO YOUR DOORSTEP',
    description: '',
    bannerText: 'Super Fast Delivery',
  },
  {
    imgSrc: Feat3,
    title: 'EASY RETURNS',
    description: 'on eligible items',
    bannerText: 'Best Prices And Offer',
  },
  {
    imgSrc: Feat4,
    title: '"The best product ever!"',
    description: 'Choose your best product among +000 products\n- Personal Care\n- House Hold\n- Food',
    bannerText: 'Best Pick',
  },
];

const PromoFeature = (props: Feature) => {
  return (
    <div className="flex flex-col rounded-lg shadow-md bg-white w-full h-90">
      {/* Image full cover with overlay text */}
      <div className="relative w-full h-80"> {/* Height increased */}
        <img
          src={props.imgSrc}
          alt={props.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] text-center px-2">
          <h3 className="font-extrabold text-lg text-gray-900 leading-tight drop-shadow-md">
            {props.title}
          </h3>
          {props.description && (
            <p className="text-sm text-gray-800 mt-1 whitespace-pre-line drop-shadow-md">
              {props.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom green banner */}
      <div className="mt-auto bg-green-600 text-white text-sm font-semibold py-3 px-3 text-center">
        {props.bannerText}
      </div>
    </div>
  );
};

const BrandPromotion = () => {
  return (
    <section className="py-6 mt-8">
      <div className="_container">
        <div className="flex flex-col gap-8 lg:border-t _border-muted lg:pt-20">
          {/* App Promotion Section */}
          <div className="_bg-shade-1 py-10 px-4 rounded-2xl">
            <div className="lg:flex items-center justify-around h-full">
              <div className="hidden lg:flex flex-col justify-start w-[480px] relative">
                <div className="absolute">
                  <img
                    src="/phone.webp"
                    alt=""
                    className="max-h-[500px] -mt-20 -ml-4"
                  />
                </div>
                <div className="translate-y-32 -translate-x-16">
                  <div className="_swinging">
                    <img src="/bike.png" alt="" className="h-[360px]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-extrabold tracking-wide mb-6">
                  Get the Danasys App
                </h2>
                <div className="text-lg space-y-2">
                  <div className="flex items-center">
                    <IoCheckmarkCircle
                      size={24}
                      className="text-green-600 mr-3"
                    />
                    <span>Miss live order tracking</span>
                  </div>
                  <div className="flex items-center">
                    <IoCheckmarkCircle
                      size={24}
                      className="text-green-600 mr-3"
                    />
                    <span>Miss latest feature updates</span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center _bg-shade-2 p-3 mt-6 gap-3 rounded-xl">
                  <div>
                    <img src="/qrcode.png" alt="" width={105} height={105} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-extrabold text-lg max-w-[300px] _text-default">
                      Simple way to download the Danasys App
                    </p>
                    <span className="text-sm _text-default">
                      Scan QR code and download now
                    </span>
                  </div>
                </div>
                <div className="block lg:hidden mt-6">
                  <h4 className="font-semibold text-md leading-none mb-4">
                    Download the Danasys App Now
                  </h4>
                  <div className="flex flex-col xs:flex-row gap-2">
                    <div className="xs:flex-1 h-12 rounded cursor-pointer overflow-hidden bg-[#213b50]">
                      <img
                        src={AppStoreLogo}
                        alt="App store"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="xs:flex-1 h-12 rounded cursor-pointer overflow-hidden bg-[#213b50]">
                      <img
                        src={PlayStoreLogo}
                        alt="Play store"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Card Section */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {allFeatures.map((feat, i) => (
              <PromoFeature key={i} {...feat} />
            ))}
          </div>

          <div className="border-b _border-light pt-2 pb-10">
            <p className="text-sm _text-default">
              "Danasys" is owned & managed by "Bring Commerce Private Limited"
              (formerly known as Loafers Inc Private Limited) and is not related,
              linked or interconnected in whatsoever manner or nature, to
              "LOAFER.COM" which is a real estate services business operated by
              "Blackstone Consultancy Services Fake Limited".
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromotion;
