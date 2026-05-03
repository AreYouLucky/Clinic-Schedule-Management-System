import { useEffect, useMemo, useState } from "react"
import HomeLayout from "@/layouts/home-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useHandleChange } from "@/lib/use-handle-change"
import { DailySchedule, Booking } from "@/types/models"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";
import axios from "axios"
import { toast } from "sonner"
import { usePage } from "@inertiajs/react"
import InputError from "@/components/input-error"
import ConfirmationDialog from "@/components/custom/confirmation-dialog"
import ApprovedDialog from "./partials.tsx/approved-dialog"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarDays, Clock3 } from "lucide-react"

type DateItem = {
  date: string
}

export default function Home() {
  const { props } = usePage<{ dates?: DateItem[] }>()
  const allowedDates = props.dates ?? []
  const [step, setStep] = useState(1)
  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)
  const [dialog, setDialog] = useState(false)
  const [confirmation, setConfirmation] = useState(false)
  const [data, setData] = useState<{ booking: Booking; schedule: DailySchedule; } | null>(null);
  const { item, setItem, handleChange, errors, setErrors } = useHandleChange({ fname: "", lname: "", mname: "", email: "", contact: "", reason: "", scheduleCode: "", })
  const canProceedStep1 = !!item.scheduleCode
  const canProceedStep2 =
    item.fname && item.lname && item.reason
  const [cooldown, setCooldown] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [schedules, setSchedules] = useState<DailySchedule[]>([])
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const allowedSet = useMemo(() => {
    return new Set(
      allowedDates.map((d) => {
        const [year, month, day] = d.date.split("-").map(Number)
        return new Date(year, month - 1, day).toDateString()
      })
    )
  }, [allowedDates])

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
      const day = String(selectedDate.getDate()).padStart(2, "0")
      const formattedDate = `${year}-${month}-${day}`
      axios.get(`/get-schedules/${formattedDate}`).then((res) => {
        setSchedules(res.data)
        setShowScheduleModal(true)
      })
    }
  }, [selectedDate])

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const formattedSelectedDate = selectedDate
    ? `${selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
    : ""

  const selectedSchedule = schedules.find((slot) => slot.schedule_code === item.scheduleCode)

  const confirmAppointment = () => {
    setConfirmation(false)
    setLoading(true)
    const formData = new FormData()
    formData.append("fname", item.fname)
    formData.append("lname", item.lname)
    formData.append("mname", item.mname ?? "")
    formData.append("email", item.email)
    formData.append("contact", item.contact)
    formData.append("reason", item.reason)
    formData.append("schedule_code", item.scheduleCode)
    axios.post("/submit-appointment", formData).then((res) => {
      toast.success(res.data.message)
      setData({
        booking: res.data.booking,
        schedule: res.data.schedule,
      });
      setLoading(false)
      setItem({ fname: "", lname: "", mname: "", email: "", contact: "", reason: "", scheduleCode: "" })
      setDialog(true)
      setStep(1)
      setSchedules([])
    }).catch((err) => {
      toast.error(err.response.data.message)
      if (err.response.data.errors)
        setErrors(err.response.data.errors)
      setLoading(false)
    })
  }
  const proceed = (item.contact === "" && item.email === "") || loading;

  const downloadAppointment = () => {
    
    window.open(`/download-appointment/${data?.booking.schedule_code}`, "_blank");
    setDialog(false)
  }

  return (
    <HomeLayout>
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 md:py-12 py-6 bg-white  rounded-2xl p-8 my-6" id="BookNow">
        <div className="lg:mb-6 mb-6 hidden md:flex items-center justify-center gap-6">
          <div className="flex justify-center">
            <div className="flex items-center  max-w-3xl justify-between">
              {["Schedule", "Information", "Email Verification"].map((label, index) => {
                const stepNumber = index + 1
                const isActive = step === stepNumber
                const isCompleted = step > stepNumber
                return (
                  <div key={index} className="flex items-center">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={` h-10 w-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${isCompleted ? "bg-green-600 text-white" : isActive ? "bg-sky-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                        {isCompleted ? "✓" : stepNumber}
                      </div>
                      <span className={`mt-2 text-sm ${isActive ? "text-sky-600 font-medium" : "text-gray-500"}`} >
                        {label}
                      </span>
                    </div>
                    {stepNumber !== 3 && (
                      <div className={` hidden sm:block h-0.5 w-24 mx-6 ${step > stepNumber ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="">
          {step === 1 && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col  justify-center gap-6">
                <div className="flex items-center flex-col">
                  <p className="text-gray-500 mb-4">
                    Choose your preferred date and time.
                  </p>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (!date) {
                        return
                      }

                      setSelectedDate(date)
                      setItem((prev) => ({ ...prev, scheduleCode: "" }))
                    }}
                    onDayClick={(date) => {
                      if (
                        selectedDate &&
                        date.toDateString() === selectedDate.toDateString()
                      ) {
                        setShowScheduleModal(true)
                      }
                    }}
                    fromDate={new Date()}
                    disabled={(date) =>
                      !allowedSet.has(date.toDateString())
                    }
                    className="p-4 border rounded-xl shadow-sm w-fit"
                  />
                </div>
                <div className="flex-1 h-full">
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-white p-2.5 text-sky-600 shadow-sm">
                        <CalendarDays size={18} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {selectedDate ? formattedSelectedDate : "Choose a date to view slots"}
                        </h3>
                        {selectedSchedule && (
                          <p className="mt-1 text-xs font-medium text-sky-700">
                            Time: {selectedSchedule.start_time} - {selectedSchedule.end_time}
                          </p>
                        )}
                      </div>
                    </div>
                    {selectedDate && schedules.length === 0 && (
                      <p className="mt-3 text-sm text-rose-600">
                        No available time slots for the selected date.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  disabled={!canProceedStep1}
                  onClick={nextStep}
                  className="bg-sky-700 hover:bg-sky-800 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                <p className="text-gray-500">
                  Enter your complete details.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                <Input
                  name="fname"
                  placeholder="First Name"
                  value={item.fname ?? ""}
                  onChange={handleChange}
                />
                <Input
                  name="mname"
                  placeholder="Middle Name"
                  value={item.mname ?? ""}
                  onChange={handleChange}
                />
                <Input
                  name="lname"
                  placeholder="Last Name"
                  value={item.lname ?? ""}
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="reason"
                rows={4}
                placeholder="Reason for appointment..."
                value={item.reason ?? ""}
                onChange={handleChange}
                className="w-full bg-gray-50 border rounded-xl p-4"
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>

                <Button
                  disabled={!canProceedStep2}
                  onClick={nextStep}
                  className="bg-sky-700 hover:bg-sky-800 text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Contact Information
                </h2>
              </div>
              <div className="grid gap-1">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address (optional)"
                  value={item.email ?? ""}
                  onChange={handleChange}
                />
                <InputError message={errors.email} />
              </div>
              <Input
                type="text"
                name="contact"
                placeholder="Contact No. (required if no email)"
                value={item.contact ?? ""}
                onChange={handleChange}
                maxLength={11}
              />
              <InputError message={errors.contact} />

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>

                <Button
                  onClick={() => setConfirmation(true)}
                  disabled={proceed}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading && <Spinner className="mr-2" />} Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="sm:max-w-3xl max-h-[98vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-sky-700">Select a Time Slot</DialogTitle>
              <DialogDescription className="text-slate-600">
                {selectedDate
                  ? `Available appointment times for ${formattedSelectedDate}.`
                  : "Choose a date first to view available appointment times."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-3 max-h-[80vh] overflow-y-auto py-2">
              {schedules.map((slot, index) => (
                <label
                  key={index}
                  className={`
                    border rounded-xl p-4 cursor-pointer transition flex items-center justify-center flex-row text-center text-sm
                    ${item.scheduleCode === slot.schedule_code
                      ? "bg-sky-600 text-white border-sky-600 shadow-md"
                      : "bg-white hover:bg-sky-200 border-sky-200 text-slate-700"}
                  `}
                >
                  {slot.start_time} - {slot.end_time}
                  <input
                    type="radio"
                    className="hidden"
                    checked={item.scheduleCode === slot.schedule_code}
                    onChange={() => {
                      setItem({ ...item, scheduleCode: slot.schedule_code })
                      setShowScheduleModal(false)
                    }}
                  />
                </label>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <ApprovedDialog show={dialog} onClose={() => setDialog(false)} code={data?.booking.schedule_code ?? ""} onConfirm={downloadAppointment} />
        <ConfirmationDialog show={confirmation} onConfirm={confirmAppointment} onClose={() => setConfirmation(false)} type={2} message="Are you sure you want to create an appointment?" />
      </div>
    </HomeLayout>
  )
}
