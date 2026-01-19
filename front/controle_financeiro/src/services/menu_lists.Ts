import { useState, useEffect } from "react";
import {
  Tag,
  Users,
  Settings,
  SquarePen,
  LayoutGrid,
  LucideIcon,
} from "lucide-react";
import { parseJwt } from "./jwt";

type Submenu = { href: string; label: string; active?: boolean };
type Menu = { href: string; label: string; active?: boolean; icon: LucideIcon; submenus?: Submenu[] };
type Group = { groupLabel: string; menus: Menu[] };

export function useMenuList() {
  const [menuList, setMenuList] = useState<Group[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    let role: string | null = null;
    try {
      const usuario = parseJwt(token);
      role = usuario?.perfil?.toUpperCase() ?? null;
    } catch {
      role = null;
    }

    const isAdmin = role === "ADMIN";
    const isComerciante = role === "COMERCIANTE";

    const groups: Group[] = [];

    // Dashboard só para admin
    if (isAdmin) {
      groups.push({
        groupLabel: "",
        menus: [
          {
            href: "/dashboard/dashboard",
            label: "Dashboard",
            icon: LayoutGrid,
            submenus: [
              { href: "/dashboard", label: "Dashboard" },
              { href: "/taxa", label: "Taxas" },
              { href: "/usuarios", label: "Usuários" },
              { href: "/relatorio", label: "Relatórios" },
            ],
          },
        ],
      });
    } else {
      groups.push({ groupLabel: "", menus: [] });
    }

    // Conteúdos visíveis para todos
    groups.push({
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Pagamento",
          icon: SquarePen,
          submenus: [
            { href: "/pagamento", label: "Pagamento" },
            { href: "/pagamentos", label: "Históricos" },
          ],
        },
      ],
    });

    // Configurações
    groups.push({
      groupLabel: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          icon: Settings,
        },
      ],
    });

    // Menus de comerciante
    if (isComerciante) {
      groups.push({
        groupLabel: "Comerciante",
        menus: [
          { href: "/meus-produtos", label: "Meus Produtos", icon: Tag },
          { href: "/clientes", label: "Clientes", icon: Users },
        ],
      });
    }

    setMenuList(groups);
  }, []);

  return menuList;
}
