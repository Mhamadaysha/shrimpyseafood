import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <h1 className="font-heading text-2xl font-bold text-card-foreground mb-6 text-center">
            {isSignUp ? "Create Account" : "Admin Login"}
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-semibold text-card-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground font-body focus:ring-2 focus:ring-ocean focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ocean text-ocean-foreground px-6 py-3 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
            >
              {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4 font-body">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-ocean hover:underline font-semibold"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
