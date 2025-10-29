// ---------- Doctor List ----------
const doctors = [
  "Dr. Deng Bol Chol – General Physician",
  "Dr. Nyandeng Akol Deng – Pediatrician",
  "Dr. Lual Garang Majok – Cardiologist",
  "Dr. Achol Malok Riak – Gynecologist",
  "Dr. Bol Deng Atem – Orthopedic Surgeon",
  "Dr. Abuk Manyang Lual – Dermatologist",
  "Dr. Kuol Wol Ajang – Neurologist",
  "Dr. Nyaluak Gai Bol – Dentist",
  "Dr. Thon Aleu Maker – ENT Specialist",
  "Dr. Yar Ater Malual – Ophthalmologist"
];

const doctorSelect = document.getElementById("doctorSelect");
const filterDoctor = document.getElementById("filterDoctor");
const form = document.getElementById("appointmentForm");
const msg = document.getElementById("msg");
const appointmentsList = document.getElementById("appointmentsList");
const applyFilters = document.getElementById("applyFilters");
const filterDate = document.getElementById("filterDate");

// ---------- Load Doctors ----------
function populateDoctors() {
  doctorSelect.innerHTML = doctors.map(
    (doc) => `<option value="${doc}">${doc}</option>`
  ).join("");

  filterDoctor.innerHTML = `<option value="">All</option>` + 
    doctors.map(
      (doc) => `<option value="${doc}">${doc}</option>`
    ).join("");
}

// ---------- Get Saved Appointments ----------
function getAppointments() {
  return JSON.parse(localStorage.getItem("appointments")) || [];
}

// ---------- Save Appointments ----------
function saveAppointments(appointments) {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

// ---------- Render Appointments ----------
function renderAppointments(filtered = null) {
  const appointments = filtered || getAppointments();
  appointmentsList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentsList.innerHTML = "<li>No appointments found.</li>";
    return;
  }

  appointments.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${a.patient_name}</strong> (${a.patient_phone || "No phone"})<br>
      <b>Doctor:</b> ${a.doctor}<br>
      <b>Date:</b> ${a.date} <b>Time:</b> ${a.time}<br>
      <b>Reason:</b> ${a.reason || "N/A"}
    `;
    appointmentsList.appendChild(li);
  });
}

// ---------- Handle Form Submission ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const patient_name = document.getElementById("patient_name").value.trim();
  const patient_phone = document.getElementById("patient_phone").value.trim();
  const doctor = doctorSelect.value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const reason = document.getElementById("reason").value.trim();

  if (!patient_name || !doctor || !date || !time) {
    showMessage("Please fill in all required fields!", true);
    return;
  }

  const newAppointment = { patient_name, patient_phone, doctor, date, time, reason };
  const appointments = getAppointments();
  appointments.push(newAppointment);
  saveAppointments(appointments);

  form.reset();
  showMessage("Appointment booked successfully!");
  renderAppointments();
});

// ---------- Filter Appointments ----------
applyFilters.addEventListener("click", () => {
  const doctorVal = filterDoctor.value;
  const dateVal = filterDate.value;

  let filtered = getAppointments();

  if (doctorVal) {
    filtered = filtered.filter(a => a.doctor === doctorVal);
  }
  if (dateVal) {
    filtered = filtered.filter(a => a.date === dateVal);
  }

  renderAppointments(filtered);
});

// ---------- Show Message ----------
function showMessage(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
  setTimeout(() => (msg.textContent = ""), 3000);
}

// ---------- Initialize ----------
populateDoctors();
renderAppointments();
