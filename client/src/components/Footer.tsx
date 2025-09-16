import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Infinite News</h3>
            <p className="text-muted-foreground mb-4">
              Your trusted source for breaking news, in-depth analysis, and comprehensive coverage
              across all major categories.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" data-testid="button-social-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-youtube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/politics" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-politics">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-sports">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/category/tech" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-tech">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/entertainment" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-entertainment">
                  Entertainment
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Infinite News. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}