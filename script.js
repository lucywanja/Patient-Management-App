// Function to open patient modal and fetch patient details
function openPatientModal(patientId) {


    fetch("http://localhost:3000/patients/" + patientId)
    .then(response => response.json())
    .then(patient => {
        // Prepare patient details HTML
        

        let fullName = patient.name;
        console.log(fullName);
        var patientDetailsHTML = `
        <div class="mb-3">
            <label for="editName" class="form-label">Name</label>
            <input type="text" class="form-control" id="editName" placeholder="ID" value='${fullName}'>
        </div>

        <div class="mb-3">
            <label for="editDiagnosis" class="form-label">Diagnosis</label>
            <input type="text" class="form-control" id="editDiagnosis" placeholder="ID" value=${patient.diagnosis}>
        </div>

        <div class="mb-3">
            <label for="editMedications" class="form-label">Medication</label>
            <input type="text" class="form-control" id="editMedications" placeholder="ID" value=${patient.medications}>
        </div>

        <div class="mb-3">
            <label for="editAllergies" class="form-label">Allergies</label>
            <input type="text" class="form-control" id="editAllergies" placeholder="ID" value=${patient.allergies}>
        </div>

        <div class="mb-3">
            <label for="editVisit" class="form-label">LastVisit</label>
            <input type="date" class="form-control" id="editVisit" placeholder="lastVisit" value=${patient.lastVisit}>
        </div>

        <input type="text" class="form-control" id="editAge" placeholder="lastVisit" value=${patient.age} hidden>
        <input type="text" class="form-control" id="editGender" placeholder="lastVisit" value=${patient.gender} hidden>
        <input type="text" class="form-control" id="editDoctor" placeholder="lastVisit" value='${patient.assignedDoctor}' hidden>

        <button type="button" class="btn btn-success" onclick="saveChanges(${patient.id})">Save Changes</button>
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

    // Function to save edited patient details
    function saveChanges(patientId) {
        // Get edited values from the form
        const editedDiagnosis = document.getElementById('editDiagnosis').value;
        const editedMedications = document.getElementById('editMedications').value;
        const editedAllergies = document.getElementById('editAllergies').value;
        const editedVisit = document.getElementById('editVisit').value;
        const editedAge = document.getElementById('editAge').value;
        const editedGender = document.getElementById('editGender').value;
        const editedAssignedDoctor = document.getElementById('editDoctor').value;
        const editedName = document.getElementById('editName').value;
    
        // Create an object with edited patient details
        const editedPatient = {
            diagnosis: editedDiagnosis,
            medications: editedMedications,
            allergies: editedAllergies,
            lastVisit: editedVisit,
            age: editedAge,
            gender: editedGender,
            assignedDoctor: editedAssignedDoctor,
            name: editedName
    
        };
    
            // Send a PUT request to update patient details
        fetch("http://localhost:3000/patients/" + patientId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedPatient),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Patient details updated successfully:', data);
            // Close the modal after saving changes
            $('#patientModal').modal('hide');
            // Optionally, you can reload the patient list or update the UI
            // based on the changes made.
        })
        .catch(error => {
            console.error('Error updating patient details:', error);
            // Handle errors appropriately, such as displaying an error message.
        });
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