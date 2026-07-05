export interface CharacterData {
  portador: {
    nombre: string;
    genero: string;
    clase: string;
    edad: string;
    don: string;
    historia: string;
    fuerza: number;
    defensa: number;
    poder: number;
    resistencia: number;
    velocidad: number;
    imagen: string | null;
  };
  avatar: {
    nombre: string;
    clase: string;
    elementos: string[];
    tipoAtacante: string;
    ideaMazo: string;
    imagen: string | null;
  };
}

export type TabType = 'portador' | 'avatar' | 'editor';

export interface PortadorClassOption {
  name: string;
  prefix: string;
}

export interface AvatarClassOption {
  name: string;
  prefix: string;
  hasGenderVariants: boolean;
}

export interface ClassConfig {
  portador: PortadorClassOption[];
  avatar: AvatarClassOption[];
}
