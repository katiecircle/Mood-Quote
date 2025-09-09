import { Link } from "wouter";

export function Header() {
  return (
    <header className="relative z-10 w-full px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">M</span>
          </div>
          <span className="text-xl font-semibold text-foreground">MoodQuote</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
            About
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
