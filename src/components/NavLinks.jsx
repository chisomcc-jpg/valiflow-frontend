import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
  LifebuoyIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";

const links = [
  { name: "Översikt", href: "/dashboard", icon: HomeIcon },
  { name: "Kunder", href: "/dashboard/customers", icon: UserGroupIcon },
  { name: "Fakturor", href: "/dashboard/invoices", icon: DocumentDuplicateIcon },
  { name: "E-post", href: "/dashboard/email", icon: EnvelopeOpenIcon },
  { name: "Avvikelser", href: "/dashboard/fraud", icon: ExclamationTriangleIcon },
  { name: "Support", href: "/dashboard/support", icon: LifebuoyIcon },
];

export default function NavLinks() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col gap-1 bg-[#0A1E44] text-white min-h-screen py-6 px-3 font-medium">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive =
          pathname === link.href || pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            to={link.href}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200",
              isActive
                ? "bg-[#1E5CB3] text-white shadow-sm"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            )}
          >
            <LinkIcon
              className={clsx(
                "w-5 h-5 transition-colors",
                isActive ? "text-white" : "text-white/70"
              )}
            />
            <span>{link.name}</span>
          </Link>
        );
      })}

      {/* AI status footer */}
      <div className="mt-auto px-4 pt-6 border-t border-white/10">
        <p className="text-xs text-white/50">AI-synkroniserad ✅</p>
      </div>
    </nav>
  );
}
