import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ className=" w-52 " }: { className?: string }) {
    return (
        <>
            <div className="flex ">
                <AppLogoIcon className={` px-2 ${className}`} />
            </div>
        </>
    );
}
