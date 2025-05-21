import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const LoginModal = ({ isOpen, onClose, onRegisterClick }: LoginModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast({
        title: "Login Successful",
        description: "Welcome back to Grace Community Church.",
        variant: "default",
      });
      onClose();
      form.reset();
    } catch (error: any) {
      const errorMessage = error.message || "Invalid credentials. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Sign In</h3>
              <button
                onClick={onClose}
                className="text-white focus:outline-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-md font-medium transition-colors">
                    <i className="fas fa-user-circle mr-2"></i> Sign In
                  </button>
                  <button
                    className="flex-1 bg-white hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-md font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      onRegisterClick();
                    }}
                  >
                    <i className="fas fa-user-plus mr-2"></i> Register
                  </button>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-slate-700 font-medium mb-2">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Your email"
                              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-slate-700 font-medium mb-2">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Your password"
                              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id="remember-me"
                              />
                            </FormControl>
                            <FormLabel htmlFor="remember-me" className="text-slate-700">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="text-center text-slate-600 text-sm">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="text-purple-600 hover:text-purple-800"
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                      onRegisterClick();
                    }}
                  >
                    Register now
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
