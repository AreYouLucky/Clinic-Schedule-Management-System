import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
export default function PaymentDialog({ paymentBooking, setPaymentBooking, paidAmount, setPaidAmount, confirmPayment, updateStatus }: { paymentBooking: any; setPaymentBooking: React.Dispatch<React.SetStateAction<any>>; paidAmount: string; setPaidAmount: React.Dispatch<React.SetStateAction<string>>; confirmPayment: () => void; updateStatus: any }) {
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
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Mark Appointment as Paid</DialogTitle>
                    <DialogDescription>
                        Enter the amount paid for this appointment before saving it as paid.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-3'>
                    <div className='space-y-1'>
                        <Label htmlFor='paid_amount'>Amount</Label>
                        <Input
                            id='paid_amount'
                            type='number'
                            min='0'
                            step='0.01'
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                            placeholder='0.00'
                        />
                    </div>
                    {paymentBooking && (
                        <p className='text-sm text-slate-500'>
                            Patient: {paymentBooking.lname}, {paymentBooking.fname}{paymentBooking.mname ? ` ${paymentBooking.mname}` : ""}
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                            setPaymentBooking(null);
                            setPaidAmount("");
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        type='button'
                        className='bg-cyan-600 hover:bg-cyan-700 text-white'
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
