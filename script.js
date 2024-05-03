// Function to open patient modal and fetch patient details
function openPatientModal(patientId) {

    // Fetch patient details by ID
    
    fetch("http://localhost:3000/patients/" + patientId)
    .then(response => response.json())
    .then(patient => {
        // Prepare patient details HTML
        var patientDetailsHTML = `
        <p>Diagnosis: ${patient.diagnosis}</p>
        <p>Medications: ${patient.medications}</p>
        <p>Allergies: ${patient.allergies}</p>
        <button type="button" class="btn btn-primary" onclick="editPatient(${patient.id})">Edit</button>
        <button type="button" class="btn btn-success" onclick="saveChanges(${patient.id})">Save</button>
        `;

        // Load patient details into modal body
        var modalBody = $('.modal-body');
        modalBody.html(patientDetailsHTML);

           // Open the modal
           $('#patientModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching patient details:', error);
        });
    }
    
    // Function to close patient modal
    function closePatientModal() {
        $('#patientModal').modal('hide');
    }
    
document.addEventListener("DOMContentLoaded", () => {
    
    let patients;

        // Fetch patients data from the server
    fetch("http://localhost:3000/patients")
    .then(async(res) => {
        patients = await res.json()
        $('#patientsTable').DataTable({
            data: patients,
            order: [[0, 'asc']],
            columns: [
                { data: 'id' },
                { data: 'name' },
                { data: 'age' },
                { data: 'gender' },
                { data: 'assignedDoctor' },
                { data: 'lastVisit' },
                { 
                    // Action
                    data: null ,
                    render: function(data, type, row) {
                        return '<button class="btn btn-primary" onclick="openPatientModal(' + row.id +')">View</button>' +
                                '<button class="btn btn-danger">Delete</button>';
                            }
                        }
                    ]
                });
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });


            
//Select Doctors Options
fetch("http://localhost:3000/doctors")
.then(async(res)=>{
    doctors = await res.json()
    let doc = document.getElementById("doctorsSelect")

    doctors.forEach(element => {
        console.log(element);
        doc.innerHTML += "<option value='" + element.name + "'>" + element.name + "</option>";
    });

})
        
// Event listener for the submit button (patients data)
            
document.getElementById('submitBtn').addEventListener('click', function() {
    
// Collect data from form fields
                
const id = document.getElementById('formId').value;
const name = document.getElementById('nameController').value;
const age = document.getElementById('ageController').value;
const gender = document.getElementById('genderController').value;
const diagnosis = document.getElementById('diagnosisController').value;
const medications = document.getElementById('medicationController').value;
const allergies = document.getElementById('allergiesController').value;
const lastVisit = document.getElementById('lastVisitController').value;
const assignedDoctor = document.getElementById('doctorsSelect').value;

// Create a new patient object

const newPatient = {
    id: id,
    name: name,
    age: age,
    gender: gender,
    diagnosis: diagnosis,
    medications: medications,
    allergies: allergies,
    lastVisit: lastVisit,
    assignedDoctor: assignedDoctor
};

console.log(newPatient);

// Send patients data to the server
fetch('http://localhost:3000/patients', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPatient),
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
})
.catch(error => {
    console.error('Error:', error);
});
 });

// Fetch Doctors data

fetch("http://localhost:3000/doctors")
.then(async(res)=>{
     doctors = await res.json()
     console.log(doctors);
     $('#doctorsTable').DataTable( {
        data: doctors,
        order: [[0, 'asc']],
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'contact' },
            
                
        ]
    } );
    
}).catch((err)=>{
   // alert('failed')
console.log(err);})


})