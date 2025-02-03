import Link from 'next/link';
import Image from 'next/image';
import { FaImage, FaDownload, FaPalette } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Full Height */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />

        {/* Content */}
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-7xl font-bold animate-fade-in">
              <span className="block text-yellow-300">
                AI Marketing
              </span>
              <span className="block text-white mt-2">
                Studio
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
              Create stunning marketing visuals and social media content in seconds.
            </p>
            <div>
              <Link
                href="/create"
                className="inline-block bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-all"
              >
                Start Creating
              </Link>
            </div>
            {/* Nebius AI Studio Attribution */}
            <div className="pt-8 flex flex-col items-center space-y-3">
              <Image
                src="/nebius-ai-studio.png"
                alt="Nebius AI Studio"
                width={180}
                height={60}
              />
              <a
                href="https://studio.nebius.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Powered by Nebius AI Studio
              </a>
            </div>
          </div>
        </div>
      </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: FaImage,
                title: 'Generate',
                description: 'Create unique images instantly'
              },
              {
                icon: FaPalette,
                title: 'Edit',
                description: 'Customize with simple tools'
              },
              {
                icon: FaDownload,
                title: 'Download',
                description: 'Save in multiple formats'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center"
              >
                <feature.icon className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
