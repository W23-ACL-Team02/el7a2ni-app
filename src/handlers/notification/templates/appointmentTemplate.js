
const appointmentBodyNewScheduler = (userType, attendingName, date) => {
    return `An appointment has been created${(date == undefined) ? " ": ` at ${date} `}with ${attendingName ?? "NAME"}.`
}

const appointmentBodyNewAttending = (userType, schedulerName, date) => {
    return `An appointment has been created${(date == undefined) ? " ": ` at ${date} `}by ${schedulerName ?? "NAME"}.`
}

const appointmentTitleNew = () => {
    return `New Appointment Created`
}

const appointmentBodyCancelledCanceller = (userType, attendingName, date) => {
    return `You have cancelled your appointment ${(date == undefined) ? "": `on ${date} `}with ${attendingName ?? "NAME"}.
    Please refer to your appointments schedule.`
}

const appointmentBodyCancelledAttending = (userType, cancellerName, date) => {
    return `One of your appointments ${(date == undefined) ? "": `on ${date} `}has been cancelled by ${cancellerName ?? "NAME"}.
    Please refer to your appointments schedule.`
}

const appointmentTitleCancelled = () => {
    return `Appointment Cancelled`
}

const appointmentBodyRescheduledRescheduler = (userType, attendingName, date) => {
    return `You have rescheduled your appointment ${(date == undefined) ? "": `on ${date} `}with ${attendingName ?? "NAME"}.
    Please refer to your appointments schedule.`
}

const appointmentBodyRescheduledAttending = (userType, reschedulerName, date) => {
    return `One of your appointments ${(date == undefined) ? "": `on ${date} `}has been rescheduled by ${reschedulerName ?? "NAME"}.
    Please refer to your appointments schedule.`
}

const appointmentTitleRescheduled = () => {
    return `Appointment Rescheduled`
}

module.exports = { appointmentTitleNew, appointmentBodyNewAttending, appointmentBodyNewScheduler, appointmentTitleRescheduled, appointmentBodyRescheduledAttending, appointmentBodyRescheduledRescheduler
    , appointmentTitleCancelled, appointmentBodyCancelledAttending, appointmentBodyCancelledCanceller}