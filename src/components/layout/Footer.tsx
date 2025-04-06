import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface FooterProps {
  companyName?: string;
  showLinks?: boolean;
}

const Footer = ({ 
  companyName = 'Zurince', 
  showLinks = true 
}: FooterProps) => {
  return (
    <footer className="border-t bg-muted">
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">{companyName}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Protecting what matters most with reliable insurance solutions.
            </p>
          </div>
          
          {showLinks && (
            <>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Products</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/insurance/home" className="text-muted-foreground transition-colors hover:text-foreground">
                      Home Insurance
                    </Link>
                  </li>
                  <li>
                    <Link to="/insurance/auto" className="text-muted-foreground transition-colors hover:text-foreground">
                      Auto Insurance
                    </Link>
                  </li>
                  <li>
                    <Link to="/insurance/life" className="text-muted-foreground transition-colors hover:text-foreground">
                      Life Insurance
                    </Link>
                  </li>
                  <li>
                    <Link to="/insurance/health" className="text-muted-foreground transition-colors hover:text-foreground">
                      Health Insurance
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="text-muted-foreground transition-colors hover:text-foreground">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="mt-6 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
