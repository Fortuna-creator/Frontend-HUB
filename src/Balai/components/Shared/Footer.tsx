const Footer = () => {
    return (
        <footer className="bg-[#244860] text-white py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center gap-3 text-sm text-gray-300">

                {/* Links */}
                <div className="flex items-center space-x-6">
                    <a href="#" className="hover:text-white underline transition-colors">Kebijakan Privasi</a>
                    <a href="#" className="hover:text-white underline transition-colors">Syarat Layanan</a>
                    <a href="#" className="hover:text-white underline transition-colors">Pengaturan Cookies</a>
                    <a href="#" className="hover:text-white underline transition-colors">Hubungi Layanan</a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
