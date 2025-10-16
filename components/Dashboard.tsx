import React, { useMemo } from 'react';
import type { CreditSummary } from '../types';
import { AreaCategory } from '../types';
import { CATEGORY_GOALS } from '../constants';
import ProgressCard from './ProgressCard';

interface DashboardProps {
    totalCredits: number;
    totalGoal: number;
    creditSummary: CreditSummary;
    specialization: string | null;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2 text-tum-blue" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const Dashboard: React.FC<DashboardProps> = ({ totalCredits, totalGoal, creditSummary, specialization }) => {

    const sortedInformaticsAreas = useMemo(() => {
        return Object.entries(creditSummary.byInformaticsArea)
            .sort((a, b) => b[1] - a[1]);
    }, [creditSummary.byInformaticsArea]);

    const creditsInSpecialization = specialization ? (creditSummary.byInformaticsArea[specialization] || 0) : 0;
    const hasMet18Credits = creditsInSpecialization >= 18;

    const otherInformaticsAreas = useMemo(() => {
        return sortedInformaticsAreas.filter(([area]) => area !== specialization);
    }, [sortedInformaticsAreas, specialization]);

    const areasWithAtLeast8Credits = otherInformaticsAreas.filter(([, credits]) => credits >= 8);
    const hasMet8CreditsInTwoAreas = areasWithAtLeast8Credits.length >= 2;


    const rule1Text = specialization 
        ? `Mindestens 18 ECTS in Ihrem Schwerpunkt (${specialization})`
        : 'Mindestens 18 ECTS in einem Schwerpunkt (wird automatisch ermittelt)';

    const totalInformaticsCredits = (creditSummary.byCategory[AreaCategory.INFORMATICS] || 0) + (creditSummary.byCategory[AreaCategory.PROFILE_BUILDING] || 0);
    const theoreticalCredits = creditSummary.theoreticalCredits || 0;

    const orderedCategories = [
        AreaCategory.SEMINAR,
        AreaCategory.PRACTICAL_COURSE,
        AreaCategory.INTERDISCIPLINARY_PROJECT,
        AreaCategory.SOFT_SKILLS,
        AreaCategory.THESIS,
    ];

    return (
        <div className="space-y-6">
            <ProgressCard
                title="Gesamtfortschritt Master"
                currentValue={totalCredits}
                goalValue={totalGoal}
                isPrimary={true}
            />
            
            <div className="p-4 bg-blue-50 border-l-4 border-tum-blue rounded-r-lg">
                <h4 className="font-semibold text-tum-blue-dark flex items-center"><InfoIcon /> Regel für Informatik-Module</h4>
                <p className="text-xs text-gray-600 mt-2">
                    Der Schwerpunkt ist das Fachgebiet mit den meisten Credits.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                    <li className={hasMet18Credits ? 'text-green-600' : 'text-gray-800'}>
                        {rule1Text} ({hasMet18Credits ? 'erfüllt' : 'nicht erfüllt'})
                    </li>
                    <li className={hasMet8CreditsInTwoAreas ? 'text-green-600' : 'text-gray-800'}>
                        Mindestens <strong>8 ECTS</strong> in zwei weiteren Fachgebieten ({hasMet8CreditsInTwoAreas ? 'erfüllt' : 'nicht erfüllt'})
                    </li>
                </ul>
                 {specialization && !hasMet18Credits && <p className="text-xs text-tum-blue-dark mt-2">Aktuell im Schwerpunkt: {creditsInSpecialization} ECTS</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
               {orderedCategories.map(category => (
                    <ProgressCard
                        key={category}
                        title={category}
                        currentValue={creditSummary.byCategory[category] || 0}
                        goalValue={CATEGORY_GOALS[category]}
                    />
               ))}
                <ProgressCard
                    key={AreaCategory.PROFILE_BUILDING}
                    title={AreaCategory.PROFILE_BUILDING}
                    currentValue={creditSummary.byCategory[AreaCategory.PROFILE_BUILDING] || 0}
                    goalValue={CATEGORY_GOALS[AreaCategory.PROFILE_BUILDING]}
                />
                 <ProgressCard
                    title="Theoretische Informatik"
                    currentValue={theoreticalCredits}
                    goalValue={10}
                />
                <ProgressCard
                    key={AreaCategory.INFORMATICS}
                    title={AreaCategory.INFORMATICS}
                    currentValue={totalInformaticsCredits}
                    goalValue={CATEGORY_GOALS[AreaCategory.INFORMATICS]}
                />
            </div>
            
            {sortedInformaticsAreas.length > 0 && (
                 <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Details: Informatik-Fachgebiete</h3>
                    <div className="space-y-2">
                        {sortedInformaticsAreas.map(([area, credits]) => (
                            <div key={area} className={`p-3 bg-white rounded-lg shadow-sm text-sm ${area === specialization ? 'ring-2 ring-tum-blue' : ''}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">{area} {area === specialization && <span className="text-xs text-tum-blue-dark font-normal">(Schwerpunkt)</span>}</span>
                                    <span className="font-bold text-tum-blue-dark">{credits} ECTS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;