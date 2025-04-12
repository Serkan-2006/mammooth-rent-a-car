import { FaTwitter, FaFacebookF, FaInstagram, FaRegHeart } from "react-icons/fa";
import { IoMdPin, IoMdCall, IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="bg-[rgb(41,59,73)] text-gray-400 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Mammoth Auto</h2>
            <p className="text-sm">Mammoth Auto продава разнообразие от висококачествени автомобили, предоставяйки на клиентите надеждни и стилни опции за превозни средства.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-blue-500"><FaTwitter /></a>
              <a href="#" className="text-white hover:text-blue-700"><FaFacebookF /></a>
              <a href="#" className="text-white hover:text-pink-500"><FaInstagram /></a>
            </div>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Страници</h2>
            <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition-colors">Начало</a></li>
            <li><a href="/cars" className="hover:text-white transition-colors">Обяви</a></li>
            <li><a href="/sell" className="hover:text-white transition-colors">Продай автомобил</a></li>
            <li><a href="/contacts" className="hover:text-white transition-colors">Контакти</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold mb-4">Имате някакви въпроси?</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2"><IoMdPin /><span>Източна промишлена зона, ул. „Потсдам“ 3, 7005 Русе</span></li>
              <li className="flex items-center space-x-2"><IoMdCall /><a href="tel:+359878931239">+359 87 893 1239</a></li>
              <li className="flex items-center space-x-2"><IoMdMail /><a href="mailto:info@mammoth-auto.com">info@mammoth-auto.com</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            &copy; {new Date().getFullYear()} Всички права са запазени
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;