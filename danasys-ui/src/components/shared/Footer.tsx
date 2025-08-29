import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import AppStoreLogo from '../../assets/images/app-store.webp';
import PlayStoreLogo from '../../assets/images/play-store.webp';

const PaymentPartners = [
  { logoName: 'mobikwik', alt: 'MobikWik' },
  { logoName: 'paytm', alt: 'PayTm' },
  { logoName: 'visa', alt: 'Visa' },
  { logoName: 'mastercard', alt: 'Mastercard' },
  { logoName: 'maestro', alt: 'Maestro' },
  { logoName: 'rupay', alt: 'RuPay' },
  { logoName: 'amex', alt: 'American Express' },
  { logoName: 'bhim', alt: 'BHIM UPI' },
];

const Footer = () => {
  return (
    <footer>
      <div className="_container space-y-6">
        <div>
          <h4 className="font-bold my-6 text-lg">Payment partners</h4>

          {/* 🔥 Premium Continuous Slider */}
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={5000}
            loop={true}
            freeMode={true}
            slidesPerView={2}
            spaceBetween={24}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 32 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
            }}
          >
            {PaymentPartners.map((partner, i) => (
<SwiperSlide key={i}>
  <div className="relative w-[140px] h-[100px] rounded-xl flex items-center justify-center p-6 bg-white/40 backdrop-blur-md border border-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 mx-auto">
    <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition duration-500" />
    {partner.logoName ? (
      <img
        src={`/${partner.logoName}.webp`}
        alt={partner.alt}
        className="max-h-16 object-contain transition-transform duration-500 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]"
      />
    ) : (
      <span className="text-sm _text-default text-center leading-tight">
        {partner.alt}
      </span>
    )}
  </div>
</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ✅ Footer Bottom */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 py-6 mt-2 min-h-[60px] border-t border-gray-100">
        <div className="_container">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            <div className="text-xs flex-1 text-gray-500 lg:max-w-md pr-6">
              &copy; Danasys (formerly known as Design Inc Private Limited), 2025. All rights reserved.
            </div>

            {/* <div className="flex flex-1 md:flex-row items-center gap-3">
              <h4 className="font-semibold text-md leading-none lg:mr-4 text-gray-800">
                Download App
              </h4>
              <div className="h-9 w-28 rounded-md cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={AppStoreLogo}
                  alt="App store"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-9 w-28 rounded-md cursor-pointer overflow-hidden shadow-md hover:shadow-lg transition">
                <img
                  src={PlayStoreLogo}
                  alt="Play store"
                  className="h-full w-full object-cover"
                />
              </div>
            </div> */}

            {/* ✅ Social Icons */}
            <div className="flex-1 flex items-center md:justify-end gap-4 lg:gap-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-500 shadow-md hover:shadow-lg"
                  >
                    <Icon />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
