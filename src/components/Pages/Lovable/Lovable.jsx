import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";
const loginSchema = z.object({
  email: z.string().email({
    message: "Email inválido"
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres"
  })
});
const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres"
  }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});
const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    signIn,
    signUp,
    user,
    resetPassword,
    updatePassword,
    approved,
    approvalStatus,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  const status = searchParams.get("status");
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode === "reset") {
      setActiveTab("reset-confirm");
    }
  }, [mode]);

  // Redirect if already logged in and approved
  if (user && approved && approvalStatus === "approved") {
    navigate("/");
    return null;
  }

  // Show pending approval message
  if (user && !approved && status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Solicitud Enviada</h1>
            <p className="text-muted-foreground">
              Tu solicitud de acceso ha sido enviada exitosamente. Un administrador 
              revisará tu cuenta y te notificará una vez sea aprobada.
            </p>
            <p className="text-sm text-muted-foreground">
              Por favor, revisa tu correo electrónico para más información.
            </p>
            <Button onClick={() => navigate("/auth")} variant="outline" className="w-full">
              Volver al inicio de sesión
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show rejected message
  if (user && status === "rejected") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Acceso Denegado</h1>
            <p className="text-muted-foreground">
              Tu solicitud de acceso ha sido rechazada. Si crees que esto es un error,
              por favor contacta al administrador del sistema.
            </p>
            <Button onClick={() => navigate("/auth")} variant="outline" className="w-full">
              Volver al inicio de sesión
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  const handleLogin = async () => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")
    try {
      const validation = loginSchema.parse({
        email,
        password
      });
      const {
        error
      } = await signIn(validation.email, validation.password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Inicio de sesión exitoso");
        navigate("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async () => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")
    const password = formData.get("password")
    const fullName = formData.get("fullName")
    const confirmPassword = formData.get("confirmPassword")
    try {
      const validation = signupSchema.parse({
        email,
        password,
        fullName,
        confirmPassword
      });
      const {
        error
      } = await signUp(validation.email, validation.password, validation.fullName);
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email ya está registrado");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Registro exitoso. Tu solicitud está siendo revisada.");
        // Redirect to pending status page
        setTimeout(() => {
          navigate("/auth?status=pending");
        }, 1500);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") 

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Se ha enviado un enlace de recuperación a tu email");
        setActiveTab("login");
      }
    } catch (error) {
      toast.error("Error al enviar el enlace de recuperación");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Contraseña actualizada exitosamente");
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">DDI Pro</h1>
          <p className="text-muted-foreground">Sistema de Gestión de GAP</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
            <TabsTrigger value="reset">Recuperar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="tu@email.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input id="login-password" name="password" type="password" placeholder="••••••••" required />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
                {loading ? "Cargando..." : "Iniciar Sesión"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("reset")}
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nombre Completo</Label>
                <Input id="signup-name" name="fullName" type="text" placeholder="Juan Pérez" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" placeholder="tu@email.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input id="signup-password" name="password" type="password" placeholder="••••••••" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirmar Contraseña</Label>
                <Input id="signup-confirm" name="confirmPassword" type="password" placeholder="••••••••" required />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
                {loading ? "Cargando..." : "Registrarse"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Tu cuenta será revisada por un administrador antes de otorgar acceso
              </p>
            </form>
          </TabsContent>

          <TabsContent value="reset">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" name="email" type="email" placeholder="tu@email.com" required />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Recibirás un enlace para restablecer tu contraseña en tu correo electrónico
              </p>
            </form>
          </TabsContent>

          {mode === "reset" && (
            <TabsContent value="reset-confirm">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input id="new-password" name="password" type="password" placeholder="••••••••" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirmar Contraseña</Label>
                  <Input id="confirm-new-password" name="confirmPassword" type="password" placeholder="••••••••" required />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar Contraseña"}
                </Button>
              </form>
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>;
};
export default Auth;