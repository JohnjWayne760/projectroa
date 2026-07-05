import { useEffect, useRef } from 'react';
import { Activity, BookOpen } from 'lucide-react';
import type { CharacterData, AvatarClassOption } from '../types.ts';
import { clsx } from 'clsx';

interface Props {
  data: CharacterData['avatar'];
  portadorData: CharacterData['portador'];
  classConfig: AvatarClassOption[];
  updateData: (field: string, value: any) => void;
}

const ELEMENT_OPTIONS = [
  { name: 'Cristal', img: './img/elements/CrystalStone.png', icon: '💎' },
  { name: 'Oscuridad', img: './img/elements/DarknessStone.png', icon: '🌑' },
  { name: 'Tierra', img: './img/elements/EarthStone.png', icon: '🪨' },
  { name: 'Fuego', img: './img/elements/FireStone.png', icon: '🔥' },
  { name: 'Hielo', img: './img/elements/IceStone.png', icon: '❄️' },
  { name: 'Veneno', img: './img/elements/PoisonStone.png', icon: '☠️' },
  { name: 'Ilusión', img: './img/elements/IlussionStone.png', icon: '🎭' },
  { name: 'Psíquico', img: './img/elements/PsychicStone.png', icon: '👁️' },
  { name: 'Rayo', img: './img/elements/LightningStone.png', icon: '⚡' },
  { name: 'Luz', img: './img/elements/LightStone.png', icon: '✨' },
  { name: 'Espectro', img: './img/elements/PhantomStone.png', icon: '👻' },
  { name: 'Planta', img: './img/elements/PlantStone.png', icon: '🌿' },
  { name: 'Sonido', img: './img/elements/SoundStone.png', icon: '🎵' },
  { name: 'Metal', img: './img/elements/SteelStone.png', icon: '⚙️' },
  { name: 'Agua', img: './img/elements/WaterStone.png', icon: '💧' },
  { name: 'Viento', img: './img/elements/WindStone.png', icon: '🌪️' },
  { name: 'No-Elemental', img: './img/elements/Non-Elemental Stone.png', icon: '⚪' },
];

const TIPO_ATACANTE_OPTIONS = [
  { name: 'Físico', img: './img/PhysicStone.png' },
  { name: 'Mágico', img: './img/PowerStone.png' },
  { name: 'Mixto', img: './img/MixtureStone.png' }
];

