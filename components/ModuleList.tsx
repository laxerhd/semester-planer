import React, { useMemo } from 'react';
import type { Module } from '../types';
import { ALL_SUBJECT_AREAS } from '../constants';

interface ModuleListProps {
    modules: Module[];
    onDeleteModule: (id: string) => void;
    onEditModule: (module: Module) => void;
    semesters: string[];
}

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const ModuleTable: React.FC<{ modules: Module[], onDeleteModule: (id: string) => void, onEditModule: (module: Module) => void }> = ({ modules, onDeleteModule, onEditModule }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modulname
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fachgebiet / Kategorie
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ECTS
                        </th>
                         <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Aktionen</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map(module => {
                        const areaInfo = ALL_SUBJECT_AREAS.find(a => a.name === module.area);
                        const displayCategory = module.customCategory || areaInfo?.category;

                        return (
                            <tr key={module.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 flex items-center">
                                        {module.name}
                                        {module.isTheoretical && (
                                            <span className="ml-2 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full px-2 py-0.5">
                                                THEO
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{module.area}</div>
                                    <div className="text-xs text-gray-400">
                                        {displayCategory}
                                        {module.customCategory && (
                                            <span className="ml-1 text-tum-blue">(individuell)</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-tum-blue-light bg-opacity-20 text-tum-blue-dark">
                                        {module.credits}
                                    </span>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button 
                                            onClick={() => onEditModule(module)} 
                                            className="text-tum-blue hover:text-tum-blue-dark transition-colors p-2 rounded-full hover:bg-blue-100"
                                            aria-label={`Bearbeite Modul ${module.name}`}
                                        >
                                            <EditIcon/>
                                        </button>
                                        <button 
                                            onClick={() => onDeleteModule(module.id)} 
                                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-100"
                                            aria-label={`Lösche Modul ${module.name}`}
                                        >
                                            <TrashIcon/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);


const ModuleList: React.FC<ModuleListProps> = ({ modules, onDeleteModule, onEditModule, semesters }) => {
    
    const modulesBySemester = useMemo(() => {
        return modules.reduce((acc, module) => {
            const { semester } = module;
            if (!acc[semester]) {
                acc[semester] = [];
            }
            acc[semester].push(module);
            return acc;
        }, {} as Record<string, Module[]>);
    }, [modules]);
    
    const sortedSemesters = useMemo(() => {
        return semesters.filter(s => modulesBySemester[s]?.length > 0);
    }, [semesters, modulesBySemester]);
    
    if (modules.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Noch keine Module hinzugefügt</h3>
                <p className="mt-1 text-sm text-gray-500">Benutze das Formular oben, um dein erstes Modul zu erfassen.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-tum-blue-dark mb-4">Meine Module</h2>
            {sortedSemesters.map(semester => {
                const semesterModules = modulesBySemester[semester];
                const semesterTotalCredits = semesterModules.reduce((sum, m) => sum + m.credits, 0);
                
                return (
                    <div key={semester}>
                        <div className="flex justify-between items-baseline mb-3">
                            <h3 className="text-xl font-semibold text-gray-700">{semester}</h3>
                            <span className="text-sm font-medium text-gray-600">
                                Gesamt: <span className="text-tum-blue-dark font-bold text-base">{semesterTotalCredits} ECTS</span>
                            </span>
                        </div>
                        <ModuleTable modules={semesterModules} onDeleteModule={onDeleteModule} onEditModule={onEditModule} />
                    </div>
                );
            })}
        </div>
    );
};

export default ModuleList;