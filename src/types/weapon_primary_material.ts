// This file was auto-generated by quicktype.

export interface WeaponPrimaryMaterial {
    _id:         number;
    id:          string;
    name:        string;
    description: string;
    source:      string[];
    location:    string;
    rarity:      number;
    craft?:      Craft;
    domain:      string;
    days:        string[];
}

export interface Craft {
    cost:  number;
    items: Item[];
}

export interface Item {
    _id:    number;
    id:     string;
    name:   string;
    amount: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toWeaponPrimaryMaterial(json: string): WeaponPrimaryMaterial[] {
        return JSON.parse(json);
    }

    public static weaponPrimaryMaterialToJson(value: WeaponPrimaryMaterial[]): string {
        return JSON.stringify(value);
    }
}
