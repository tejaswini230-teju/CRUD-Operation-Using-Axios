const API_URL = "http://localhost:3000/users";
let deleteId = null;

// LOAD USERS
window.onload = getUsers;

// GET USERS
async function getUsers() {
  const res = await axios.get(API_URL);
  displayUsers(res.data);
}

// DISPLAY USERS
function displayUsers(users) {
  let rows = "";

  users.forEach((user, index) => {
    rows += `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.age}</td>
        <td>
        <div class="d-flex justify-content-center gap-1 flex-nowrap">
          <button class="btn btn-primary btn-sm"
            onclick="viewUser('${user.id}')">View</button>

          <button class="btn btn-warning btn-sm"
            onclick="editUser('${user.id}', '${user.name}', ${user.age})">Edit</button>

          <button class="btn btn-danger btn-sm"
            onclick="deleteUser('${user.id}')">Delete</button>
         </div>   
        </td>
      </tr>
    `;
  });

  document.getElementById("userTable").innerHTML = rows;
}

// SAVE USER
async function saveUser() {
  const id = document.getElementById("userId").value;
  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  
  const name = nameInput.value.trim();
  const age = ageInput.value.trim();

  let isValid = true;

  // NAME VALIDATION 
  const nameRegex = /^[A-Za-z ]{3,}$/;
  if (!nameRegex.test(name)) {
    nameInput.classList.add("is-invalid");
    isValid = false;
  }
  else {
    nameInput.classList.remove("is-invalid");
  }

  // AGE VALIDATION
   if (age == "" ||age < 18 || age > 25){
    ageInput.classList.add("is-invalid");
    isValid = false;
   }
   else {
    ageInput.classList.remove("is-invalid");
   }

  if (!isValid) return ;


  const user = { name, age };

  if (id) {
    await axios.put(`${API_URL}/${id}`, user);
  } else {
    await axios.post(API_URL, user);
  }

  clearForm();
  getUsers();

  bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
}

// VIEW USER (MODAL)
async function saveUser() {
  const id = document.getElementById("userId").value;
  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");

  const name = nameInput.value.trim();
  const age = ageInput.value.trim();

  const form = document.getElementById("userForm");
if (!form.checkValidity()) {
  form.reportValidity();
  return;
}

  const user = { name, age };

  if (id) {
    await axios.put(`${API_URL}/${id}`, user);
  } else {
    await axios.post(API_URL, user);
  }

  clearForm();
  getUsers();

  bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
}

// VIEW USER (MODAL)
async function viewUser(id) {
  const res = await axios.get(`${API_URL}/${id}`);
  const user = res.data;

  document.getElementById("viewContent").innerHTML = `
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Age:</strong> ${user.age}</p>
  `;

  new bootstrap.Modal(document.getElementById('viewModal')).show();
}

// EDIT USER
function editUser(id, name, age) {
  document.getElementById("userId").value = id;
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  document.querySelector("#userModal .modal-title").textContent = "Edit Student";
  new bootstrap.Modal(document.getElementById('userModal')).show();
}

// DELETE USER (OPEN MODAL)
function deleteUser(id) {
  deleteId = id;
  new bootstrap.Modal(document.getElementById('deleteModal')).show();
}

// CONFIRM DELETE
async function confirmDelete() {
  await axios.delete(`${API_URL}/${deleteId}`);
  getUsers();

  bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
}

// CLEAR FORM
function clearForm() {
  document.getElementById("userId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("name").classList.remove("is-invalid"); 
  document.getElementById("age").classList.remove("is-invalid");
  document.querySelector("#userModal .modal-title").textContent = "Add Student";
}

