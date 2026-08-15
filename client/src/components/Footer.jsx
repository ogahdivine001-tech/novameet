import { Link } from 'react-router-dom';
import { HiVideoCamera } from 'react-icons/hi';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-nova-500 to-nova-800 flex items-center justify-center">
                <HiVideoCamera className="text-white text-sm" />
              </span>
              <span className="text-base font-extrabold text-[rgb(var(--color-text-primary))]">
                NovaMeet
              </span>
            </Link>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-xs">
              Secure, reliable video meetings for teams, students, businesses, and
              communities everywhere.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Twitter" className="text-[rgb(var(--color-text-secondary))] hover:text-nova-600 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-[rgb(var(--color-text-secondary))] hover:text-nova-600 transition-colors">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="GitHub" className="text-[rgb(var(--color-text-secondary))] hover:text-nova-600 transition-colors">
                <FaGithub />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
              <li><a href="/#features" className="hover:text-nova-600">Features</a></li>
              <li><a href="/#pricing" className="hover:text-nova-600">Pricing</a></li>
              <li><a href="/#security" className="hover:text-nova-600">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
              <li><a href="/#faq" className="hover:text-nova-600">About</a></li>
              <li><a href="/#faq" className="hover:text-nova-600">FAQ</a></li>
              <li><a href="#" className="hover:text-nova-600">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--color-text-secondary))]">
              <li><a href="#" className="hover:text-nova-600">Privacy</a></li>
              <li><a href="#" className="hover:text-nova-600">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-secondary))] flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} NovaMeet. All rights reserved.</span>
          <span>Built for teams who value clarity and connection.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
