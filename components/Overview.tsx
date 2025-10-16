import React, { useMemo } from 'react';
import type { Module } from '../types';
import { AreaCategory } from '../types';
import { ALL_SUBJECT_AREAS, CATEGORY_GOALS } from '../constants';

interface OverviewProps {
    modules: Module[];
    specialization: string | null;
    semesters: string[];
}

type GroupedModules = Partial<Record<AreaCategory, Record<string, Module[]>>>;
type ModulesBySemester = Record<string, GroupedModules>;

const Overview: React.FC<OverviewProps> = ({ modules, specialization, semesters }) => {

    const modulesBySemester = useMemo(() => {
        return modules.reduce((semAcc, module) => {
            const { semester } = module;
            
            // Initialize semester group if it doesn't exist
            if (!semAcc[semester]) {
                semAcc[semester] = {};
            }

            // Verwende customCategory wenn vorhanden (für "Anderes"), sonst normale Kategorie
            const areaInfo = ALL_SUBJECT_AREAS.find(a => a.name === module.area);
            const category = module.customCategory || areaInfo?.category;
            
            if (!category) return semAcc;

            // Verwende customInformaticsArea wenn vorhanden, sonst den normalen area Namen
            const areaName = module.customInformaticsArea || module.area;

            // Initialize category group if it doesn't exist
            if (!semAcc[semester][category]) {
                semAcc[semester][category] = {};
            }
            // Initialize area group if it doesn't exist
            if (!semAcc[semester][category][areaName]) {
                semAcc[semester][category][areaName] = [];
            }
            
            semAcc[semester][category][areaName].push(module);

            return semAcc;
        }, {} as ModulesBySemester);
    }, [modules]);
    
    const categoryOrder: AreaCategory[] = [
        AreaCategory.INFORMATICS,
        AreaCategory.PROFILE_BUILDING,
        AreaCategory.SEMINAR,
        AreaCategory.PRACTICAL_COURSE,
        AreaCategory.INTERDISCIPLINARY_PROJECT,
        AreaCategory.SOFT_SKILLS,
        AreaCategory.THESIS,
    ];
    
    const sortedSemesters = useMemo(() => {
        return semesters.filter(s => modulesBySemester[s]);
    }, [semesters, modulesBySemester]);

    if (modules.length === 0) {
        return (
             <div className="text-center p-16 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Noch keine Module hinzugefügt</h2>
                <p className="mt-2 text-gray-500">Wechsle zum "Planer", um deine ersten Module zu erfassen.</p>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            {sortedSemesters.map(semester => {
                const groupedModules = modulesBySemester[semester];
                
                // Berechne Gesamtcredits für das Semester
                const semesterTotalCredits = modules
                    .filter(m => m.semester === semester)
                    .reduce((sum, m) => sum + m.credits, 0);
                
                return (
                    <section key={semester} aria-labelledby={`semester-heading-${semester}`}>
                        <div className="flex justify-between items-baseline mb-6 pb-3 border-b-2 border-tum-blue">
                            <h1 id={`semester-heading-${semester}`} className="text-3xl font-bold text-tum-blue-dark">
                                {semester}
                            </h1>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 font-medium">Gesamt</p>
                                <p className="text-2xl font-bold text-tum-blue-dark">{semesterTotalCredits} ECTS</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                           {categoryOrder.map(category => {
                                const areasInCategory = groupedModules[category];
                                if (!areasInCategory) return null;

                                const totalCreditsInCategory = (Object.values(areasInCategory) as Module[][])
                                    .flat()
                                    .reduce((sum: number, module: Module) => sum + module.credits, 0);

                                return (
                                    <div key={category} className="bg-white p-6 rounded-lg shadow-md">
                                        <div className="flex justify-between items-baseline mb-4 pb-3 border-b border-gray-200">
                                            <h2 className="text-xl font-bold text-tum-blue-dark">{category}</h2>
                                            <p className="text-sm font-medium text-gray-500">
                                                <span className="text-tum-blue-dark font-bold text-base">{totalCreditsInCategory}</span> / {CATEGORY_GOALS[category]} ECTS
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(areasInCategory).map(([areaName, areaModules]) => {
                                            const modules = areaModules as Module[];
                                            const isSpecialization = areaName === specialization;
                                            const cardClasses = isSpecialization 
                                                ? 'ring-2 ring-tum-blue rounded-lg p-4 bg-blue-50' 
                                                : 'ring-1 ring-gray-200 rounded-lg p-4 bg-white';
                                            
                                            return (
                                                <div key={areaName} className={cardClasses}>
                                                    <h3 className="font-semibold text-gray-800">
                                                        {areaName}
                                                        {isSpecialization && <span className="ml-2 text-xs font-normal text-tum-blue-dark">(Schwerpunkt)</span>}
                                                    </h3>
                                                    <ul className="mt-2 space-y-1">
                                                        {modules.map(module => (
                                                            <li key={module.id} className="flex justify-between items-center text-sm">
                                                                <span className="text-gray-600 flex items-center">
                                                                    {module.name}
                                                                    {module.isTheoretical && (
                                                                        <span className="ml-2 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full px-2 py-0.5">
                                                                            THEO
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <span className="font-semibold text-gray-800">{module.credits} ECTS</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

export default Overview;