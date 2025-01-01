"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail } from "lucide-react";
import { api_url } from "@/utils/globalVariables";
import { AlertDestructive } from "@/components/alerts/AlertDestructive";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/reducers/authReducer";
import IUser from "@/types/User";
import { RootState } from "@/store/store";

export default function AuthPage() {
  const dispatch = useDispatch();
  const {user_id, access_token} = useSelector((state: RootState) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if(user_id && access_token){
    router.back();
  }

  // Login handler
  const handleLogin = async () => {
    setErrorMsg("");
    try {
      setLoading(true);
      const response = await fetch(`${api_url}/UserIdentity/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMsg("Invalid email or password");
          throw new Error("Invalid email or password");
        }
        const errorData = await response.json();
        setErrorMsg("Login failed: " + (errorData.message || "Unknown error"));
        console.log("Login failed", errorData);
        throw new Error("Login failed: " + (errorData.message || "Unknown error"));
      }
      const data = await response.json();
      const user: IUser = data.user;
      const token = data.token;
      dispatch(login({client_id: user.id, access: token, email: user.email, usernane: user.userName, profile_pic: user.profilePicture || ""}));
      router.push("/");
    } catch (error) {
      console.log("Unexpected error", error);
    }finally{
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${api_url}/UserIdentity/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          userName: username,
          password: password,
          userType: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Registration failed", errorData);
        throw new Error("Registration failed: " + (errorData || "Unknown error"));
      }

      const data = await response.json();
      const user: IUser = data.user;
      const token = data.token;
      dispatch(login({client_id: user.id, access: token, email: user.email, usernane: user.userName, profile_pic: user.profilePicture || ""}));
      router.push("/"); // Redirect to home page
    } catch (error) {
      console.error("Registration failed", error);
      setErrorMsg("Registration failed: " + error);
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle login or register based on the form state
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center">
      {
        errorMsg &&
        <div className="w-full max-w-md mb-4">
          <AlertDestructive message={errorMsg} />
        </div>
      }
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to join Nexus"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="credentials">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading? "loading..." : isLogin ? "Login" : "Register"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="social">
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  {isLogin ? "Login" : "Register"} with GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  {isLogin ? "Login" : "Register"} with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Register" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}