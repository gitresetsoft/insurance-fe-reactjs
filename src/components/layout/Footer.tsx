import React from 'react';
import { Link } from 'react-router-dom';
import zurinceLogo from '@/assets/_index';

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
      <div className="container px-4 py-6 md:px-6 md:py-4">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={zurinceLogo} alt="Zurince Logo" className="h-8 w-auto"/>
              <span className="text-lg font-bold">{companyName}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Protecting what matters most with reliable insurance solutions.
            </p>
          </div>
          
          {showLinks && (
            <>
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
        <div className="mt-2 border-t pt-2">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
