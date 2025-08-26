import ConstructionconLogo from "../constructioncon-logo";
import { Navigation } from "@/app/ui/components/Navigation";
import { mainNavLinks } from "@/app/lib/data";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Header() {
    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <ConstructionconLogo />
                    <Navigation
                        links={mainNavLinks}
                        navClassName="hidden md:flex md:items-center md:space-x-8"
                        linkClassName="text-text hover:text-primary transition-colors"
                    />
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}