import { useState } from 'react';
import { Download, Scroll, AlertCircle, Upload } from 'lucide-react';
import type { CharacterData, TabType } from './types.ts';
import Header from './components/Header.tsx';
import TabNavigation from './components/TabNavigation.tsx';
import FormPortador from './components/FormPortador.tsx';
import FormAvatar from './components/FormAvatar.tsx';
import FormEditor from './components/FormEditor.tsx';

import AnimatedBackground from './components/AnimatedBackground.tsx';
import { clsx } from 'clsx';
import type { ClassConfig } from './types.ts';
import defaultClasses from './classes.json';

const initialData: CharacterData = {
  portador: {
    nombre: "",
    genero: "Hombre",
    clase: "Aventurero - Espada y Escudo",
    edad: "Joven Adulto",
    don: "",
    historia: "",
    fuerza: 0,
    defensa: 0,
    poder: 0,
    resistencia: 0,
    velocidad: 0,
    imagen: null
  },
  avatar: {
    nombre: "", clase: "Héroe Legendario", elementos: [], tipoAtacante: "Físico", ideaMazo: "", imagen: null
  }
};

const STATS_LIST = ['fuerza', 'defensa', 'poder', 'resistencia', 'velocidad'] as const;
const STAT_NAMES: Record<string, string> = {
  fuerza: "FUERZA",
  defensa: "DEFENSA",
  poder: "PODER",
  resistencia: "RESISTENCIA",
  velocidad: "VELOCIDAD"
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('portador');
  const [data, setData] = useState<CharacterData>(initialData);
  const [classConfig, setClassConfig] = useState<ClassConfig>(defaultClasses as ClassConfig);

  const updateData = (section: keyof CharacterData, field: string, value: string | number | null) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const getStatsTotal = () => {
    const p = data.portador;
    return p.fuerza + p.defensa + p.poder + p.resistencia + p.velocidad;
  };

  const getStatsMax = () => {
    let max = 35;
    if (data.avatar.tipoAtacante === "Mixto") {
      max -= 10;
    }
    const numElements = data.avatar.elementos.length;
    if (numElements >= 4) max += 5;
    if (numElements >= 6) max += 5;
    if (numElements >= 8) max += 5;
    return max;
  };

  const handleStatChange = (stat: string, delta: number) => {
    const current = data.portador[stat as keyof CharacterData['portador']] as number;
    const newVal = Math.max(0, current + delta);
    const total = getStatsTotal();
    const maxStats = getStatsMax();
    if (newVal > current && total >= maxStats) return;
    updateData('portador', stat, newVal);
  };

  const isStatsValid = () => {
    const total = getStatsTotal();
    const maxStats = getStatsMax();
    return total <= maxStats && total % 5 === 0;
  };

  const canSave = () => {
    return isStatsValid() && data.avatar.elementos.length >= 2;
  };

  const exportarJSON = () => {
    if (!canSave()) {
      const reasons: string[] = [];
      if (!isStatsValid()) reasons.push(`La Estadística Total debe ser un múltiplo de 5 y no exceder los ${getStatsMax()} puntos.`);
      if (data.avatar.elementos.length < 2) reasons.push('El Avatar debe tener al menos 2 Elementos.');
      alert('No se puede guardar:\n' + reasons.join('\n'));
      return;
    }

    try {
      const dataToExport = {
        ...data,
        portador: {
          ...data.portador,
          estadistica: getStatsTotal()
        }
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      let filename = "avalon_character_unknown.json";
      if (data.portador.nombre.trim() !== "") {
        const safeName = data.portador.nombre.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `avalon_${safeName}.json`;
      }

      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      console.error("Error al exportar el archivo JSON:", error);
      alert("Hubo un error al intentar guardar el personaje.");
    }
  };

  const importarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.portador && json.avatar) {
          setData(json);
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (error) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };


  const totalStats = getStatsTotal();
  const currentMaxStats = getStatsMax();

  return (
    <>
      <AnimatedBackground activeTab={activeTab} />
      <div className="relative z-10 p-4 md:p-8 flex flex-col items-center font-lora">
      <Header />

      <main className="medieval-border rounded-lg w-full max-w-5xl flex flex-col overflow-hidden shadow-2xl mb-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 relative min-h-[500px] flex flex-col">
          {activeTab === 'portador' && (
            <FormPortador data={data.portador} classConfig={classConfig.portador} updateData={(f, v) => updateData('portador', f, v)} />
          )}
          {activeTab === 'avatar' && (
            <FormAvatar data={data.avatar} portadorData={data.portador} classConfig={classConfig.avatar} updateData={(f, v) => updateData('avatar', f, v)} />
          )}
          {activeTab === 'editor' && import.meta.env.DEV && (
            <FormEditor classConfig={classConfig} setClassConfig={setClassConfig} />
          )}
        </div>

        <footer className="bg-black/80 border-t border-[#b89346] p-4 flex flex-col lg:flex-row gap-6 justify-between items-center backdrop-blur-md">
          {/* Editor de Estadísticas Integrado */}
          <div className="flex flex-wrap items-center gap-4 bg-black/40 p-2 rounded-lg border border-red-900/30">
            <span className="font-cinzel text-gray-300 text-sm hidden sm:block pr-2 border-r border-red-900/50">Stats</span>
            
            <div className="flex flex-wrap gap-3">
              {STATS_LIST.map(attr => {
                let colorClass = "text-gray-400";
                if (attr === 'velocidad') {
                  colorClass = "text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.5)]";
                } else if (attr === 'fuerza' && data.avatar.tipoAtacante === 'Físico') {
                  colorClass = "text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]";
                } else if (attr === 'poder' && data.avatar.tipoAtacante === 'Mágico') {
                  colorClass = "text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]";
                }

                return (
                <div key={attr} className="flex flex-col items-center bg-black/60 px-2 py-1 rounded">
                  <span className={clsx("text-[9px] md:text-[10px] font-bold tracking-wider mb-1", colorClass)}>
                    {STAT_NAMES[attr]}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleStatChange(attr, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-red-900/30 text-red-400 hover:bg-red-800 hover:text-white transition-colors border border-red-900/50 text-xs"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-cinzel text-sm text-[#d4af37]">
                      {data.portador[attr as keyof CharacterData['portador']] as number}
                    </span>
                    <button 
                      onClick={() => handleStatChange(attr, 1)}
                      disabled={totalStats >= currentMaxStats}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-red-900/30 text-red-400 hover:bg-red-800 hover:text-white transition-colors border border-red-900/50 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
                )
              })}
            </div>

            <div className="pl-3 border-l border-red-900/50 flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] uppercase text-gray-400 font-bold mb-1">Estamina</span>
              <span className={clsx(
                "font-cinzel text-sm font-bold",
                totalStats % 5 === 0 && totalStats <= currentMaxStats && totalStats > 0 ? "text-green-400" : "text-red-500"
              )}>
                {totalStats} / {currentMaxStats}
              </span>
            </div>
          </div>

          {/* Acciones y Errores */}
          <div className="flex flex-col items-end gap-2 w-full lg:w-auto">
            {!isStatsValid() && (
              <div className="text-red-400 text-xs font-bold flex items-center gap-1 bg-red-900/20 px-3 py-1 rounded-full border border-red-900/50">
                <AlertCircle className="w-3 h-3" />
                <span>La suma total debe ser múltiplo de 5</span>
              </div>
            )}
            {data.avatar.elementos.length < 2 && (
              <div className="text-yellow-400 text-xs font-bold flex items-center gap-1 bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-900/50">
                <AlertCircle className="w-3 h-3" />
                <span>El Avatar necesita al menos 2 Elementos</span>
              </div>
            )}
            
            <div className="flex gap-2 w-full md:w-auto mt-2">
              <label className="font-cinzel font-bold px-4 py-2 text-xs md:text-sm text-white rounded transition-all transform flex items-center justify-center gap-2 w-full md:w-auto bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 cursor-pointer">
                <Upload className="w-3 h-3" />
                Cargar
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={importarJSON} 
                />
              </label>

              <button 
                onClick={exportarJSON} 
                disabled={!canSave()}
                className={`font-cinzel font-bold px-4 py-2 text-xs md:text-sm text-white rounded transition-all transform flex items-center gap-2 w-full justify-center md:w-auto
                  ${canSave() 
                    ? 'bg-gradient-to-r from-yellow-700 to-yellow-900 hover:from-yellow-600 hover:to-yellow-800 border border-yellow-400 shadow-[0_0_10px_rgba(212,175,55,0.4)] hover:scale-105 cursor-pointer' 
                    : 'bg-gray-800 border border-gray-600 opacity-50 cursor-not-allowed'}`}
              >
                <Scroll className="w-3 h-3" />
                Guardar
                <Download className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </>
  );
}

export default App;
