import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Heart,
  ChevronDown,
  BookOpen,
  List,
  PlusCircle,
  Share2,
  Tag,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '../components/ui/navigation-menu';

import { Button } from './ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

export default function Header({ darkMode }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const devocionalLinks = useMemo(
    () => [
      { to: '/devocionais/nova', label: 'Criar Devocional', icon: PlusCircle },
      { to: '/devotionals', label: 'Listar Devocionais', icon: List },
      { to: '/devocionais/partilhados', label: 'Partilhados', icon: Share2 },
      { to: '/devocionais/gerar', label: 'gerar', icon: Share2 },
      { to: '/devocionais/categorias', label: 'Categorias', icon: Tag }
    ],
    []
  );



  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("auth:changed", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("auth:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    // se você salva user também:
    localStorage.removeItem('usuario');

    window.dispatchEvent(new Event('auth:changed'));
    setOpen(false);
    navigate('/auth/login');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ${darkMode
        ? 'bg-slate-900/95 border-slate-800 shadow-lg shadow-slate-900/50'
        : 'bg-white/95 border-gray-200 shadow-sm'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* ---------------- LADO ESQUERDO ---------------- */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* MOBILE: TRIGGER */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-transparent -ml-2">
                    <Menu className={`h-7 w-7 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className={`w-[280px] p-0 border-r ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'
                    }`}
                >
                  <div className="flex flex-col h-full">
                    {/* Cabeçalho do Menu */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-indigo-600 fill-current" />
                      <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Menu
                      </span>
                    </div>

                    {/* Links */}
                    <div className="flex-1 overflow-y-auto p-4">
                      <nav className="flex flex-col gap-1">
                        <NavLink
                          to="/"
                          onClick={() => setOpen(false)}
                          className="flex items-center p-3 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          Home
                        </NavLink>

                        {/* Acordeão Devocional */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => setMobileDevOpen((v) => !v)}
                            className="flex items-center justify-between p-3 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                            type="button"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-4 w-4 text-indigo-600" /> Devocional
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${mobileDevOpen ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${mobileDevOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                          >
                            <div className="pl-9 flex flex-col gap-1 mt-1">
                              {devocionalLinks.map((link) => (
                                <NavLink
                                  key={link.to}
                                  to={link.to}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-3 p-2.5 text-xs font-semibold text-slate-500 hover:text-indigo-600"
                                >
                                  <link.icon className="h-3.5 w-3.5" /> {link.label}
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        </div>

                        <NavLink
                          to="/sobre"
                          onClick={() => setOpen(false)}
                          className="flex items-center p-3 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          Sobre nós
                        </NavLink>


                        {/* Perfil só se logado */}
                        {isAuthenticated && (
                          <NavLink
                            to="/perfil"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 p-3 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <User className="h-4 w-4 text-indigo-600" /> Perfil
                          </NavLink>
                        )}
                      </nav>
                    </div>

                    {/* Footer do Menu Mobile */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      {!isAuthenticated ? (
                        <div className="flex flex-col gap-3">
                          <NavLink to="/auth/login" onClick={() => setOpen(false)}>
                            <Button variant="outline" className="w-full font-bold">
                              Entrar
                            </Button>
                          </NavLink>
                          <NavLink to="/auth/register" onClick={() => setOpen(false)}>
                            <Button className="w-full font-bold bg-indigo-600 text-white shadow-md shadow-indigo-200">
                              Criar Conta
                            </Button>
                          </NavLink>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={logout}
                            className="w-full font-bold bg-slate-900 text-white dark:bg-indigo-600"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* LOGO */}
            <NavLink to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
              <div className="p-2 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/20">
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span
                className={`text-xl font-black tracking-tight hidden xs:block ${darkMode ? 'text-slate-100' : 'text-gray-900'
                  }`}
              >
                Devocional<span className="text-indigo-600">App</span>
              </span>
            </NavLink>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center ml-4">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-1">
                  <NavigationMenuItem>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `px-4 py-2 text-sm font-bold transition-colors ${isActive ? 'text-indigo-600' : darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`
                      }
                    >
                      Home
                    </NavLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-sm font-bold">
                      <BookOpen className="mr-2 h-4 w-4" /> Devocional
                    </NavigationMenuTrigger>

                    <NavigationMenuContent
                      className={`absolute w-[240px] p-2 rounded-xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                        }`}
                    >
                      <ul className="grid gap-1">
                        {devocionalLinks.map((link) => (
                          <li key={link.to}>
                            <NavigationMenuLink asChild>
                              <NavLink
                                to={link.to}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                              >
                                <link.icon className="h-4 w-4" /> {link.label}
                              </NavLink>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavLink to="/sobre" className="px-4 py-2 text-sm font-bold">
                      Sobre nós
                    </NavLink>
                  </NavigationMenuItem>

                  {/* Perfil no desktop só se logado */}
                  {isAuthenticated && (
                    <NavigationMenuItem>
                      <NavLink to="/perfil" className="px-4 py-2 text-sm font-bold">
                        Perfil
                      </NavLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* ---------------- LADO DIREITO ---------------- */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop: Auth ou Perfil */}
            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink
                  to="/auth/login"
                  className={`text-sm font-bold px-3 py-2 transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  Entrar
                </NavLink>

                <NavLink to="/auth/register">
                  <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 dark:bg-indigo-600 dark:shadow-none">
                    Registar
                  </button>
                </NavLink>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate('/perfil')}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${darkMode
                    ? 'border-slate-800 bg-slate-800 text-slate-400 hover:border-indigo-500'
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-600'
                    }`}
                  title="Meu perfil"
                >
                  <User className="h-5 w-5" />
                </button>

                <button
                  onClick={logout}
                  className={`h-10 px-4 rounded-full text-sm font-bold inline-flex items-center gap-2 border transition-all ${darkMode
                    ? 'border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            )}

            {/* Separador (desktop) */}
            <div className="hidden sm:block h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Mobile: atalho rápido */}
            <button
              onClick={() => (isAuthenticated ? navigate('/perfil') : navigate('/auth/login'))}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all lg:hidden ${darkMode
                ? 'border-slate-800 bg-slate-800 text-slate-400 hover:border-indigo-500'
                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-600'
                }`}
              title={isAuthenticated ? 'Perfil' : 'Entrar'}
            >
              {isAuthenticated ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
