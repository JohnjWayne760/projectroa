import React, { useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { ClassConfig, PortadorClassOption, AvatarClassOption } from '../types.ts';
import { clsx } from 'clsx';

interface Props {
  classConfig: ClassConfig;
  setClassConfig: React.Dispatch<React.SetStateAction<ClassConfig>>;
}

export default function FormEditor({ classConfig, setClassConfig }: Props) {
  const [saving, setSaving] = useState(false);

  const saveToServer = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/save-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classConfig, null, 2)
      });
      if (!response.ok) throw new Error('Error al guardar');
      alert('Clases guardadas correctamente en classes.json');
    } catch (err) {
      console.error(err);
      alert('Hubo un error al guardar. Asegúrate de ejecutar el servidor de desarrollo.');
    } finally {
      setSaving(false);
    }
  };

  const addPortador = () => {
    setClassConfig(prev => ({
      ...prev,
      portador: [...prev.portador, { name: 'Nueva Clase', prefix: 'NewPrefix' }]
    }));
  };

  const removePortador = (index: number) => {
    setClassConfig(prev => {
      const copy = [...prev.portador];
      copy.splice(index, 1);
      return { ...prev, portador: copy };
    });
  };

  const updatePortador = (index: number, field: keyof PortadorClassOption, value: string) => {
    setClassConfig(prev => {
      const copy = [...prev.portador];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, portador: copy };
    });
  };

  const addAvatar = () => {
    setClassConfig(prev => ({
      ...prev,
      avatar: [...prev.avatar, { name: 'Nueva Clase', prefix: 'NewPrefix', hasGenderVariants: false }]
    }));
  };

  const removeAvatar = (index: number) => {
    setClassConfig(prev => {
      const copy = [...prev.avatar];
      copy.splice(index, 1);
      return { ...prev, avatar: copy };
    });
  };

  const updateAvatar = (index: number, field: keyof AvatarClassOption, value: string | boolean) => {
    setClassConfig(prev => {
      const copy = [...prev.avatar];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, avatar: copy };
    });
  };

  return (
    <section className="animate-fade-in flex flex-col h-full flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b border-[#b89346] pb-4">
        <h2 className="font-cinzel text-2xl font-bold text-gray-300">Editor de Clases (Dev Mode)</h2>
        <button 
          onClick={saveToServer}
          disabled={saving}
          className={clsx(
            "flex items-center gap-2 font-cinzel font-bold px-6 py-2 rounded text-white transition-all shadow-[0_0_10px_rgba(212,175,55,0.4)]",
            saving ? "bg-gray-600 cursor-wait" : "bg-gradient-to-r from-yellow-700 to-yellow-900 hover:scale-105"
          )}
        >
          <Save className="w-4 h-4" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Portador Editor */}
        <div className="flex-1 bg-black/40 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-red-400">Clases de Portador</h3>
            <button onClick={addPortador} className="bg-gray-800 hover:bg-gray-700 p-1.5 rounded text-gray-300 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {classConfig.portador.map((cls, i) => (
              <div key={i} className="flex gap-2 items-center bg-[#1e1e23] p-2 rounded border border-gray-800">
                <input 
                  type="text" 
                  value={cls.name}
                  onChange={(e) => updatePortador(i, 'name', e.target.value)}
                  className="medieval-input bg-black/50 p-1 text-sm flex-[2]"
                  placeholder="Nombre Visible"
                />
                <input 
                  type="text" 
                  value={cls.prefix}
                  onChange={(e) => updatePortador(i, 'prefix', e.target.value)}
                  className="medieval-input bg-black/50 p-1 text-sm flex-1"
                  placeholder="Prefijo Imagen"
                />
                <button onClick={() => removePortador(i)} className="p-1.5 text-red-500 hover:bg-red-900/30 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Avatar Editor */}
        <div className="flex-1 bg-black/40 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-blue-400">Clases de Avatar</h3>
            <button onClick={addAvatar} className="bg-gray-800 hover:bg-gray-700 p-1.5 rounded text-gray-300 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {classConfig.avatar.map((cls, i) => (
              <div key={i} className="flex gap-2 items-center bg-[#1e1e23] p-2 rounded border border-gray-800 flex-wrap">
                <input 
                  type="text" 
                  value={cls.name}
                  onChange={(e) => updateAvatar(i, 'name', e.target.value)}
                  className="medieval-input bg-black/50 p-1 text-sm flex-[2] min-w-[120px]"
                  placeholder="Nombre Visible"
                />
                <input 
                  type="text" 
                  value={cls.prefix}
                  onChange={(e) => updateAvatar(i, 'prefix', e.target.value)}
                  className="medieval-input bg-black/50 p-1 text-sm flex-1 min-w-[80px]"
                  placeholder="Prefijo Imagen"
                />
                <label className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap px-2">
                  <input 
                    type="checkbox"
                    checked={cls.hasGenderVariants}
                    onChange={(e) => updateAvatar(i, 'hasGenderVariants', e.target.checked)}
                    className="accent-blue-500"
                  />
                  Variantes (M/F)
                </label>
                <button onClick={() => removeAvatar(i)} className="p-1.5 text-red-500 hover:bg-red-900/30 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
