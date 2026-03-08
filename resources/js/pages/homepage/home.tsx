import React, { useEffect, useMemo, useState } from "react"
import HomeLayout from "@/layouts/home-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useHandleChange } from "@/lib/use-handle-change"
import { DailySchedule } from "@/types/models"
import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css";
import axios from "axios"
import { toast } from "sonner"
import { usePage } from "@inertiajs/react"
import InputError from "@/components/input-error"
import confirmationDialog from "@/components/custom/confirmation-dialog"
import ConfirmationDialog from "@/components/custom/confirmation-dialog"

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

  const { item, setItem, handleChange, setErrors, errors } = useHandleChange({ fname: "", lname: "", mname: "", email: "", code: "", reason: "", scheduleCode: "", })
  const canProceedStep1 = !!item.scheduleCode
  const canProceedStep2 =
    item.fname && item.lname && item.reason


  const [cooldown, setCooldown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [schedules, setSchedules] = useState<DailySchedule[]>([])

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

  const sendVerification = () => {
    if (!item.email) return
    setLoading(true)
    axios.post("/send-verification-code", {
      email: item.email,
    }).then((res) => {
      setCooldown(res.data.cooldown)
      toast.success(res.data.message)
      setLoadingBtn(false)
    }).catch((err) => {
      console.log(err.response.data)
      setErrors((prev) => ({ ...prev, email: err.response.data.message }))
      toast.error(err.response.data.message)
      setLoadingBtn(false)
      if (err.response?.data?.cooldown) {
        setCooldown(err.response.data.cooldown)
      }
      setLoading(false)
    })
  }

  const confirmAppointment = () => {
    const formData = new FormData()
    formData.append("fname", item.fname)
    formData.append("lname", item.lname)
    formData.append("mname", item.mname ?? "")
    formData.append("email", item.email)
    formData.append("code", item.code)
    formData.append("reason", item.reason)
    formData.append("schedule_code", item.scheduleCode)
    setLoadingBtn(true)
    axios.post("/verify-code", formData).then((res) => {
      setLoadingBtn(false)
      toast.success(res.data.message)
      setItem({ fname: "", lname: "", mname: "", email: "", code: "", reason: "", scheduleCode: "" })
    }).catch((err) => {
      toast.error(err.response.data.message)
      setLoadingBtn(false)


    })
  }

  return (
    <HomeLayout>
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-12 bg-white  rounded-2xl p-8 my-6" id="BookNow">
        <div className="lg:mb-6 mb-6">
          <div className="flex justify-center">
            <div className="flex items-center  max-w-3xl  justify-between">
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
              <div className="flex lg:flex-row flex-col  justify-center gap-6">
                <div className="flex items-center flex-col">
                  <p className="text-gray-500 mb-4">
                    Choose your preferred date and time.
                  </p>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    fromDate={new Date()}
                    disabled={(date) =>
                      !allowedSet.has(date.toDateString())
                    }
                    className="p-4 border rounded-xl shadow-sm w-fit"
                  />
                </div>
                {selectedDate && schedules.length > 0 && (
                  <div className="flex-1 h-full ">
                    <p className="mb-4">Select a time slot</p>
                    <div className="grid md:grid-cols-3 gap-4">

                      {schedules.map((slot, index) => (
                        <label
                          key={index}
                          className={`
                    border rounded-lg p-4 cursor-pointer transition flex items-center justify-center flex-row
                    ${item.scheduleCode === slot.schedule_code
                              ? "bg-sky-600 text-white border-sky-600"
                              : "hover:bg-sky-50"
                            }
                  `}
                        >
                          {slot.start_time} - {slot.end_time}
                          <input
                            type="radio"
                            className="hidden"
                            checked={item.scheduleCode === slot.schedule_code}
                            onChange={() =>
                              setItem({ ...item, scheduleCode: slot.schedule_code })
                            }
                          />
                        </label>
                      ))}
                    </div>

                  </div>
                )}

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

          {/* ================== STEP 2 ================== */}
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
                  name="middlename"
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

          {/* ================== STEP 3 ================== */}
          {step === 3 && (
            <div className="space-y-8">

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Email Verification
                </h2>
                <p className="text-gray-500">
                  Verify your email to confirm booking.
                </p>
              </div>
              <div className="grid gap-1">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={item.email ?? ""}
                  onChange={handleChange}
                />
                <InputError message={errors.email} />
              </div>


              <Button
                disabled={cooldown > 0 || loading}
                onClick={sendVerification}
                className="bg-sky-700 hover:bg-sky-800 text-white"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : loading
                    ? "Sending..."
                    : "Send Verification Code"}
              </Button>

              <Input
                type="text"
                name="code"
                placeholder="Enter verification code"
                value={item.code ?? ""}
                onChange={handleChange}
                maxLength={6}
              />

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>

                <Button
                  onClick={confirmAppointment}
                  disabled={loadingBtn}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Confirm Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
        <ConfirmationDialog show={dialog} onClose={()=>setDialog(false)} type={1} message="Appointment Successfully Created" />
      </div>
    </HomeLayout>
  )
}