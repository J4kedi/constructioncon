import Link from "next/link";
import { Building2 } from "lucide-react"; 
import { roboto } from "./fonts";

export default function ConstructionconLogo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className={`${roboto.className} text-2x1 font-bold text-text`}>
                Constructions<span className="text-primary">Con</span>
            </span>
        </Link>
    );
}