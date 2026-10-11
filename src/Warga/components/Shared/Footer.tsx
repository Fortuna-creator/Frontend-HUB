const Footer = () => {
  return (
    <footer className="bg-[#244860] text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      {/* The constraining div with "max-w-7xl mx-auto" has been removed */}

      {/* Main content box */}
      <div className="border border-white/30 rounded-lg p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Logo, Address, Socials */}
          <div className="space-y-4">

            <div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Reservasi Booking Balai
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
        <div className="order-1 md:order-2 flex items-center space-x-6">
          <a href="#" className="hover:text-white underline">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white underline">Syarat Layanan</a>
          <a href="#" className="hover:text-white underline">Pengaturan Cookies</a>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;