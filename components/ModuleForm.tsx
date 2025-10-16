import React, { useState, useEffect, useMemo } from 'react';
import type { Module } from '../types';
import { ALL_SUBJECT_AREAS, INFORMATICS_ONLY_AREAS } from '../constants';
import { AreaCategory } from '../types';

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-tum-blue" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

interface ModuleFormProps {
    onAddModule: (module: Omit<Module, 'id'>) => void;
    onUpdateModule?: (module: Module) => void;
    editingModule?: Module | null;
    onCancelEdit?: () => void;
    semesters: string[];
}

const ModuleForm: React.FC<ModuleFormProps> = ({ onAddModule, onUpdateModule, editingModule, onCancelEdit, semesters }) => {
    const [name, setName] = useState('');
    const [credits, setCredits] = useState('');
    const [area, setArea] = useState(ALL_SUBJECT_AREAS[0].name);
    const [semester, setSemester] = useState('');
    const [isTheoretical, setIsTheoretical] = useState(false);
    const [customAreaDescription, setCustomAreaDescription] = useState('');
    const [customCategory, setCustomCategory] = useState<AreaCategory>(AreaCategory.INFORMATICS);
    const [customInformaticsArea, setCustomInformaticsArea] = useState('');

    // Formular mit Werten aus editingModule füllen
    useEffect(() => {
        if (editingModule) {
            setName(editingModule.name);
            setCredits(editingModule.credits.toString());
            setArea(editingModule.area);
            setSemester(editingModule.semester);
            setIsTheoretical(editingModule.isTheoretical || false);
            setCustomCategory(editingModule.customCategory || AreaCategory.INFORMATICS);
            setCustomInformaticsArea(editingModule.customInformaticsArea || '');
        } else {
            // Formular zurücksetzen wenn kein editingModule
            setName('');
            setCredits('');
            setArea(ALL_SUBJECT_AREAS[0].name);
            setSemester(semesters.length > 0 ? semesters[0] : '');
            setIsTheoretical(false);
            setCustomAreaDescription('');
            setCustomCategory(AreaCategory.INFORMATICS);
            setCustomInformaticsArea('');
        }
    }, [editingModule, semesters]);

    useEffect(() => {
        if (semesters.length > 0 && !semesters.includes(semester)) {
            setSemester(semesters[0]);
        } else if (semesters.length === 0) {
            setSemester('');
        }
    }, [semesters, semester]);

    const isCurrentAreaInformatics = useMemo(() => {
        const selectedArea = ALL_SUBJECT_AREAS.find(a => a.name === area);
        return selectedArea?.category === AreaCategory.INFORMATICS;
    }, [area]);

    const isCustomArea = useMemo(() => {
        return area === 'Anderes (z.B. Bachelor-Anerkennung)';
    }, [area]);

    const isCustomInformaticsCategory = useMemo(() => {
        return isCustomArea && customCategory === AreaCategory.INFORMATICS;
    }, [isCustomArea, customCategory]);

    useEffect(() => {
        if (!isCurrentAreaInformatics) {
            setIsTheoretical(false);
        }
    }, [isCurrentAreaInformatics]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const creditValue = parseInt(credits, 10);
        if (!name.trim() || isNaN(creditValue) || creditValue <= 0) {
            alert('Bitte geben Sie einen gültigen Modulnamen und eine positive Credit-Anzahl an.');
            return;
        }
        if (!semester) {
            alert('Bitte wählen Sie ein Semester aus. Fügen Sie zuerst eines hinzu, falls die Liste leer ist.');
            return;
        }
        
        const moduleData = { 
            name, 
            credits: creditValue, 
            area, 
            semester, 
            isTheoretical,
            ...(isCustomArea && { customCategory }), // Nur hinzufügen wenn "Anderes" gewählt
            ...(isCustomInformaticsCategory && customInformaticsArea && { customInformaticsArea }) // Informatik-Fachgebiet
        };
        
        if (editingModule && onUpdateModule) {
            // Update existierendes Modul
            onUpdateModule({ ...editingModule, ...moduleData });
        } else {
            // Neues Modul hinzufügen
            onAddModule(moduleData);
        }
        
        // Formular zurücksetzen
        setName('');
        setCredits('');
        setArea(ALL_SUBJECT_AREAS[0].name);
        setIsTheoretical(false);
        setCustomAreaDescription('');
        setCustomCategory(AreaCategory.INFORMATICS);
        setCustomInformaticsArea('');
    };

    const handleCancel = () => {
        setName('');
        setCredits('');
        setArea(ALL_SUBJECT_AREAS[0].name);
        setIsTheoretical(false);
        setCustomAreaDescription('');
        setCustomCategory(AreaCategory.INFORMATICS);
        setCustomInformaticsArea('');
        if (onCancelEdit) {
            onCancelEdit();
        }
    };

    const isFormDisabled = semesters.length === 0;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
            {editingModule && (
                <div className="bg-blue-50 border-l-4 border-tum-blue p-4 mb-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <EditIcon />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-800">
                                Modul bearbeiten
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <fieldset disabled={isFormDisabled}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="module-name" className="block text-sm font-medium text-gray-700">
                            Modulname
                        </label>
                        <input
                            type="text"
                            id="module-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="z.B. Advanced Deep Learning"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tum-blue focus:border-tum-blue disabled:bg-gray-100"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="module-credits" className="block text-sm font-medium text-gray-700">
                            ECTS Credits
                        </label>
                        <input
                            type="number"
                            id="module-credits"
                            value={credits}
                            onChange={(e) => setCredits(e.target.value)}
                            placeholder="z.B. 5"
                            min="1"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tum-blue focus:border-tum-blue disabled:bg-gray-100"
                            required
                        />
                    </div>
                </div>

                {isCurrentAreaInformatics && (
                    <div className="pt-2 pb-4">
                        <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="is-theoretical"
                                    aria-describedby="is-theoretical-description"
                                    name="is-theoretical"
                                    type="checkbox"
                                    checked={isTheoretical}
                                    onChange={(e) => setIsTheoretical(e.target.checked)}
                                    className="focus:ring-tum-blue h-4 w-4 text-tum-blue border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="is-theoretical" className="font-medium text-gray-700">
                                    Theoretisches Modul
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="module-area" className="block text-sm font-medium text-gray-700">
                            Fachgebiet / Kategorie
                        </label>
                        <select
                            id="module-area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tum-blue focus:border-tum-blue sm:text-sm disabled:bg-gray-100"
                        >
                            {ALL_SUBJECT_AREAS.map(subjectArea => (
                                <option key={subjectArea.name} value={subjectArea.name}>
                                    {subjectArea.name} ({subjectArea.category})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="module-semester" className="block text-sm font-medium text-gray-700">
                            Semester
                        </label>
                        <select
                            id="module-semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tum-blue focus:border-tum-blue sm:text-sm disabled:bg-gray-100"
                            required
                        >
                            <option value="" disabled>Semester auswählen</option>
                            {semesters.map(s => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {isCustomArea && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="custom-category" className="block text-sm font-medium text-gray-700">
                                Zu welcher Kategorie soll es gezählt werden? *
                            </label>
                            <select
                                id="custom-category"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value as AreaCategory)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tum-blue focus:border-tum-blue sm:text-sm disabled:bg-gray-100"
                                required
                            >
                                <option value={AreaCategory.INFORMATICS}>{AreaCategory.INFORMATICS}</option>
                                <option value={AreaCategory.PROFILE_BUILDING}>{AreaCategory.PROFILE_BUILDING}</option>
                                <option value={AreaCategory.SOFT_SKILLS}>{AreaCategory.SOFT_SKILLS}</option>
                                <option value={AreaCategory.INTERDISCIPLINARY_PROJECT}>{AreaCategory.INTERDISCIPLINARY_PROJECT}</option>
                                <option value={AreaCategory.PRACTICAL_COURSE}>{AreaCategory.PRACTICAL_COURSE}</option>
                                <option value={AreaCategory.SEMINAR}>{AreaCategory.SEMINAR}</option>
                                <option value={AreaCategory.MISC}>{AreaCategory.MISC}</option>
                            </select>
                            <p className="mt-1 text-sm text-gray-500">
                                Wählen Sie aus, wo diese Credits angerechnet werden sollen.
                            </p>
                        </div>
                        
                        {isCustomInformaticsCategory && (
                            <div>
                                <label htmlFor="custom-informatics-area" className="block text-sm font-medium text-gray-700">
                                    Informatik-Fachgebiet (optional)
                                </label>
                                <select
                                    id="custom-informatics-area"
                                    value={customInformaticsArea}
                                    onChange={(e) => setCustomInformaticsArea(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tum-blue focus:border-tum-blue sm:text-sm disabled:bg-gray-100"
                                >
                                    <option value="">-- Kein spezifisches Fachgebiet --</option>
                                    {INFORMATICS_ONLY_AREAS.map(area => (
                                        <option key={area.name} value={area.name}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    Optional: Wählen Sie ein spezifisches Informatik-Fachgebiet für die Spezialisierung aus.
                                </p>
                            </div>
                        )}
                        
                        <div>
                            <label htmlFor="custom-area-description" className="block text-sm font-medium text-gray-700">
                                Beschreibung (optional)
                            </label>
                            <input
                                type="text"
                                id="custom-area-description"
                                value={customAreaDescription}
                                onChange={(e) => setCustomAreaDescription(e.target.value)}
                                placeholder="z.B. Anerkennung aus Bachelor"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tum-blue focus:border-tum-blue disabled:bg-gray-100"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Optional: Geben Sie weitere Details zur Kategorie "Anderes" ein.
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex justify-end pt-2 space-x-3">
                    {editingModule && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex justify-center py-2 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tum-blue transition-colors"
                        >
                            Abbrechen
                        </button>
                    )}
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-tum-blue hover:bg-tum-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tum-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isFormDisabled}
                    >
                        {editingModule ? 'Speichern' : 'Hinzufügen'}
                    </button>
                </div>
            </fieldset>
            {isFormDisabled && (
                <p className="text-sm text-center text-red-600">Bitte fügen Sie zuerst ein Semester hinzu, um Module erfassen zu können.</p>
            )}
        </form>
    );
};

export default ModuleForm;