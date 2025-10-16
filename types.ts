export enum AreaCategory {
    INFORMATICS = 'Informatik Wahlmodule',
    PROFILE_BUILDING = 'Profilbildung',
    SOFT_SKILLS = 'Überfachliche Grundlagen',
    THESIS = 'Master-Arbeit',
    INTERDISCIPLINARY_PROJECT = 'Interdisciplinary Project (IDP)',
    SEMINAR = 'Master-Seminar',
    PRACTICAL_COURSE = 'Advanced Practical Course',
    MISC = 'Sonstiges',
}

export interface Module {
    id: string;
    name: string;
    credits: number;
    area: string; 
    semester: string;
    isTheoretical?: boolean;
    customCategory?: AreaCategory; // Für "Anderes" - benutzerdefinierte Kategorie
    customInformaticsArea?: string; // Für "Anderes" + Informatik - spezifisches Fachgebiet
}

export interface SubjectArea {
    name: string;
    category: AreaCategory;
}

export interface CreditSummary {
    total: number;
    byCategory: Partial<Record<AreaCategory, number>>;
    byInformaticsArea: Record<string, number>;
    theoreticalCredits: number;
    overflowCredits: number;
}