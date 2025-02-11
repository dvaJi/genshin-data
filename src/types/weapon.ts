// This file was auto-generated by quicktype.

export interface Weapon {
    _id:            number;
    id:             string;
    name:           string;
    description:    string;
    rarity:         number;
    type:           Type;
    domain:         string;
    passive:        string;
    bonus:          string;
    specialProp?:   string;
    stats:          Stats;
    ascensions:     Ascension[];
    refinement_raw: RefinementRaw;
    refinements:    Refinement[];
}

export interface Ascension {
    ascension: number;
    level:     number;
    materials: Material[];
    cost?:     number;
}

export interface Material {
    _id:    number;
    id:     string;
    name:   string;
    amount: number;
    rarity: number;
}

export interface RefinementRaw {
    name:     string;
    template: string;
    params:   Array<string[]>;
}

export interface Refinement {
    refinement: number;
    desc:       string;
}

export interface Stats {
    primary:    string;
    secondary?: string;
    levels:     Level[];
}

export interface Level {
    ascension:  number;
    level:      number;
    primary:    number;
    secondary?: number;
}

export interface Type {
    id:   string;
    name: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toWeapon(json: string): Weapon[] {
        return JSON.parse(json);
    }

    public static weaponToJson(value: Weapon[]): string {
        return JSON.stringify(value);
    }
}
