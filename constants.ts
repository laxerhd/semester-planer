import type { SubjectArea } from './types';
import { AreaCategory } from './types';

export const TOTAL_CREDITS_GOAL: number = 120;

export const CATEGORY_GOALS: Record<AreaCategory, number> = {
    [AreaCategory.INFORMATICS]: 43,
    [AreaCategory.PROFILE_BUILDING]: 10,
    [AreaCategory.SOFT_SKILLS]: 6,
    [AreaCategory.INTERDISCIPLINARY_PROJECT]: 16,
    [AreaCategory.THESIS]: 30,
    [AreaCategory.SEMINAR]: 5,
    [AreaCategory.PRACTICAL_COURSE]: 10,
    [AreaCategory.MISC]: 0,
};

export const ALL_SUBJECT_AREAS: SubjectArea[] = [
    { name: 'Algorithms', category: AreaCategory.INFORMATICS },
    { name: 'Computer Graphics and Vision', category: AreaCategory.INFORMATICS },
    { name: 'Databases and Information Systems', category: AreaCategory.INFORMATICS },
    { name: 'Digital Biology and Digital Medicine', category: AreaCategory.INFORMATICS },
    { name: 'Engineering Software-intensive Systems', category: AreaCategory.INFORMATICS },
    { name: 'Formal Methods and their Applications', category: AreaCategory.INFORMATICS },
    { name: 'Machine Learning and Analytics', category: AreaCategory.INFORMATICS },
    { name: 'Robotics', category: AreaCategory.INFORMATICS },
    { name: 'Scientific Computing and High Performance Computing', category: AreaCategory.INFORMATICS },
    { name: 'Security and Privacy', category: AreaCategory.INFORMATICS },
    { name: 'Foundations of Programming', category: AreaCategory.INFORMATICS },
    { name: 'Computer Architecture, Computer Networks, and Distributed Systems', category: AreaCategory.INFORMATICS },
    { name: 'Human-Computer Interaction', category: AreaCategory.INFORMATICS },
    { name: 'Quantum Computing', category: AreaCategory.INFORMATICS },
    { name: 'Logic', category: AreaCategory.INFORMATICS },
    { name: 'Cognitive Systems', category: AreaCategory.INFORMATICS },
    { name: 'Profilbildung', category: AreaCategory.PROFILE_BUILDING },
    { name: 'Master-Seminar', category: AreaCategory.SEMINAR },
    { name: 'Advanced Practical Course', category: AreaCategory.PRACTICAL_COURSE },
    { name: 'Überfachliche Grundlagen', category: AreaCategory.SOFT_SKILLS },
    { name: 'Interdisciplinary Project', category: AreaCategory.INTERDISCIPLINARY_PROJECT },
    { name: 'Master-Arbeit', category: AreaCategory.THESIS },
    { name: 'Anderes (z.B. Bachelor-Anerkennung)', category: AreaCategory.MISC }, // Wird dynamisch zugewiesen
];

export const INFORMATICS_ONLY_AREAS: SubjectArea[] = ALL_SUBJECT_AREAS.filter(
    area => area.category === AreaCategory.INFORMATICS
);
