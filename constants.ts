import type { SubjectArea } from './types';
import { AreaCategory } from './types';

// Enum capturing all keys used for local storage.
export enum LOCAL_STORAGE_KEYS {
    LAST_AREA = "ls_last_area",
    LAST_IS_THEORETICAL = "ls_last_is_theoretical",
}

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
    { name: 'ALG - Algorithms', category: AreaCategory.INFORMATICS },
    { name: 'CGV - Computer Graphics and Vision', category: AreaCategory.INFORMATICS },
    { name: 'DBI - Databases and Information Systems', category: AreaCategory.INFORMATICS },
    { name: 'DBM - Digital Biology and Digital Medicine', category: AreaCategory.INFORMATICS },
    { name: 'SE - Engineering Software-intensive Systems', category: AreaCategory.INFORMATICS },
    { name: 'FMA - Formal Methods and their Applications', category: AreaCategory.INFORMATICS },
    { name: 'MLA - Machine Learning and Analytics', category: AreaCategory.INFORMATICS },
    { name: 'RRV - Computer Architecture, Computer Networks, and Distributed Systems', category: AreaCategory.INFORMATICS },
    { name: 'ROB - Robotics', category: AreaCategory.INFORMATICS },
    { name: 'SP - Security and Privacy', category: AreaCategory.INFORMATICS },
    { name: 'HPC - Scientific Computing and High Performance Computing', category: AreaCategory.INFORMATICS },
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
