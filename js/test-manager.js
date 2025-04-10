const defaultTests = [
  { id: 1, name: "Lịch sử", questions: 15, time: "10 min" },
  { id: 2, name: "Khoa học", questions: 20, time: "15 min" },
];

const btnAdd = document.querySelector(".btn-add");
const modalAdd = document.querySelector(".modal-add");
const modalDelete = document.querySelector(".modal-delete");
const closeModalAdd = modalAdd.querySelector(".close");
const closeModalDelete = modalDelete.querySelector(".close");
const cancelModalAdd = modalAdd.querySelector(".cancel-modal");
const cancelModalDelete = modalDelete.querySelector(".cancel-modal");
const saveModalBtn = modalAdd.querySelector(".save-modal");
const deleteModalBtn = modalDelete.querySelector(".delete-modal");

const testNameInput = document.querySelector("#category-name");
const testQuestionsInput = document.querySelector("#question");
const testTimeInput = document.querySelector("#time");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector(".change-page");
const errorMess = document.querySelector("#error-message");
const logoutButton = document.querySelector("#sig-out");

const searchInput = document.querySelector(".find-test");
const arrangeSelect = document.querySelector("#arrange");

logoutButton.addEventListener('click', function(e) {
  e.preventDefault();

  localStorage.removeItem('loggedInUser');

  window.location.href = "../pages/login.html";
});

let tests = JSON.parse(localStorage.getItem("tests")) || [];

if (tests.length === 0) {
  tests = defaultTests;
  saveTests();
}

let currentEditIndex = null;
let currentDeleteIndex = null;
let currentPage = 1;
let perPage = 7;

function saveTests() {
  localStorage.setItem("tests", JSON.stringify(tests));
}

function openAddModal(index = null) {
  currentEditIndex = index;
  if (index !== null) {
    testNameInput.value = tests[index].name;
    testQuestionsInput.value = tests[index].questions;
    testTimeInput.value = tests[index].time;
  } else {
    testNameInput.value = "";
    testQuestionsInput.value = "";
    testTimeInput.value = "";
  }
  errorMess.style.display = "none";
  errorMess.innerHTML = "";
  modalAdd.style.display = "flex";
}

function closeAddModal() {
  modalAdd.style.display = "none";
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
        <td>${test.questions}</td>
        <td>${test.time}</td>
        <td>
          <button class="btn-edit" data-index="${start + i}">Sửa</button>
          <button class="btn-delete" data-index="${start + i}">Xoá</button>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = tableContent;

  const editButtons = document.querySelectorAll(".btn-edit");
  for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = function () {
      openAddModal(Number(editButtons[i].dataset.index));
    };
  }

  const deleteButtons = document.querySelectorAll(".btn-delete");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = function () {
      openDeleteModal(Number(deleteButtons[i].dataset.index));
    };
  }

  renderPagination(filteredTests);
}

function renderPagination(filteredTests) {
  const totalPages = Math.ceil(filteredTests.length / perPage);
  let paginationContent = "";

  if (currentPage > 1) {
    paginationContent += `<button onclick="changePage('prev')">&lt;</button>`;
  } else {
    paginationContent += `<button disabled>&lt;</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationContent += `<button class="active" onclick="goToPage(${i})">${i}</button>`;
    } else {
      paginationContent += `<button onclick="goToPage(${i})">${i}</button>`;
    }
  }

  if (currentPage < totalPages) {
    paginationContent += `<button onclick="changePage('next')">></button>`;
  } else {
    paginationContent += `<button disabled>></button>`;
  }

  pagination.innerHTML = paginationContent;
}

function changePage(direction) {
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  } else if (direction === 'next' && currentPage < Math.ceil(tests.length / perPage)) {
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
  const filteredTests = [];

  for (let i = 0; i < tests.length; i++) {
    if (tests[i].name.toLowerCase().includes(searchTerm)) {
      filteredTests.push(tests[i]);
    }
  }

  renderTests(filteredTests);
});

arrangeSelect.addEventListener("change", function () {
  const sortBy = arrangeSelect.value;
  let sortedTests = [...tests];

  for (let i = 0; i < sortedTests.length; i++) {
    for (let j = i + 1; j < sortedTests.length; j++) {
      if (sortBy === "arrName") {
        if (sortedTests[i].name > sortedTests[j].name) {
          const temp = sortedTests[i];
          sortedTests[i] = sortedTests[j];
          sortedTests[j] = temp;
        }
      } else if (sortBy === "arrTime") {
        if (parseInt(sortedTests[i].time) > parseInt(sortedTests[j].time)) {
          const temp = sortedTests[i];
          sortedTests[i] = sortedTests[j];
          sortedTests[j] = temp;
        }
      }
    }
  }

  renderTests(sortedTests);
});

saveModalBtn.onclick = () => {
  const name = testNameInput.value.trim();
  const questions = testQuestionsInput.value.trim();
  const time = testTimeInput.value.trim();

  if (!name || !questions || !time) {
    errorMess.style.display = "block";
    errorMess.innerHTML = "Không được để trống";
    return;
  }

  const nameLower = name.toLowerCase();
  const isDuplicate = tests.some((test, index) => {
    return index !== Number(currentEditIndex) && test.name.toLowerCase() === nameLower;
  });

  if (isDuplicate) {
    errorMess.style.display = "block";
    errorMess.innerHTML = "Bài test đã tồn tại";
    return;
  }

  let newTest;
  if (currentEditIndex === null) {
    const newId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
    newTest = { id: newId, name, questions: parseInt(questions), time };
    tests.push(newTest);
  } else {
    newTest = { id: tests[currentEditIndex].id, name, questions: parseInt(questions), time };
    tests[currentEditIndex] = newTest;
  }

  saveTests();
  closeAddModal();
  renderTests();
};

deleteModalBtn.onclick = () => {
  if (currentDeleteIndex !== null) {
    tests.splice(currentDeleteIndex, 1);
    saveTests();
    closeDeleteModal();
    renderTests();
  }
};

btnAdd.onclick = () => openAddModal();
closeModalAdd.onclick = closeAddModal;
cancelModalAdd.onclick = closeAddModal;
closeModalDelete.onclick = closeDeleteModal;
cancelModalDelete.onclick = closeDeleteModal;

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAddModal();
    closeDeleteModal();
  }
});

renderTests();
