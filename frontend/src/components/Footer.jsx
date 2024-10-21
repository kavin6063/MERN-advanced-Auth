const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-3 py-3">
      <div className="max-w-7xl text-xs mx-auto px-2 sm:px-4 lg:px-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} AUTH company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
