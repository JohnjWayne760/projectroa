import { Shield, BookOpen } from 'lucide-react';
import type { CharacterData, PortadorClassOption } from '../types.ts';
import { clsx } from 'clsx';

interface Props {
  data: CharacterData['portador'];
  classConfig: PortadorClassOption[];
  updateData: (field: string, value: string | number) => void;
}

export default function FormPortador({ data, classConfig, updateData }: Props) {
  const activeClassOpt = classConfig.find(c => c.name === data.clase);
  const activePrefix = activeClassOpt ? activeClassOpt.prefix : (classConfig[0]?.prefix || "Adventurer");
  const activeSuffix = data.genero === "Mujer" ? "F" : "M";
  const activeImage = `${activePrefix}-${activeSuffix}.png`;

  return (
    <section className="animate-fade-in flex flex-col h-full flex-1">
      <div className="flex flex-col md:flex-row h-full flex-1 relative">
        {/* Datos */}
        <div className="w-full md:w-[62.5%] flex flex-col p-6 md:p-8 md:pr-12">

          <div className="space-y-3 border-b border-red-900/30 pb-4 mb-4">
            <div className="group">
              <label className="block text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">Nombre Completo</label>
              <input
                type="text"
                className="medieval-input"
                value={data.nombre}
                onChange={e => updateData('nombre', e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 group">
                <label className="block text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">Género</label>
                <select className="medieval-input bg-[#1e1e23]" value={data.genero} onChange={e => updateData('genero', e.target.value)}>
                  <option value="Mujer">Mujer</option>
                  <option value="Hombre">Hombre</option>
                </select>
              </div>
              <div className="flex-1 group">
                <label className="block text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">Edad</label>
                <select className="medieval-input bg-[#1e1e23]" value={data.edad} onChange={e => updateData('edad', e.target.value)}>
                  <option value="Niñez">Niñez</option>
                  <option value="Adolescencia">Adolescencia</option>
                  <option value="Joven Adulto">Joven Adulto</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Veterano">Veterano</option>
                  <option value="Anciano">Anciano</option>
                </select>
              </div>
            </div>
          </div>

          <div className="group border-b border-red-900/30 pb-4 mb-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">
              <Shield className="w-4 h-4" /> Clase
            </label>
            <select className="medieval-input bg-[#1e1e23]" value={data.clase} onChange={e => updateData('clase', e.target.value)}>
              {classConfig.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="group border-b border-red-900/30 pb-4 mb-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">
              <BookOpen className="w-4 h-4" /> Don
            </label>
            <textarea
              rows={3}
              className="medieval-input resize-none"
              value={data.don}
              onChange={e => updateData('don', e.target.value)}
            />
          </div>

          <div className="group flex-1 flex flex-col">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-1 group-focus-within:text-red-400 transition-colors">
              <BookOpen className="w-4 h-4" /> Historia / Origen
            </label>
            <textarea
              className="medieval-input resize-none flex-1 min-h-[80px]"
              value={data.historia}
              onChange={e => updateData('historia', e.target.value)}
            />
          </div>
        </div>

        {/* Galería de Personajes Apilados */}
        <div className="w-full md:w-[37.5%] relative h-72 md:h-auto pointer-events-none overflow-hidden border-l border-[#b89346]">
          
          {classConfig.flatMap(c => [`${c.prefix}-F.png`, `${c.prefix}-M.png`]).map((img, idx, ALL_IMAGES) => {
            const activeIdx = ALL_IMAGES.indexOf(activeImage);
            const isActive = idx === activeIdx;
            const diff = idx - activeIdx;
            
            let transformClass = "translate-x-0";
            if (diff < 0) transformClass = "-translate-x-full opacity-0";
            if (diff > 0) transformClass = "translate-x-full opacity-0";
            if (isActive) transformClass = "translate-x-0 opacity-100";

            return (
              <img 
                key={img}
                src={`./img/chars/${img}`} 
                alt="Character class"
                className={clsx(
                  "absolute right-0 bottom-0 h-full w-auto max-w-none transition-all duration-700 ease-in-out pointer-events-none",
                  transformClass,
                  isActive 
                    ? "z-10 brightness-100 drop-shadow-[0_0_15px_rgba(255,200,50,0.4)]" 
                    : "z-0 brightness-[0.2]"
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
