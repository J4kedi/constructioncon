import ConstructionconLogo from "../components/constructioncon-logo";
import { Navigation } from "@/app/ui/components/Navigation";
import { mainNavLinks } from "@/app/lib/constants";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-gradient-to-b from-background to-secondary/5 dark:from-background dark:to-secondary/10 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <ConstructionconLogo />
                    <Navigation
                        links={mainNavLinks}
                        navClassName="hidden md:flex md:items-center md:space-x-8"
                        linkClassName="text-text hover:text-primary transition-colors"
                    />
                    <ThemeSwitcher />
                    <div className="flex items-center space-x-4">
                        <Link 
                            href={"/contact"}
                            className="hidden sm:inline-block bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-accent transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                        Solicitar Demonstração
                        </Link>
                        <button className="md:hidden p-2 rounded-md text-text hover:bg-secondary/20">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}