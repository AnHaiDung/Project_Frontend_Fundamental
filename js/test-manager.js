const defaultTests = [
  { id: 1, name: "Lịch sử", questions: 15, time: "10 min" },
  { id: 2, name: "Khoa học", questions: 20, time: "15 min" },
];

const btnAdd = document.querySelector(".btn-add");
const modalDelete = document.querySelector(".modal-delete");
const closeModalDelete = modalDelete.querySelector(".close");
const cancelModalDelete = modalDelete.querySelector(".cancel-modal");
const deleteModalBtn = modalDelete.querySelector(".delete-modal");

const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".change-page");
const logoutButton = document.querySelector("#sig-out");

const searchInput = document.querySelector(".find-test");
const arrangeSelect = document.querySelector("#arrange");

logoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("loggedInUser");
  window.location.href = "../pages/login.html";
});

let tests = JSON.parse(localStorage.getItem("tests")) || [];

if (tests.length === 0) {
  tests = defaultTests;
  saveTests();
}

let currentDeleteIndex = null;
let currentPage = 1;
let perPage = 7;

function saveTests() {
  localStorage.setItem("tests", JSON.stringify(tests));
}

function openDeleteModal(index) {
  currentDeleteIndex = index;
  modalDelete.style.display = "flex";
}

function closeDeleteModal() {
  modalDelete.style.display = "none";
}

function renderTests(filteredTests = tests) {
  let tableContent = "";
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const currentTests = filteredTests.slice(start, end);

  for (let i = 0; i < currentTests.length; i++) {
    const test = currentTests[i];
    tableContent += `
      <tr>
        <td>${start + i + 1}</td>
        <td>${test.name}</td>
        <td>${Array.isArray(test.questions) ? test.questions.length : test.questions}</td>
        <td>${test.time}</td>
        <td>
          <button class="btn-edit" data-id="${test.id}">Sửa</button>
          <button class="btn-delete" data-index="${start + i}">Xoá</button>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = tableContent;

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      window.location.href = `../pages/add-edit-test.html?id=${id}`;
    };
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = () => {
      openDeleteModal(Number(btn.dataset.index));
    };
  });

  renderPagination(filteredTests);
}

function renderPagination(filteredTests) {
  const totalPages = Math.ceil(filteredTests.length / perPage);
  let html = "";

  html += `<button ${currentPage === 1 ? "disabled" : ""} onclick="changePage('prev')">&lt;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
  }

  html += `<button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage('next')">&gt;</button>`;

  pagination.innerHTML = html;
}

function changePage(direction) {
  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next" && currentPage < Math.ceil(tests.length / perPage)) {
    currentPage++;
  }
  renderTests();
}

function goToPage(page) {
  currentPage = page;
  renderTests();
}

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderTests(filteredTests);
});

arrangeSelect.addEventListener("change", function () {
  const sortBy = arrangeSelect.value;
  let sortedTests = [...tests]; 

  for (let i = 0; i < sortedTests.length - 1; i++) {
    for (let j = i + 1; j < sortedTests.length; j++) {
      if (sortBy === "arrName") {
        if (sortedTests[i].name.toLowerCase() > sortedTests[j].name.toLowerCase()) {
          let temp = sortedTests[i];
          sortedTests[i] = sortedTests[j];
          sortedTests[j] = temp;
        }
      } else if (sortBy === "arrTime") {
        if (parseInt(sortedTests[i].time) > parseInt(sortedTests[j].time)) {
          let temp = sortedTests[i];
          sortedTests[i] = sortedTests[j];
          sortedTests[j] = temp;
        }
      }
    }
  }

  currentPage = 1;
  renderTests(sortedTests);
});

btnAdd.onclick = () => {
  window.location.href = "../pages/add-edit-test.html";
};

deleteModalBtn.onclick = () => {
  if (currentDeleteIndex !== null) {
    tests.splice(currentDeleteIndex, 1);
    saveTests();
    closeDeleteModal();
    renderTests();
  }
};

closeModalDelete.onclick = closeDeleteModal;
cancelModalDelete.onclick = closeDeleteModal;

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDeleteModal();
  }
});

renderTests();