export default function FormAvatar({ data, portadorData, classConfig, updateData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const toggleElement = (elementName: string) => {
    const isSelected = data.elementos.includes(elementName);
    if (isSelected) {
      updateData('elementos', data.elementos.filter(e => e !== elementName));
    } else {
      if (data.elementos.length < 8) {
        updateData('elementos', [...data.elementos, elementName]);
      }
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let imgObj: HTMLImageElement | null = null;
    
    const activeClassOpt = classConfig.find(c => c.name === data.clase);
    let filename = activeClassOpt ? activeClassOpt.prefix : (classConfig[0]?.prefix || "Nord");
    if (activeClassOpt && activeClassOpt.hasGenderVariants) {
      filename = `${filename}-${portadorData.genero === "Mujer" ? "F" : "M"}`;
    }
    const imagePath = `./img/avatars/${filename}.png`;
    
    imgObj = new Image();
    imgObj.src = imagePath;
    imgObj.onload = () => drawCard();
    imgObj.onerror = () => drawCard();

    function drawMarbleTexture(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)';
      ctx.lineWidth = 1;
      
      for(let i=0; i<15; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random()*canvas!.width, 0);
          let x = Math.random()*canvas!.width;
          for(let y=0; y<canvas!.height; y+=10) {
              x += Math.sin(y/50) * 5 + (Math.random()-0.5)*10;
              ctx.lineTo(x, y);
          }
          ctx.stroke();
      }
      for (let i = 0; i < 5000; i++) {
          const x = Math.random() * canvas!.width;
          const y = Math.random() * canvas!.height;
          const opacity = Math.random() * 0.05;
          ctx.fillStyle = `rgba(0,0,0,${opacity})`;
          ctx.fillRect(x, y, 1, 1);
      }
    }

    function drawSilverFrame(x: number, y: number, w: number, h: number, thickness: number) {
      const grad = ctx!.createLinearGradient(x, y, x+w, y+h);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.2, '#ffffff');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(0.8, '#ffffff');
      grad.addColorStop(1, '#64748b');

      ctx!.strokeStyle = grad;
      ctx!.lineWidth = thickness;
      ctx!.strokeRect(x, y, w, h);
      
      ctx!.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx!.lineWidth = 1;
      ctx!.strokeRect(x + thickness/2, y + thickness/2, w - thickness, h - thickness);
      ctx!.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx!.strokeRect(x - thickness/2, y - thickness/2, w + thickness, h + thickness);
    }

    function drawSilverCircle(cx: number, cy: number, r: number, thickness: number) {
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      const grad = ctx!.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      grad.addColorStop(0, '#94a3b8');
      grad.addColorStop(0.2, '#ffffff');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(0.8, '#ffffff');
      grad.addColorStop(1, '#64748b');
      ctx!.fillStyle = '#0f172a';
      
      ctx!.fill();
      
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = thickness;
      ctx!.stroke();
      
      ctx!.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(cx, cy, r - thickness/2, 0, Math.PI * 2);
      ctx!.stroke();
    }

    function drawReliefButton(x: number, y: number, w: number, h: number, isSpecial: boolean, customBg: string | null = null, customBorder: string | null = null) {
      ctx!.fillStyle = customBg ? customBg : (isSpecial ? '#1e3a5f' : '#334155');
      ctx!.fillRect(x, y, w, h);
      
      ctx!.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx!.beginPath(); ctx!.moveTo(x, y); ctx!.lineTo(x+w, y); ctx!.lineTo(x+w-4, y+4); ctx!.lineTo(x+4, y+4); ctx!.fill();
      ctx!.beginPath(); ctx!.moveTo(x, y); ctx!.lineTo(x, y+h); ctx!.lineTo(x+4, y+h-4); ctx!.lineTo(x+4, y+4); ctx!.fill();
      
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx!.beginPath(); ctx!.moveTo(x, y+h); ctx!.lineTo(x+w, y+h); ctx!.lineTo(x+w-4, y+h-4); ctx!.lineTo(x+4, y+h-4); ctx!.fill();
      ctx!.beginPath(); ctx!.moveTo(x+w, y); ctx!.lineTo(x+w, y+h); ctx!.lineTo(x+w-4, y+h-4); ctx!.lineTo(x+w-4, y+4); ctx!.fill();
      
      ctx!.strokeStyle = customBorder ? customBorder : (isSpecial ? '#60a5fa' : '#94a3b8');
      ctx!.lineWidth = 1;
      ctx!.strokeRect(x+2, y+2, w-4, h-4);
    }

    function wrapTextJustified(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
      if (!text) return;
      const paragraphs = text.split('\n');
      for (let p = 0; p < paragraphs.length; p++) {
          const words = paragraphs[p].split(' ').filter(w => w.length > 0);
          let line: string[] = [];
          let currentLineWidth = 0;
          for(let n = 0; n < words.length; n++) {
              let word = words[n];
              let wordWidth = context.measureText(word).width;
              let spaceWidth = context.measureText(' ').width;
              
              if (currentLineWidth + wordWidth + (line.length * spaceWidth) > maxWidth && line.length > 0) {
                  let totalWordWidth = line.reduce((acc, w) => acc + context.measureText(w).width, 0);
                  let totalSpaceToDistribute = maxWidth - totalWordWidth;
                  let spacePerGap = line.length > 1 ? totalSpaceToDistribute / (line.length - 1) : 0;
                  let currentX = x;
                  for (let i = 0; i < line.length; i++) {
                      context.fillText(line[i], currentX, y);
                      currentX += context.measureText(line[i]).width + spacePerGap;
                  }
                  line = [word];
                  currentLineWidth = wordWidth;
                  y += lineHeight;
              } else {
                  line.push(word);
                  currentLineWidth += wordWidth;
              }
          }
          let currentX = x;
          let spaceWidth = context.measureText(' ').width;
          for (let i = 0; i < line.length; i++) {
              context.fillText(line[i], currentX, y);
              currentX += context.measureText(line[i]).width + spaceWidth;
          }
          y += lineHeight;
      }
    }

    function drawCard() {
      const { fuerza, defensa, poder, resistencia, velocidad } = portadorData;
      const total = fuerza + defensa + poder + resistencia + velocidad;
      const name = data.nombre || '';
      const effect = data.ideaMazo || '';
      const atkType = data.tipoAtacante === 'Físico' ? 'FIS' : data.tipoAtacante === 'Mágico' ? 'MAG' : 'MIX';
      
      const s1 = fuerza;
      const s2 = defensa;
      const s3 = poder;
      const s4 = resistencia;
      const s5 = velocidad;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawMarbleTexture(ctx!);
      drawSilverFrame(20, 20, canvas!.width-40, canvas!.height-40, 16);

      const nameBoxX = 120;
      const nameBoxY = 40;
      const nameBoxW = canvas!.width - 40 - nameBoxX;
      const nameBoxH = 65;
      
      ctx!.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx!.fillRect(nameBoxX, nameBoxY, nameBoxW, nameBoxH);
      drawSilverFrame(nameBoxX, nameBoxY, nameBoxW, nameBoxH, 4);

      ctx!.fillStyle = '#f8fafc';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.shadowColor = 'black';
      ctx!.shadowBlur = 5;
      const textCenterX = nameBoxX + (nameBoxW / 2); 
      const maxNameWidth = nameBoxW - 40;
      let fontSize = 42;
      ctx!.font = `900 ${fontSize}px 'Cinzel', serif`;
      
      while(ctx!.measureText(name.toUpperCase()).width > maxNameWidth && fontSize > 16) {
          fontSize -= 1;
          ctx!.font = `900 ${fontSize}px 'Cinzel', serif`;
      }
      ctx!.fillText(name.toUpperCase(), textCenterX, nameBoxY + nameBoxH/2 + 3);
      ctx!.shadowBlur = 0;
      
      const imgY = 125;
      const imgSize = canvas!.width - 80;
      ctx!.fillStyle = '#0f172a';
      ctx!.fillRect(40, imgY, imgSize, imgSize);
      
      if(imgObj) {
          ctx!.save();
          ctx!.beginPath();
          ctx!.rect(40, imgY, imgSize, imgSize);
          ctx!.clip();
          
          const imgRatio = imgObj.width / imgObj.height;
          let drawW, drawH, drawX, drawY;
          
          if (imgRatio > 1) { 
              drawH = imgSize;
              drawW = imgObj.width * (imgSize / imgObj.height);
              drawX = 40 - (drawW - imgSize) / 2;
              drawY = imgY;
          } else {
              drawW = imgSize;
              drawH = imgObj.height * (imgSize / imgObj.width);
              drawX = 40;
              drawY = imgY - (drawH - imgSize) / 2;
          }
          ctx!.drawImage(imgObj, drawX, drawY, drawW, drawH);
          ctx!.restore();
      }
      drawSilverFrame(40, imgY, imgSize, imgSize, 8);

      const effX = 110;
      const effW = 330;
      const effY = 615;
      const effH = 205;
      const effGrad = ctx!.createLinearGradient(effX, effY, effX, effY+effH);
      effGrad.addColorStop(0, 'rgba(241, 245, 249, 0.85)'); 
      effGrad.addColorStop(1, 'rgba(203, 213, 225, 0.95)');
      ctx!.fillStyle = effGrad;
      ctx!.fillRect(effX, effY, effW, effH);
      drawSilverFrame(effX, effY, effW, effH, 6);

      let statW = 55;
      let statH = 41;
      let statGap = 7; 
      let labelFont = "bold 12px 'Cinzel', serif";
      let valFont = "700 20px 'Space Mono', monospace";
      let labYOffset = 15;
      let valYOffset = 34;
      
      let leftStats = [
          { name: 'STR', val: s1 }, { name: 'DEF', val: s2 },
          { name: 'POW', val: s3 }, { name: 'RES', val: s4 }
      ];
      let rightStats = [
          { name: 'SPD', val: s5, isSpecial: false }, { name: 'STA', val: total, isSpecial: true }
      ];

      ctx!.textBaseline = 'alphabetic';
      leftStats.forEach((stat, i) => {
          let y = effY + i * (statH + statGap);
          let cBg = null, cBord = null, cLab = '#cbd5e1', cVal = '#ffffff';
          
          if (atkType === 'FIS' && stat.name === 'STR') {
              cBg = '#7f1d1d'; cBord = '#fca5a5'; cLab = '#fca5a5'; cVal = '#fef2f2';
          } else if (atkType === 'MAG' && stat.name === 'POW') {
              cBg = '#1e3a8a'; cBord = '#93c5fd'; cLab = '#93c5fd'; cVal = '#eff6ff';
          }
          
          drawReliefButton(40, y, statW, statH, false, cBg, cBord);
          ctx!.textAlign = 'center';
          ctx!.fillStyle = cLab;
          ctx!.font = labelFont;
          ctx!.fillText(stat.name, 40 + statW/2, y + labYOffset);
          ctx!.fillStyle = cVal;
          ctx!.font = valFont;
          ctx!.fillText(stat.val.toString().padStart(2, '0'), 40 + statW/2, y + valYOffset);
      });

      const rightX = canvas!.width - 40 - statW;
      
      const atkCX = rightX + (statW / 2);
      const atkRadius = 33;
      const atkCY = effY + atkRadius + 4; 
      
      drawSilverCircle(atkCX, atkCY, atkRadius, 5);
      ctx!.fillStyle = '#f8fafc';
      ctx!.font = `bold 18px 'Cinzel', serif`;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText(atkType, atkCX, atkCY + 2);

      const rightStatsStartY = atkCY + atkRadius + 12; 
      
      rightStats.forEach((stat, i) => {
          let y = rightStatsStartY + i * (statH + statGap);
          drawReliefButton(rightX, y, statW, statH, stat.isSpecial);
          ctx!.textAlign = 'center';
          ctx!.fillStyle = stat.isSpecial ? '#93c5fd' : '#cbd5e1';
          ctx!.font = labelFont;
          ctx!.fillText(stat.name, rightX + statW/2, y + labYOffset);
          ctx!.fillStyle = stat.isSpecial ? '#f8fafc' : '#ffffff';
          ctx!.font = valFont;
          ctx!.fillText(stat.val.toString().padStart(2, '0'), rightX + statW/2, y + valYOffset);
      });

      if (data.elementos.length > 0) {
          const mainCX = 75;
          const mainCY = 72.5;
          
          const primaryEl = ELEMENT_OPTIONS.find(e => e.name === data.elementos[0]);
          if (primaryEl) {
            drawSilverCircle(mainCX, mainCY, 32, 6);
            ctx!.fillStyle = '#f8fafc';
            ctx!.font = "26px 'Space Mono', monospace";
            ctx!.textBaseline = 'middle';
            ctx!.fillText(primaryEl.icon, mainCX, mainCY + 3);
          }
          
          for (let i = 1; i < data.elementos.length; i++) {
              const subEl = ELEMENT_OPTIONS.find(e => e.name === data.elementos[i]);
              if (subEl) {
                let subCY = mainCY + 55 + ((i - 1) * 45); 
                drawSilverCircle(mainCX, subCY, 19, 4); 
                ctx!.fillStyle = '#cbd5e1';
                ctx!.font = "16px 'Space Mono', monospace"; 
                ctx!.textBaseline = 'middle';
                ctx!.fillText(subEl.icon, mainCX, subCY + 2);
              }
          }
      }

      ctx!.fillStyle = '#0f172a';
      ctx!.font = "italic 19px 'Forum', serif";
      ctx!.textAlign = 'left';
      ctx!.textBaseline = 'alphabetic';
      wrapTextJustified(ctx!, effect, effX + 15, effY + 32, effW - 30, 24);
    }
  }, [data.nombre, data.clase, data.imagen, portadorData]); // Re-draw on name, class, image, or stats change

  return (
    <section className="animate-fade-in flex flex-col h-full flex-1 p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Canvas de la Carta (Izquierda) */}
        <div className="w-full md:w-[35%] flex flex-col items-center justify-start">
          <canvas 
            ref={canvasRef} 
            width={550} 
            height={850} 
            className="w-full h-auto rounded-[15px] drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-700/50"
          />

        </div>

        {/* Formulario de Datos (Derecha) */}
        <div className="w-full md:w-[65%] space-y-6">
          
          <div className="flex gap-4">
            <div className="group flex-1">
              <label className="block text-sm font-bold text-blue-400 mb-1 transition-colors">Nombre de la Entidad</label>
              <input 
                type="text" 
                maxLength={25}
                className="medieval-input focus:border-blue-500" 
                value={data.nombre} 
                onChange={e => updateData('nombre', e.target.value)} 
              />
            </div>
            
            <div className="group flex-1">
              <label className="block text-sm font-bold text-blue-400 mb-1 transition-colors">Clase</label>
              <select 
                className="medieval-input bg-[#1e1e23] focus:border-blue-500" 
                value={data.clase} 
                onChange={e => updateData('clase', e.target.value)}
              >
                {classConfig.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>


          <div className="group">
            <label className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-2 transition-colors">
              <Activity className="w-4 h-4" /> Tipo de Atacante
            </label>
            <div className="flex gap-4">
              {TIPO_ATACANTE_OPTIONS.map(tipo => (
                <button
                  key={tipo.name}
                  onClick={() => updateData('tipoAtacante', tipo.name)}
                  className={clsx(
                    "flex-1 flex flex-col items-center gap-2 p-3 rounded border transition-all duration-300 relative overflow-hidden",
                    data.tipoAtacante === tipo.name 
                      ? "bg-blue-900/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                      : "bg-[#1e1e23] border-gray-700 hover:border-blue-400/50 hover:bg-[#25252b]"
                  )}
                >
                  <img src={tipo.img} alt={tipo.name} className="w-10 h-10 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                  <span className={clsx(
                    "text-xs font-bold uppercase tracking-wider",
                    data.tipoAtacante === tipo.name ? "text-blue-300" : "text-gray-400"
                  )}>{tipo.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-blue-400 transition-colors">
                Elementos
              </label>
              <span className={clsx(
                "text-xs font-bold",
                data.elementos.length >= 8 ? "text-yellow-500" : "text-gray-500"
              )}>
                {data.elementos.length} / 8
              </span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-[#1a1a20] p-3 rounded border border-gray-800">
              {ELEMENT_OPTIONS.map(el => {
                const isSelected = data.elementos.includes(el.name);
                const canSelect = data.elementos.length < 8;
                
                return (
                  <button
                    key={el.name}
                    onClick={() => toggleElement(el.name)}
                    disabled={!isSelected && !canSelect}
                    title={el.name}
                    className={clsx(
                      "rounded-lg flex flex-col items-center justify-center p-1 transition-all duration-300 border-2 gap-1 overflow-hidden",
                      isSelected 
                        ? "bg-blue-900/30 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)] scale-105 z-10" 
                        : "bg-black/40 border-transparent hover:bg-gray-800 hover:border-gray-600 opacity-60 hover:opacity-100",
                      (!isSelected && !canSelect) && "cursor-not-allowed grayscale"
                    )}
                  >
                    <img src={el.img} alt={el.name} className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                    <span className="text-[8px] md:text-[9px] font-bold text-center leading-tight truncate w-full px-1">{el.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-1 transition-colors">
              <BookOpen className="w-4 h-4" /> Idea del Mazo
            </label>
            <textarea 
              rows={3} 
              className="medieval-input resize-none focus:border-blue-500" 
              value={data.ideaMazo} 
              onChange={e => updateData('ideaMazo', e.target.value)} 
            />
          </div>

        </div>
        
      </div>
    </section>
  );
}
