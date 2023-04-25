import { FaDiscord, FaTwitter, FaTelegramPlane, FaGithub } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

function Footer() {
  return (
    <footer className="mt-auto bg-transparent p-4 shadow md:flex md:items-center md:justify-between md:p-6">
      <ul className="mt-3 flex flex-wrap items-center justify-center text-sm text-gray-200 dark:text-gray-300 sm:mt-0">
        <li>
          <a href="mailto:info@quantifi.finance" className="ml-4 hover:underline md:mr-6 ">
            Contact
          </a>
        </li>
        <li>
          <a
            href="https://docs.google.com/document/d/e/2PACX-1vTx6CS93yu6it2CiAQ0dbNQ4mlYYeHUJz6fziuUXDbdAf8PKMytUODkcJwQfjgObt521aBmbtyhmda0/pub"
            className="ml-4 hover:underline md:mr-6"
          >
            Whitepaper
          </a>
        </li>
        <li>
          <a href="https://quantifi.gitbook.io/docs" className="ml-4 hover:underline md:mr-6">
            Documentation
          </a>
        </li>
      </ul>
      <div className="mt-4 flex justify-center space-x-6 md:mt-0">
        <a
          href="https://twitter.com/quantifi_1"
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FaTwitter />
          <span className="sr-only">Twitter page</span>
        </a>
        <a
          href="https://telegram.org/"
          className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FaTelegramPlane />
          <span className="sr-only">Telegram page</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
