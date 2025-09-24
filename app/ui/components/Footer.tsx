import Link from "next/link";
import ConstructionconLogo from "./constructioncon-logo";

export default function Footer() {
    return (
        <footer id="contact" className="bg-secondary/20 border-t border-secondary/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                <ConstructionconLogo />
                <p className="mt-4 text-text/70 max-w-sm">
                    Software de gestão de obras para construtoras de médio e pequeno porte.
                </p>
                </div>
                <div>
                <h3 className="font-semibold text-text">Navegação</h3>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#features" className="text-text/80 hover:text-primary">Funcionalidades</Link></li>
                    <li><Link href="#testimonials" className="text-text/80 hover:text-primary">Depoimentos</Link></li>
                    <li><Link href="#pricing" className="text-text/80 hover:text-primary">Preços</Link></li>
                </ul>
                </div>
                <div>
                <h3 className="font-semibold text-text">Legal</h3>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#" className="text-text/80 hover:text-primary">Política de Privacidade</Link></li>
                    <li><Link href="#" className="text-text/80 hover:text-primary">Termos de Serviço</Link></li>
                </ul>
                </div>
            </div>
            <div className="mt-10 border-t border-secondary/30 pt-8 text-center text-text/60">
                <p>&copy; {new Date().getFullYear()} ConstructionCon. Todos os direitos reservados.</p>
            </div>
            </div>
        </footer>
    );
}