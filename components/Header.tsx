
import React from 'react';

const TUMLogo: React.FC = () => (
    <svg width="60" height="30" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0 H20 V50 H0 Z" fill="#3070B3"/>
        <path d="M22 0 H42 V50 H22 Z" fill="#3070B3"/>
        <path d="M44 0 H64 V50 H44 Z" fill="#3070B3"/>
        <path d="M72 0 H80 V35 H72 Z" fill="#3070B3"/>
        <path d="M82 0 H90 V35 H82 Z" fill="#3070B3"/>
        <path d="M72 37 H90 V50 H72 Z" fill="#3070B3"/>
    </svg>
);

interface HeaderProps {
    onExport?: () => void;
    onImport?: (file: File) => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onImport }) => {
    const handleImportClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file && onImport) {
                onImport(file);
            }
        };
        input.click();
    };
    return (
        <header className="bg-tum-blue shadow-md">
            <div className="container mx-auto px-4 py-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <TUMLogo />
                    <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                        Master Credit Tracker
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="bg-white text-tum-blue px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                            title="Daten als JSON exportieren"
                        >
                            Exportieren
                        </button>
                    )}
                    {onImport && (
                        <button
                            onClick={handleImportClick}
                            className="bg-white text-tum-blue px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                            title="Daten aus JSON importieren"
                        >
                            Importieren
                        </button>
                    )}
                    <div className="text-white text-sm hidden md:block">
                        Für Master Informatik @ TUM
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
