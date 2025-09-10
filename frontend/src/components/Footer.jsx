import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0b0d0f] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="font-semibold text-lg text-white">MoveOn</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A complete travel solution designed to keep you informed, connected,
            and safe with smart technology at every step.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Benefits
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Why Us?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Other Pages</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Disclosures
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Latest News
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Download app</h3>
          <div className="flex flex-col gap-3 ">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-[5vh] w-auto"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-[5vh] w-auto"
            />
          </div>
        </div>
      </div>

      <div className="">Copyright ©2025</div>
    </footer>
  );
}
