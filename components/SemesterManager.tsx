import React, { useState } from 'react';

interface SemesterManagerProps {
    semesters: string[];
    onAddSemester: (semester: string) => void;
    onDeleteSemester: (semester: string) => void;
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


const SemesterManager: React.FC<SemesterManagerProps> = ({ semesters, onAddSemester, onDeleteSemester }) => {
    const [newSemester, setNewSemester] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSemester.trim()) {
            onAddSemester(newSemester);
            setNewSemester('');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
            <form onSubmit={handleAdd} className="flex items-end gap-2">
                <div className="flex-grow">
                    <label htmlFor="semester-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Neues Semester
                    </label>
                    <input
                        type="text"
                        id="semester-name"
                        value={newSemester}
                        onChange={(e) => setNewSemester(e.target.value)}
                        placeholder="z.B. WS 24/25"
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tum-blue focus:border-tum-blue"
                    />
                </div>
                <button
                    type="submit"
                    className="flex-shrink-0 inline-flex justify-center py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-accent-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-green transition-colors h-[42px]"
                >
                    Hinzufügen
                </button>
            </form>

            {semesters.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Vorhandene Semester:</h4>
                    <div className="flex flex-wrap gap-2">
                        {semesters.map(semester => (
                            <div key={semester} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-800">
                                <span>{semester}</span>
                                <button
                                    onClick={() => onDeleteSemester(semester)}
                                    className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                    aria-label={`Lösche Semester ${semester}`}
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SemesterManager;