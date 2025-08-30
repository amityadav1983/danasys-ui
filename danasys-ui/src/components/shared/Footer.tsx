import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from 'react-icons/fa';
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
        {/* ✅ Brands Section Removed */}

        <div>
          <h4 className="font-bold my-6 text-lg">Payment partners</h4>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-12">
            {PaymentPartners.map((partner, i) => (
              <div key={i}>
                <div
                  className="w-[90px] h-[70px] border-2 border-blue-700 rounded-md flex items-center justify-center p-4 bg-white mx-2 text-lg font-semibold"
                  style={{ boxShadow: '0 15px 30px rgba(0, 0, 0, 0.5)' }}
                >
                  {partner.logoName ? (
                    <img
                      src={`/${partner.logoName}.webp`}
                      alt={partner.alt}
                      className="h-18 w-18 hover:scale-150 object-cover"
                    />
                  ) : (
                    <span className="text-xs _text-default text-center leading-tight">
                      {partner.alt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#fcfcfc] py-6 mt-2 min-h-[60px]">
        <div className="_container">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            <div className="text-xs flex-1 _text-muted lg:max-w-md pr-6">
              &copy; Cost2Cost Private Limited (formerly known as Loafers
              Inc Private Limited), 2016-2022
            </div>

            {/* <div className="flex flex-1 md:flex-row items-center gap-2">
              <h4 className="font-bold text-md leading-none lg:mr-4 _text-default">
                Download App
              </h4>
              <div className="h-8 w-24 rounded-[3px] cursor-pointer overflow-hidden">
                <img
                  src={AppStoreLogo}
                  alt="App store"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-8 w-24 rounded-[3px] cursor-pointer overflow-hidden">
                <img
                  src={PlayStoreLogo}
                  alt="Play store"
                  className="h-full w-full object-cover"
                />
              </div>
            </div> */}

            <div className="flex-1 flex items-center md:justify-end gap-4 lg:gap-6">
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaFacebookF />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaTwitter />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaInstagram />
              </div>
              <div className="cursor-pointer w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;