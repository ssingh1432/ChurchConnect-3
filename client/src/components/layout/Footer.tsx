import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Church */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bishram Ekata Mandali</h3>
            <p className="text-slate-300 mb-4">
              A place to find faith, family, and community. We are committed to
              serving God and our neighbors.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-slate-300 hover:text-purple-400 transition-colors"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/visit"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/ministries"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Ministries
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/sermons"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Sermons
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="text-xl font-bold mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/volunteer"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/prayer-request"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Give
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/ministries"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Small Groups
                </Link>
              </li>
              <li>
                <Link
                  href="/ministries"
                  className="text-slate-300 hover:text-purple-400 transition-colors"
                >
                  Mission Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-purple-400"></i>
                <span className="text-slate-300">
                  123 Church Street
                  <br />
                  Cityville, State 12345
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-purple-400"></i>
                <span className="text-slate-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-purple-400"></i>
                <span className="text-slate-300">info@gracechurch.org</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-purple-400"></i>
                <span className="text-slate-300">Mon-Fri: 9 AM - 5 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Grace Community Church. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-purple-400 transition-colors"
            >
              Site Map
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
