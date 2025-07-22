import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "#/supabase";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setRole(data?.role);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          supabase
            .from("user_roles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => setRole(data?.role));
        } else {
          setRole(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, role }}>
      {children}
    </AuthContext.Provider>
  );
};

// =====================
// AUTH FUNCTIONS BELOW
// =====================

export const handleSignUp = async ({
  formData,
  role,
  navigate,
  setLoading,
  setError,
}) => {
  const {
    name,
    email,
    password,
    con_password,
    age,
    gender,
    lang,
    country,
    city,
  } = formData;

  if (!name || !email || !password || !con_password) {
    setError("Please fill in all required fields.");
    return;
  }

  if (password !== con_password) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, age, gender, role },
      },
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("User creation failed");

    // Add to `profiles` table
    await supabase.from("profiles").insert([
      {
        id: user.id,
        name,
        email,
        age,
        gender,
        lang,
        country,
        city,
        role,
      },
    ]);

    // Optional: add to roles table
    await supabase.from("user_roles").insert([{ id: user.id, role }]);

    toast.success("Account created! You can now log in.");
    toast("Use the email and password you just created to log in.", {duration: 40000});
    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);
    setError(error.message || "Failed to register");
  } finally {
    setLoading(false);
  }
};


export const handleSignIn = async ({
  email,
  password,
  navigate,
  setLoading,
}) => {
  setLoading(true);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Login successful");
    navigate("/form"); // Or redirect to role-based page if needed
  }

  setLoading(false);
};

export const handleLogout = async ({ navigate }) => {
  const id = toast.loading("Logging out...");

  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error("Failed to log out.", { id });
  } else {
    toast.success("Logged out.", { id });
    navigate("/login");
  }
};

export const handleForgotPassword = async (email) => {
  const id = toast.loading("Sending reset link...");

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    toast.error(error.message, { id });
  } else {
    toast.success("Password reset email sent.", { id });
  }
};
