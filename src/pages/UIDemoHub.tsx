import React, { useState } from 'react';
import { ShadcnDemo } from '../components/ShadcnDemo';
import { MantineDemo } from '../components/MantineDemo';
import { ChakraDemo } from '../components/ChakraDemo';

type UILibrary = 'shadcn' | 'mantine' | 'chakra';

export const UIDemoHub: React.FC = () => {
  const [selectedLibrary, setSelectedLibrary] = useState<UILibrary>('shadcn');

  const libraries = [
    { id: 'shadcn', name: 'Shadcn/ui', description: 'Beautiful and accessible components built with Radix UI and Tailwind CSS' },
    { id: 'mantine', name: 'Mantine', description: 'React components library with 120+ components and dark theme support' },
    { id: 'chakra', name: 'Chakra UI', description: 'Simple, modular and accessible component library for React' },
  ];

  const renderDemo = () => {
    switch (selectedLibrary) {
      case 'shadcn':
        return <ShadcnDemo />;
      case 'mantine':
        return <MantineDemo />;
      case 'chakra':
        return <ChakraDemo />;
      default:
        return <ShadcnDemo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UI Libraries Demo Hub</h1>
              <p className="mt-2 text-gray-600">
                Explore different UI component libraries integrated into this project
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href="https://github.com/shadcn-ui/ui"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {libraries.map((library) => (
              <button
                key={library.id}
                onClick={() => setSelectedLibrary(library.id as UILibrary)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedLibrary === library.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {library.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Library Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {libraries.find(lib => lib.id === selectedLibrary) && (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {libraries.find(lib => lib.id === selectedLibrary)?.name}
              </h2>
              <p className="mt-1 text-gray-600">
                {libraries.find(lib => lib.id === selectedLibrary)?.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDemo()}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>This project demonstrates integration of multiple UI libraries</p>
            <p className="mt-2 text-sm">
              Each library is implemented in its own branch for easy comparison and testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 