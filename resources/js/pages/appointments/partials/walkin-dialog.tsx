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
type WalkinProps = {
    show: boolean;
    onClose: () => void;
    refetchBookings?: () => void;
};

export default function WalkinDialog({ show, onClose, refetchBookings }: WalkinProps) {
    const { item, setItem, errors, handleChange } = useHandleChange<WalkInPayload>({
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
            },
            onError: (error) => {
                if (error.response?.data?.errors) {
                    setItem((prev) => ({ ...prev, ...error?.response?.data.errors }));
                } else {
                    toast.error("An error occurred while creating the walk-in appointment.");
                }
            }
        });
    };

    return (
        <Dialog
            open={show}
            onOpenChange={onClose}
        >
            <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Add Walk-In Appointment</DialogTitle>
                    <DialogDescription>
                        This creates a new schedule for today and books the patient into it immediately.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_fname'>First Name</Label>
                        <Input id='walkin_fname' name='fname' value={item.fname} onChange={handleChange} />
                        <InputError message={errors.fname} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_mname'>Middle Name</Label>
                        <Input id='walkin_mname' name='mname' value={item.mname} onChange={handleChange} />
                        <InputError message={errors.mname} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_lname'>Last Name</Label>
                        <Input id='walkin_lname' name='lname' value={item.lname} onChange={handleChange} />
                        <InputError message={errors.lname} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_contact'>Contact No.</Label>
                        <Input id='walkin_contact' name='contact' value={item.contact} onChange={handleChange} maxLength={13} />
                        <InputError message={errors.contact} />
                    </div>
                    <div className='space-y-1 md:col-span-2'>
                        <Label htmlFor='walkin_email'>Email Address (optional)</Label>
                        <Input id='walkin_email' type='email' name='email' value={item.email} onChange={handleChange} />
                        <InputError message={errors.email} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_start_time'>Start Time</Label>
                        <Input id='walkin_start_time' type='time' name='start_time' value={item.start_time} onChange={handleChange} />
                        <InputError message={errors.start_time} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='walkin_end_time'>End Time</Label>
                        <Input id='walkin_end_time' type='time' name='end_time' value={item.end_time} onChange={handleChange} />
                        <InputError message={errors.end_time} />
                    </div>
                    <div className='space-y-1 md:col-span-2'>
                        <Label htmlFor='walkin_reason'>Reason for Appointment</Label>
                        <textarea
                            id='walkin_reason'
                            name='reason'
                            rows={4}
                            value={item.reason}
                            onChange={handleChange}
                            className='w-full rounded-md border border-sky-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none'
                        />
                        <InputError message={errors.reason} />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type='button'
                        variant='outline'
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
