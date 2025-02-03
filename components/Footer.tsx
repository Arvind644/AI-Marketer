export default function Footer() {
    return (
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} <a href="https://buildclub.ai" className="hover:underline text-blue-500">Build Club</a>. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Powered by <a href="https://studio.nebius.ai" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-400">Nebius AI Studio</a>
            </p>
          </div>
        </div>
      </footer>
    );
  }
