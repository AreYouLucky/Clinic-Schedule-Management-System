import AppLogoIcon from '@/components/app-logo-icon';
import { type AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#faf4fb]  to-[#d8f5f0] p-6 md:p-10">
            <div className="w-full max-w-md rounded-xl border border-[#ead7eb] bg-white px-10 py-10 shadow-lg">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col items-center">
                        <div
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex items-center justify-center rounded-md">
                                <AppLogoIcon className="h-20" />
                            </div>
                        </div>

                        <div className="space-y-1 text-center">
                            <p className="text-center text-sm text-[#78297c]">
                               Sign in to your account
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
