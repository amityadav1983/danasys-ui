import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface TermsConditionProps {
  onClose: () => void;
}

const TermsCondition: React.FC<TermsConditionProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {/* Animate Popup */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative scrollbar-hide"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#349FDE] to-[#2e90cd] rounded-t-2xl px-6 py-4 text-white flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold">Terms & Conditions</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>
            Welcome to <span className="font-semibold">Cost2Cost.in</span>. By
            accessing or using our website, mobile application, or services, you
            agree to comply with and be bound by the following Terms and
            Conditions. Please read them carefully before proceeding.
          </p>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">1. General</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Cost2Cost.in (“we,” “us,” “our,” or “the Company”) is an online
                platform that connects users with local vendors and service
                providers.
              </li>
              <li>
                By using our platform, you acknowledge that you have read,
                understood, and agreed to these Terms.
              </li>
              <li>
                We reserve the right to update or replace these Terms at any
                time without prior notice.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              2. Role of the Company
            </h3>
            <p>
              We act only as a facilitator/marketplace and are not the seller,
              manufacturer, or service provider. All transactions are solely
              between the user and the vendor.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              3. Limitation of Liability
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>We are not liable for fraud, misrepresentation, or vendor issues.</li>
              <li>
                No responsibility for delays, defects, or losses caused by vendors.
              </li>
              <li>
                We are not accountable for indirect or consequential damages.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              4. User Responsibilities
            </h3>
            <p>
              Users must provide accurate information, maintain account
              confidentiality, and avoid fraudulent or unlawful activity.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              5. Intellectual Property
            </h3>
            <p>
              All content, logos, and trademarks belong to the Company. Any
              unauthorized use is strictly prohibited.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              6. Third-Party Links & Services
            </h3>
            <p>
              We may provide third-party links but are not responsible for their
              content or practices. Dealings with them are at your own risk.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">
              7. Governing Law & Jurisdiction
            </h3>
            <p>
              These Terms are governed by the laws of India. Disputes shall be
              subject to the jurisdiction of your city/state courts.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2 text-[#349FDE]">8. Acknowledgment</h3>
            <p>
              By using Cost2Cost.in, you confirm that you understand and accept
              these Terms & Conditions.
            </p>
          </section>

          <p className="text-center font-medium text-gray-600">
            👉 All rights reserved by <span className="text-[#349FDE]">Cost2Cost.in</span>
          </p>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex justify-center bg-gray-50 rounded-b-2xl">
          <Button
            onClick={onClose}
            className="bg-[#349FDE] hover:bg-[#2e90cd] text-white rounded-xl px-6 py-2"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsCondition;
