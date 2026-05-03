import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog"
import { FaInfoCircle } from "react-icons/fa";
import { Button } from '@/components/ui/button';

type ApprovedDialogProp = {
    code: string;
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    message?: string;
};

function ApprovedDialog({ code, show, onConfirm, message }: ApprovedDialogProp) {
    return (
        <Dialog open={show} onOpenChange={ () => { }}>
            <DialogContent className="max-w-sm p-0 overflow-hidden rounded-2xl shadow-xl">
                <DialogHeader className='hidden'>
                    <DialogTitle >
                        <div className='sr-only'>
                        </div></DialogTitle>
                    <DialogDescription className="text-xs text-center">
                        <span className='sr-only'>  Dialog </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-sky-600 text-white p-6 text-center">
                    <div className="text-5xl flex justify-center mb-2">
                        <FaInfoCircle />
                    </div>
                    <h2 className="text-lg font-semibold">
                        "Booking Confirmed"
                    </h2>
                    <p className="text-xs opacity-90">
                        {message ?? "Please keep this receipt for your reference"}
                    </p>
                </div>
                <div className="bg-white px-6 py-5 text-sm text-gray-700">
                    <div className="border-b border-dashed mb-4"></div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Booking Code</span>
                        <span className="font-semibold">{code}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Date</span>
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-600 font-semibold">
                            Approved
                        </span>
                    </div>
                    <div className="border-b border-dashed mb-4"></div>
                    <p className="text-xs text-center text-gray-400">
                        Present this receipt upon arrival
                    </p>
                </div>

                <div className="p-4 bg-gray-50 flex justify-center">
                    <Button
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                        onClick={onConfirm}
                    >
                        Download Receipt
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default React.memo(ApprovedDialog)