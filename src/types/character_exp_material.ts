// This file was auto-generated by quicktype.

export interface CharacterExpMaterial {
    _id:         number;
    id:          string;
    name:        string;
    description: string;
    rarity:      number;
    exp:         number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCharacterExpMaterial(json: string): CharacterExpMaterial[] {
        return JSON.parse(json);
    }

    public static characterExpMaterialToJson(value: CharacterExpMaterial[]): string {
        return JSON.stringify(value);
    }
}
