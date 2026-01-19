// export default function Footer() {
//   return (
//     <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400">
//       © 2026 DevocionalApp. Todos os direitos reservados.
//     </footer>
//   );
// }
export default function Footer() {
  const footerSections = [
    {
      title: 'Sobre',
      links: [
        { name: 'Quem Somos', href: '/quem-somos' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contato', href: '/contato' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { name: 'Ajuda', href: '/ajuda' },
        { name: 'Criar Devocional', href: '/criar-devocional' },
        { name: 'Fale Conosco', href: '/fale-conosco' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Termos de Uso', href: '/termos' },
        { name: 'Política de Privacidade', href: '/privacidade' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-white font-semibold mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-sm">
        © 2026 DevocionalApp. Todos os direitos reservados.
      </p>
    </footer>
  );
}
