export default function Header() {
  return (
    <header className="text-center mb-6 w-full animate-fade-in flex flex-col items-center">
      <img src="./img/Logo.png" alt="Rise of Avalon" className="mx-auto h-32 md:h-48 object-cover -my-6 md:-my-10 drop-shadow-[0_5px_15px_rgba(212,175,55,0.3)]" />
      <h2 className="font-cinzel text-xl md:text-2xl text-gray-300 tracking-[0.2em] relative z-10 mt-2">
        Character Maker
      </h2>
    </header>
  );
}
