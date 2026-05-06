import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { IoWarning } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { Button } from '../ui/button';

type ConfirmationDialogProp = {
    show: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    message?: string
    type: 1 | 2;
}
function ConfirmationDialog(props: ConfirmationDialogProp) {
    return (
        <Dialog open={props.show} onOpenChange={props.onClose}>
            <DialogContent className="text-gray-600 p-10 ">
                <DialogHeader>
                    <DialogTitle >
                        <div className='text-9xl flex justify-center'>
                            {props.type == 1 ? <FaInfoCircle className='text-[#78297c]'/> : <IoWarning className='text-[#10a89a]' />}
                        </div></DialogTitle>
                    <DialogDescription className="text-xs text-center">
                        <span className='sr-only'> Confirmation Dialog </span>
                    </DialogDescription>
                </DialogHeader>

                <div className='text-center pb-3'>
                    {props.message}
                </div>
                <div className="w-full flex justify-center gap-2">
                    {props.type == 2 && <Button className="bg-sky-700 text-sm text-gray-50" onClick={props.onConfirm}>Proceed</Button>}
                    <Button className="text-gray-50 bg-gray-700 text-sm" onClick={props.onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default React.memo(ConfirmationDialog)
