import AuthLayout from "@/layouts/auth-layout";
import InputError from "@/components/input-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useHandleChange } from "@/hooks/use-handle-change";
import { useFormSubmit } from "@/hooks/auth-form-submission";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"
import axios from "axios";

function AuthPage() {
    const { item, errors, handleChange, setErrors } = useHandleChange({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const handleSubmit = () => {
        setLoading(true);
        axios.post('/request-login', item).then((res) => {
            toast.success(res.data.status);
            window.location.href = "/dashboard"
            setLoading(false);
        }).catch((err) => {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            toast.error("Invalid Credentials");
            setLoading(false);
        })
    }
    const [showPassword, setShowPassword] = useState(false);
    return (

        <>
            <div className="grid gap-6 py-4 ">
                <div className="grid gap-2">
                    <Label htmlFor="username" className="text-gray-600">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        required
                        autoComplete="username"
                        placeholder="Username"
                        onChange={handleChange}
                        value={item.username ?? ''}
                        className="text-gray-500 bg-gray-50"
                    />
                    <InputError message={errors.username ?? ''} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password" className="text-gray-600">Password</Label>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        autoComplete="current-password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={item.password ?? ''}
                        className="text-gray-500 bg-gray-50"
                    />
                    <InputError message={errors.password ?? ''} />
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox
                        id="showPassword"
                        checked={Boolean(showPassword)}
                        onCheckedChange={(checked: boolean) => setShowPassword(Boolean(checked))}
                    />
                    <Label htmlFor="remember" className="text-gray-600">Show Password</Label>
                </div>

                <Button type="submit" className="mt-2 w-full bg-blue-400 text-white hover:bg-gray-600" disabled={loading} onClick={handleSubmit}>
                    {loading && <Spinner className="mr-2" />}
                    Log in
                </Button>
            </div>
        </>
    )
}

AuthPage.layout = (page: React.ReactNode) => <AuthLayout children={page} />
export default AuthPage;
