import ImageGeneratorForm from "@/components/ImageGeneratorForm";

export default function CreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:16px_16px]" />

        {/* Main Header Space */}
        <div className="h-16" /> {/* This creates space for the fixed main header */}

        {/* Main Content */}
        <div className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  AI Marketer
                </h1>
                <p className="text-sm text-gray-500">
                  Powered by <a href="https://studio.nebius.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Nebius AI Studio</a>
                </p>
              </div>
              <ImageGeneratorForm />
            </div>
          </div>
        </div>
      </div>
    )
}
