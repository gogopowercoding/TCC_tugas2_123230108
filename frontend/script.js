const API = "http://localhost:3000/api/notes";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

let editId = null;

async function loadNotes() {
  const res = await fetch(`${API}/user/${user.id}`);
  const data = await res.json();

  const container = document.getElementById("notes");
  container.innerHTML = "";

  data.forEach(note => {
    container.innerHTML += `
      <div>
        <h3>${note.judul}</h3>
        <p>${note.isi}</p>
        <button onclick="editNote(${note.id}, '${note.judul}', '${note.isi}')">Edit</button>
        <button onclick="deleteNote(${note.id})">Hapus</button>
      </div>
    `;
  });
}

async function saveNote() {
  const judul = document.getElementById("judul").value;
  const isi = document.getElementById("isi").value;

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      judul,
      isi,
      user_id: user.id
    })
  });

  loadNotes();
}

function editNote(id, judul, isi) {
  document.getElementById("judul").value = judul;
  document.getElementById("isi").value = isi;
  editId = id;
}

async function updateNote() {
  const judul = document.getElementById("judul").value;
  const isi = document.getElementById("isi").value;

  await fetch(`${API}/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ judul, isi })
  });

  editId = null;
  loadNotes();
}

async function deleteNote(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadNotes();
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

loadNotes();