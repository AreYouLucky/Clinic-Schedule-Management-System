import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { IoIosSettings } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";
import { Label } from "@/components/ui/label";
import { useHandleChange } from "@/hooks/use-handle-change";
import { FaRegSave } from "react-icons/fa";
import { useState } from "react";
import axios from 'axios';
import ConfirmationDialog from '@/components/custom/confirmation-dialog';
import Cropper from "react-easy-crop";
import { type Area } from "react-easy-crop";
import { MdOutlineChangeCircle } from "react-icons/md";


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Settings', href: '/Settings' },
];

function SettingsPage() {
    const { auth } = usePage<SharedData>().props;
    const user: User = auth.user;
    const { item, errors, handleChange, setItem, setErrors } = useHandleChange({
        email: user.email ?? '',
        username: user.username ?? '',
        password: '',
        password_confirmation: '',
    });
    const getInitials = useInitials();
    const [successDialog, setSuccessDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState<User>(user);
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropper, setShowCropper] = useState<boolean>(false);

    const [tab, setTab] = useState<'profile' | 'password'>('profile');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const updatePassword = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('password', item.password);
        formData.append('password_confirmation', item.password_confirmation);
        axios.post('/update-password', formData).then(
            (res) => {
                setItem((prev) => ({ ...prev, password: '', password_confirmation: '' }))
                setMessage(res.data.status)
                setSuccessDialog(true)
                setLoading(false)
            }
        ).catch((err) => {
            setErrors(err.response.data.errors)
            setLoading(false)
        })
    }
    const updateProfile = () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('username', item.username);
        formData.append('email', item.email);
        axios.post('/update-profile', formData).then(
            (res) => {
                setMessage(res.data.status)
                setCurrentUser({ ...currentUser, name: item.username, email: item.email })
                setSuccessDialog(true)
                setLoading(false)
            }
        ).catch((err) => {
            setErrors(err.response.data.errors)
            setLoading(false)
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        setShowCropper(true);
    };
    const onCropComplete = (_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    };


    const handleUploadProfile = async (): Promise<void> => {
        if (!image || !croppedAreaPixels) return;

        try {
            const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);

            const formData = new FormData();
            formData.append("image", croppedImageBlob, "profile.png");
            await axios.post("/update-profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then(() => {
                window.location.reload();
            });
            setShowCropper(false);
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    const getCroppedImg = (imageSrc: string, crop: Area): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.src = imageSrc;

            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (!ctx) return reject("2D context not supported");

                canvas.width = crop.width;
                canvas.height = crop.height;

                ctx.drawImage(
                    image,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );

                canvas.toBlob((blob) => {
                    if (!blob) return reject("Canvas is empty");
                    resolve(blob);
                }, "image/png");
            };

            image.onerror = () => reject("Failed to load image");
        });
    };




    return (
        <>
            <Head title="Settings" />

            <div className="py-6 px-8 flex flex-col gap-4">
                <div className="w-full flex items-center justify-between px-6 py-4 rounded-lg shadow-sm bg-sky-600">
                    <h1 className="text-white poppins-bold flex items-center gap-2 text-lg md:text-xl">
                        <IoIosSettings /> Profile Settings
                    </h1>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-linear-to-br from-sky-600 to-sky-500 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex justify-center flex-col items-center p-6 gap-4">
                        <div className='relative'>
                            <Avatar className="h-40 w-40 border-8">
                                <AvatarImage src={user.avatar && `/storage/${user.avatar}`} alt={user.username} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-black inter-bold text-4xl">
                                    {getInitials(currentUser.username)}
                                </AvatarFallback>
                            </Avatar>
                            <label className='absolute right-2 bottom-2 cursor-pointer' data-popover-target="popover-default">
                                <MdOutlineChangeCircle className='text-3xl text-sky-500 bg-white rounded-full' />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <div className="text-center text-white">
                            <p className="text-xl font-semibold inter-semibold truncate uppercase">{currentUser.username}</p>
                            <p className="text-gray-200 text-sm truncate">{currentUser.email}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white rounded-2xl shadow-md hover:shadow-lg py-10 px-16 flex flex-col">
                        <div className="flex border-b mb-6">
                            <button
                                onClick={() => setTab('profile')}
                                className={`px-4 py-2 -mb-px font-semibold border-b-2 transition cursor-pointer ${tab === 'profile'
                                    ? 'border-sky-700 text-sky-700'
                                    : 'border-transparent text-gray-500 hover:text-sky-500'
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setTab('password')}
                                className={`px-4 py-2 -mb-px font-semibold border-b-2 transition cursor-pointer ${tab === 'password'
                                    ? 'border-sky-700 text-sky-700'
                                    : 'border-transparent text-gray-500 hover:text-sky-500'
                                    }`}
                            >
                                Password
                            </button>
                        </div>

                        {tab === 'profile' && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username" className="text-gray-700">Username</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={String(item.username ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.username as string} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={String(item.email ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.email as string} />
                                </div>
                                <Button className="self-start mt-2 bg-sky-500 py-2" onClick={updateProfile} disabled={loading}><FaRegSave /> Save Profile</Button>
                            </div>
                        )}

                        {tab === 'password' && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="password" className="text-gray-700">New Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={String(item.password ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.password as string} />
                                </div>
                                <div className="grid gap-1">
                                    <Label htmlFor="password_confirmation" className="text-gray-700">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={String(item.password_confirmation ?? '')}
                                        onChange={handleChange}
                                        className="border-gray-300"
                                    />
                                    <InputError message={errors.password_confirmation as string} />
                                </div>
                                <Button className="self-start mt-2 md:col-span-2 bg-sky-500 py-2" onClick={updatePassword} disabled={loading}><FaRegSave /> Save Password</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmationDialog show={successDialog} onClose={() => setSuccessDialog(false)} type={1} message={message} />
            {showCropper && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 z-50 flex flex-col items-center justify-center p-4">
                    <div className="p-8 bg-white rounded-lg">
                        <div className="relative md:w-162.4 md:h-162.4  w-74 h-74  bg-white rounded-lg p-4 overflow-hidden">
                            <Cropper
                                image={image ?? undefined}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />

                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button onClick={handleUploadProfile} className="px-4 py-2 bg-sky-500 text-white rounded-lg">Update Profile</Button>
                            <Button onClick={() => setShowCropper(false)} className="px-4 py-2 bg-gray-200 rounded-lg border">Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

SettingsPage.layout = (page: React.ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default SettingsPage;
