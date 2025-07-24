import { Building2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

interface PlaceholderPageProps {
  title: string;
  description: string;
  suggestion?: string;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  suggestion = "Continue prompting to fill in this page content!" 
}: PlaceholderPageProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Content */}
          <div className="bg-white border border-border rounded-xl p-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{description}</p>
            
            <div className="bg-accent/50 border border-border rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> {suggestion}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Current path: {location.pathname}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                to="/admin"
                className="border border-border text-foreground px-6 py-3 rounded-lg hover:bg-accent transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
