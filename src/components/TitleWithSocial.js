import Link from "next/link";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function TitleWithSocial() {
  return (
    <div className="mb-8">
      {/* Social Icons */}
      <div className="flex justify-center space-x-6">
        {/* Instagram Link */}
        <Link href="https://instagram.com/yourprofile" passHref>
          <div
            className="text-gray-500 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <FaInstagram size={28} />
          </div>
        </Link>

        {/* Facebook Link */}
        <Link href="https://facebook.com/yourprofile" passHref>
          <div
            className="text-gray-500 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="Facebook"
          >
            <FaFacebookF size={28} />
          </div>
        </Link>

        {/* Twitter Link */}
        <Link href="https://twitter.com/yourprofile" passHref>
          <div
            className="text-gray-500 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110"
            aria-label="Twitter"
          >
            <FaTwitter size={28} />
          </div>
        </Link>
      </div>
      {/* Title Section */}
      <div className="flex justify-center bg-gray-100 p-3 rounded-md block mt-5">
        <h1 className="text-3xl font-semibold text-gray-800 relative inline-block">
          New Season Collection
          <span className="absolute left-0 -bottom-2 w-15 h-1 rounded-full bg-pink-400"></span>
        </h1>
      </div>
    </div>
  );
}
