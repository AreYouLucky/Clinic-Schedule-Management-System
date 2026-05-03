import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Booking } from '@/types/models'
import { CreditCard } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'

type UpdateStatusMutation = UseMutationResult<
    unknown,
    unknown,
    { id: number; status: number; paid_amount?: number | null },
    unknown
>;

type PaymentDialogProps = {
    paymentBooking: Booking | null;
    setPaymentBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
    paidAmount: string;
    setPaidAmount: React.Dispatch<React.SetStateAction<string>>;
    confirmPayment: () => void;
    updateStatus: UpdateStatusMutation;
};

export default function PaymentDialog({
    paymentBooking,
    setPaymentBooking,
    paidAmount,
    setPaidAmount,
    confirmPayment,
    updateStatus
}: PaymentDialogProps) {
    return (
        <Dialog
            open={paymentBooking !== null}
            onOpenChange={(open) => {
                if (!open) {
                    setPaymentBooking(null);
                    setPaidAmount("");
                }
            }}
        >
            <DialogContent className='overflow-hidden border-sky-200 p-0 sm:max-w-lg'>
                <div className='relative overflow-hidden bg-sky-700 px-6 py-5 text-white'>
                    <div className='absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl' />
                    <div className='absolute bottom-0 right-0 h-20 w-20 translate-x-8 translate-y-8 rounded-full bg-cyan-300/20 blur-2xl' />
                    <DialogHeader className='relative text-left'>
                        <DialogTitle className='text-xl font-semibold text-white'>Mark Appointment as Paid</DialogTitle>
                        <DialogDescription className='text-sm text-sky-50/85'>
                            Enter the amount received before moving this appointment to the paid status.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className='space-y-5 p-6'>
                    {paymentBooking && (
                        <div className='rounded-2xl border border-sky-100 bg-sky-50/70 p-4'>
                            <div className='flex items-start justify-between gap-4'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-sky-600'>Patient</p>
                                    <p className='mt-2 text-lg font-semibold text-slate-900'>
                                        {paymentBooking.lname}, {paymentBooking.fname}{paymentBooking.mname ? ` ${paymentBooking.mname}` : ""}
                                    </p>
                                    <p className='mt-1 text-sm text-slate-500'>Schedule Code: {paymentBooking.schedule_code}</p>
                                </div>
                                <div className='rounded-2xl bg-white p-3 text-cyan-600 shadow-sm'>
                                    <CreditCard size={20} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='grid gap-2'>
                        <Label htmlFor='paid_amount' className='text-sm font-semibold text-slate-700'>Amount Paid</Label>
                        <div className='relative'>
                            <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-slate-500'>
                                PHP
                            </span>
                            <Input
                                id='paid_amount'
                                type='number'
                                min='0'
                                step='0.01'
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                placeholder='0.00'
                                className='h-12 border-sky-200 bg-white pl-14 text-base'
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className='border-t border-sky-100 bg-slate-50 px-6 py-4'>
                    <Button
                        type='button'
                        variant='outline'
                        className='border-sky-200 text-sky-700 hover:bg-sky-50'
                        onClick={() => {
                            setPaymentBooking(null);
                            setPaidAmount("");
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        type='button'
                        className='bg-cyan-600 text-white hover:bg-cyan-700'
                        onClick={confirmPayment}
                        disabled={updateStatus.isPending || paidAmount.trim() === '' || !Number.isFinite(Number(paidAmount)) || Number(paidAmount) < 0}
                    >
                        Save Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
