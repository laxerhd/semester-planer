
import React from 'react';

interface ProgressCardProps {
    title: string;
    currentValue: number;
    goalValue: number;
    isPrimary?: boolean;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, currentValue, goalValue, isPrimary = false }) => {
    const percentage = goalValue > 0 ? Math.min((currentValue / goalValue) * 100, 100) : 0;
    const isComplete = currentValue >= goalValue;

    const cardClasses = isPrimary 
        ? "bg-tum-blue text-white shadow-xl" 
        : "bg-white text-gray-800 shadow-md";
    
    const textClasses = isPrimary
        ? "text-tum-blue-light"
        : "text-gray-500";
    
    const progressBgClass = isPrimary ? "bg-white bg-opacity-30" : "bg-gray-200";
    
    const progressBarClass = isComplete 
        ? (isPrimary ? "bg-accent-green" : "bg-green-500")
        : (isPrimary ? "bg-white" : "bg-tum-blue");


    return (
        <div className={`p-4 rounded-lg transition-all duration-300 ${cardClasses}`}>
            <div className="flex justify-between items-baseline">
                <h3 className={`font-semibold ${isPrimary ? 'text-lg' : 'text-md'}`}>{title}</h3>
                <p className={`text-sm font-medium ${textClasses}`}>
                    <span className={isPrimary ? "text-white text-lg font-bold" : "text-tum-blue-dark font-bold"}>{currentValue}</span> / {goalValue} ECTS
                </p>
            </div>
            <div className={`w-full ${progressBgClass} rounded-full h-2.5 mt-2`}>
                <div
                    className={`${progressBarClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressCard;
