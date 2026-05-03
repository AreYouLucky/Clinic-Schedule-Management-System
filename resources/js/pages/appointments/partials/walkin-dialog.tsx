import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { WalkInPayload } from '../hooks/hooks'
import { useHandleChange } from '@/hooks/use-handle-change'
import { useCreateWalkInAppointment } from '../hooks/hooks'
import { toast } from 'sonner'
import { CalendarPlus2, Clock3, UserRound } from 'lucide-react'

type WalkinProps = {
    show: boolean;
    onClose: () => void;
    refetchBookings?: () => void;
};

export default function WalkinDialog({ show, onClose, refetchBookings }: WalkinProps) {
    const { item, setItem, errors,setErrors, handleChange } = useHandleChange<WalkInPayload>({
        fname: "",
        lname: "",
        mname: "",
        email: "",
        contact: "",
        reason: "",
        start_time: "",
        end_time: "",
    });
    const createWalkIn = useCreateWalkInAppointment();
    const createWalkinFn = async () => {
        await createWalkIn.mutateAsync(item, {
            onSuccess: () => {
                onClose();
                refetchBookings?.();
                toast.success("Walk-in appointment created successfully.");
                setItem({
                    fname: "",
                    lname: "",
                    mname: "",
                    email: "",
                    contact: "",
                    reason: "",
                    start_time: "",
                    end_time: "",
                });
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setErrors((prev) => ({ ...prev, ...error?.response?.data.errors }));
                } else {
                    toast.error(error.response?.data?.message || "An error occurred while creating the walk-in appointment.");
                }
            }
        });
    };

    return (
        <Dialog
            open={show}
            onOpenChange={() => { }}
        >
            <DialogContent className='overflow-hidden border-sky-200 p-0 sm:max-w-2xl '>
                <div className='bg-sky-700 px-6 py-5 text-white'>
                    <DialogHeader className='text-left'>
                        <DialogTitle className='text-xl font-semibold text-white'>Add Walk-In Appointment</DialogTitle>
                        <DialogDescription className='text-sm text-sky-50/85'>
                            Create a same-day appointment and assign the patient to a new walk-in slot.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className='space-y-6 p-6 text-sm'>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <div className='grid gap-2'>
                            <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_fname'>First Name</Label>
                            <Input id='walkin_fname' name='fname' className='border-sky-200' value={item.fname} onChange={handleChange} />
                            <InputError message={errors.fname} />
                        </div>
                        <div className='grid gap-2'>
                            <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_mname'>Middle Name</Label>
                            <Input id='walkin_mname' name='mname' className='border-sky-200' value={item.mname} onChange={handleChange} />
                            <InputError message={errors.mname} />
                        </div>
                        <div className='grid gap-2'>
                            <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_lname'>Last Name</Label>
                            <Input id='walkin_lname' name='lname' className='border-sky-200' value={item.lname} onChange={handleChange} />
                            <InputError message={errors.lname} />
                        </div>
                        <div className='grid gap-2'>
                            <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_contact'>Contact No.</Label>
                            <Input id='walkin_contact' name='contact' className='border-sky-200' value={item.contact} onChange={handleChange} maxLength={13} />
                            <InputError message={errors.contact} />
                        </div>
                        <div className='grid gap-2 md:col-span-2'>
                            <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_email'>Email Address (optional)</Label>
                            <Input id='walkin_email' type='email' name='email' className='border-sky-200' value={item.email} onChange={handleChange} />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    <div className='rounded-2xl border border-sky-100 bg-slate-50 p-4'>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='grid gap-2'>
                                <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_start_time'>Start Time</Label>
                                <Input id='walkin_start_time' type='time' name='start_time' className='border-sky-200 bg-white' value={item.start_time} onChange={handleChange} />
                                <InputError message={errors.start_time} />
                            </div>
                            <div className='grid gap-2'>
                                <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_end_time'>End Time</Label>
                                <Input id='walkin_end_time' type='time' name='end_time' className='border-sky-200 bg-white' value={item.end_time} onChange={handleChange} />
                                <InputError message={errors.end_time} />
                            </div>
                        </div>
                    </div>

                    <div className='grid gap-2'>
                        <Label className='text-sm font-semibold text-slate-700' htmlFor='walkin_reason'>Reason for Appointment</Label>
                        <textarea
                            id='walkin_reason'
                            name='reason'
                            rows={4}
                            value={item.reason}
                            onChange={handleChange}
                            className='w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none'
                        />
                        <InputError message={errors.reason} />
                    </div>
                </div>

                <DialogFooter className='border-t border-sky-100 bg-slate-50 px-6 py-4'>
                    <Button
                        type='button'
                        variant='outline'
                        className='border-sky-200 text-sky-700 hover:bg-sky-50'
                        onClick={() => {
                            onClose();
                            setItem({
                                fname: "",
                                lname: "",
                                mname: "",
                                email: "",
                                contact: "",
                                reason: "",
                                start_time: "",
                                end_time: "",
                            });
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        type='button'
                        className='bg-sky-600 hover:bg-sky-700 text-white'
                        onClick={createWalkinFn}
                        disabled={createWalkIn.isPending}
                    >
                        Add Walk-In
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
