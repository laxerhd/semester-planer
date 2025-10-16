import React, { useState, useEffect, useMemo } from 'react';
import type { Module } from './types';
import { AreaCategory } from './types';
import { ALL_SUBJECT_AREAS, TOTAL_CREDITS_GOAL, CATEGORY_GOALS } from './constants';
import Header from './components/Header';
import ModuleForm from './components/ModuleForm';
import ModuleList from './components/ModuleList';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import SemesterManager from './components/SemesterManager';

type View = 'planner' | 'overview';

const App: React.FC = () => {
    const [modules, setModules] = useState<Module[]>(() => {
        try {
            const savedModules = localStorage.getItem('tum_modules');
            return savedModules ? JSON.parse(savedModules) : [];
        } catch (error) {
            console.error("Could not parse modules from localStorage", error);
            return [];
        }
    });

    const [semesters, setSemesters] = useState<string[]>(() => {
        try {
            const savedSemesters = localStorage.getItem('tum_semesters');
            return savedSemesters ? JSON.parse(savedSemesters) : [];
        } catch (error) {
            console.error("Could not parse semesters from localStorage", error);
            return [];
        }
    });

    const [view, setView] = useState<View>('planner');
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [useOverflowForProfile, setUseOverflowForProfile] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem('tum_useOverflowForProfile');
            return saved ? JSON.parse(saved) : false;
        } catch (error) {
            console.error("Could not parse useOverflowForProfile from localStorage", error);
            return false;
        }
    });

    // Automatisch im localStorage speichern bei Änderungen
    useEffect(() => {
        try {
            localStorage.setItem('tum_modules', JSON.stringify(modules));
        } catch (error) {
            console.error("Could not save modules to localStorage", error);
        }
    }, [modules]);
    
    useEffect(() => {
        try {
            localStorage.setItem('tum_semesters', JSON.stringify(semesters));
        } catch (error) {
            console.error("Could not save semesters to localStorage", error);
        }
    }, [semesters]);
    
    useEffect(() => {
        try {
            localStorage.setItem('tum_useOverflowForProfile', JSON.stringify(useOverflowForProfile));
        } catch (error) {
            console.error("Could not save useOverflowForProfile to localStorage", error);
        }
    }, [useOverflowForProfile]);


    const addModule = (module: Omit<Module, 'id'>) => {
        setModules(prevModules => [...prevModules, { ...module, id: Date.now().toString() }]);
    };

    const updateModule = (updatedModule: Module) => {
        setModules(prevModules => prevModules.map(m => m.id === updatedModule.id ? updatedModule : m));
        setEditingModule(null);
    };

    const deleteModule = (id: string) => {
        setModules(prevModules => prevModules.filter(module => module.id !== id));
    };

    const handleEditModule = (module: Module) => {
        setEditingModule(module);
        // Scroll zum Formular
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingModule(null);
    };

    const addSemester = (semester: string) => {
        const trimmedSemester = semester.trim();
        if (trimmedSemester) {
            setSemesters(prevSemesters => {
                if (prevSemesters.includes(trimmedSemester)) {
                    return prevSemesters;
                }
                return [...prevSemesters, trimmedSemester];
            });
        }
    };

    const deleteSemester = (semesterToDelete: string) => {
        const isConfirmed = window.confirm(`Möchten Sie das Semester "${semesterToDelete}" wirklich löschen? Alle zugehörigen Module werden ebenfalls entfernt.`);
        if (isConfirmed) {
            setModules(prevModules => prevModules.filter(m => m.semester !== semesterToDelete));
            setSemesters(prevSemesters => prevSemesters.filter(s => s !== semesterToDelete));
        }
    };

    const creditSummary = useMemo(() => {
        const summary = modules.reduce((acc, module) => {
            // Verwende customCategory wenn vorhanden (für "Anderes"), sonst die normale Kategorie
            const category = module.customCategory || 
                            ALL_SUBJECT_AREAS.find(area => area.name === module.area)?.category || 
                            AreaCategory.MISC;
            
            acc.byCategory[category] = (acc.byCategory[category] || 0) + module.credits;
            
            if(category === AreaCategory.INFORMATICS) {
                // Verwende customInformaticsArea wenn vorhanden, sonst das normale area
                const informaticsArea = module.customInformaticsArea || module.area;
                acc.byInformaticsArea[informaticsArea] = (acc.byInformaticsArea[informaticsArea] || 0) + module.credits;
            }
            
            if (module.isTheoretical) {
                acc.theoreticalCredits += module.credits;
            }

            return acc;
        }, {
            total: 0,
            byCategory: {} as Record<AreaCategory, number>,
            byInformaticsArea: {} as Record<string, number>,
            theoreticalCredits: 0,
            overflowCredits: 0,
        });
        
        // Calculate overflow credits (Informatik credits > 43)
        const informaticsCredits = summary.byCategory[AreaCategory.INFORMATICS] || 0;
        const overflowCredits = Math.max(0, informaticsCredits - CATEGORY_GOALS[AreaCategory.INFORMATICS]);
        summary.overflowCredits = overflowCredits;
        
        // Calculate total credits: for each category, only count up to the goal (max ECTS)
        // This ensures that excess credits in any category don't inflate the total
        summary.total = Object.entries(summary.byCategory).reduce((total, [cat, credits]) => {
            const category = cat as AreaCategory;
            const categoryGoal = CATEGORY_GOALS[category];
            
            // For each category, only count up to the goal
            // Exception: MISC has no goal (0), so count all credits
            if (categoryGoal === 0) {
                return total + (credits as number);
            }
            
            return total + Math.min(credits as number, categoryGoal);
        }, 0);
        
        return summary;
    }, [modules]);
    
    // Add overflow credits to total if they are used for profile building
    const overflowCreditsForProfile = useOverflowForProfile ? Math.min(creditSummary.overflowCredits, 10) : 0;
    const adjustedTotalCredits = creditSummary.total + overflowCreditsForProfile;

    const autoSpecialization = useMemo(() => {
        const informaticsAreas = creditSummary.byInformaticsArea;
        if (Object.keys(informaticsAreas).length === 0) {
            return null;
        }

        const entries = Object.entries(informaticsAreas) as [string, number][];
        const specializationArea = entries.reduce(
            (max, current) => (current[1] > max[1] ? current : max),
            ['', 0] as [string, number]
        );

        return specializationArea[1] > 0 ? specializationArea[0] : null;
    }, [creditSummary.byInformaticsArea]);
    
    const NavButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => {
        const baseClasses = "py-3 px-6 text-sm font-medium focus:outline-none transition-colors";
        const activeClasses = "border-b-2 border-tum-blue text-tum-blue-dark";
        const inactiveClasses = "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
        return (
            <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
                {children}
            </button>
        )
    }

    const handleExport = () => {
        const data = {
            modules,
            semesters,
            exportDate: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `master-planer-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);
                
                if (data.modules && Array.isArray(data.modules)) {
                    const isConfirmed = window.confirm(
                        'Möchten Sie die aktuellen Daten wirklich mit den importierten Daten ersetzen? Diese Aktion kann nicht rückgängig gemacht werden.'
                    );
                    
                    if (isConfirmed) {
                        setModules(data.modules);
                        if (data.semesters && Array.isArray(data.semesters)) {
                            setSemesters(data.semesters);
                        }
                        alert('Daten erfolgreich importiert!');
                    }
                } else {
                    alert('Ungültige JSON-Datei. Die Datei muss ein "modules"-Array enthalten.');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Fehler beim Importieren der Datei. Bitte stellen Sie sicher, dass es sich um eine gültige JSON-Datei handelt.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header onExport={handleExport} onImport={handleImport} />
            
            <main className="container mx-auto p-4 md:p-8">

                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <NavButton active={view === 'planner'} onClick={() => setView('planner')}>
                            Planer
                        </NavButton>
                        <NavButton active={view === 'overview'} onClick={() => setView('overview')}>
                            Übersicht
                        </NavButton>
                    </nav>
                </div>

                {view === 'planner' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
                            
                            <div>
                                <h2 className="text-2xl font-bold text-tum-blue-dark mb-4">Semester verwalten</h2>
                                <SemesterManager 
                                    semesters={semesters}
                                    onAddSemester={addSemester}
                                    onDeleteSemester={deleteSemester}
                                />
                            </div>

                             <div>
                                <h2 className="text-2xl font-bold text-tum-blue-dark mb-4">
                                    {editingModule ? 'Modul bearbeiten' : 'Module hinzufügen'}
                                </h2>
                                <ModuleForm 
                                    onAddModule={addModule} 
                                    onUpdateModule={updateModule}
                                    editingModule={editingModule}
                                    onCancelEdit={handleCancelEdit}
                                    semesters={semesters} 
                                />
                            </div>

                            <div className="mt-8">
                               <ModuleList 
                                    modules={modules} 
                                    onDeleteModule={deleteModule}
                                    onEditModule={handleEditModule}
                                    semesters={semesters}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-1 order-1 lg:order-2">
                             <h2 className="text-2xl font-bold text-tum-blue-dark mb-4">Fortschrittsübersicht</h2>
                            <Dashboard 
                                totalCredits={adjustedTotalCredits} 
                                totalGoal={TOTAL_CREDITS_GOAL}
                                creditSummary={creditSummary}
                                specialization={autoSpecialization}
                                useOverflowForProfile={useOverflowForProfile}
                                onToggleOverflowForProfile={() => setUseOverflowForProfile(!useOverflowForProfile)}
                            />
                        </div>
                    </div>
                ) : (
                    <Overview modules={modules} specialization={autoSpecialization} semesters={semesters} />
                )}
            </main>
            
            <footer className="container mx-auto px-4 md:px-8 py-6 text-center text-xs text-gray-500">
                <p>
                    Dieses Tool dient nur zur persönlichen Planung. 
                    Es wird keine Garantie auf Korrektheit oder Vollständigkeit der Informationen gegeben. 
                    Bitte überprüfen Sie alle Angaben mit den offiziellen TUM-Dokumenten und Ihrer Studienberatung.
                </p>
            </footer>
        </div>
    );
};

export default App;