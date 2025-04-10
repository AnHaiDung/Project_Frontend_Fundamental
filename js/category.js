let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Lịch sử", emoji: "📜" },
  { id: 2, name: "Khoa học", emoji: "🔬" },
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

const categoryInput = document.querySelector("#category-name");
const emojiInput = document.querySelector("#emoji");
const tbody = document.querySelector("tbody");
const pagination = document.querySelector("#btnPages");
const errorMess = document.querySelector("#error-message");
const logoutButton = document.querySelector("#sig-out");

logoutButton.addEventListener('click', function(e) {
  e.preventDefault();

  localStorage.removeItem('loggedInUser');

  window.location.href = "../pages/login.html"
});

// if (!localStorage.getItem("loggedInUser") || {}){
//   localStorage.removeItem('loggedInUser');
//   window.location.href = "../pages/login.html"
// }

let currentEditIndex = null;
let currentDeleteIndex = null;
let currentPage = 1;
const totalPerPage = 7;

function saveCategories() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function openAddModal(index = null) {
  currentEditIndex = index;
  if (index !== null) {
    categoryInput.value = categories[index].name;
    emojiInput.value = categories[index].emoji;
  } else {
    categoryInput.value = "";
    emojiInput.value = "";
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

function renderCategories() {
  tbody.innerHTML = "";  

  const start = (currentPage - 1) * totalPerPage;
  const end = start + totalPerPage;
  const currentCategories = categories.slice(start, end);

  let rows = "";
  currentCategories.forEach((cat, i) => {
    rows += `
      <tr>
        <td>${start + i + 1}</td>
        <td>${cat.emoji} ${cat.name}</td>
        <td>
          <button class="btn-edit" data-index="${start + i}">Sửa</button>
          <button class="btn-delete" data-index="${start + i}">Xoá</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;  

  const editButtons = document.querySelectorAll(".btn-edit");
  editButtons.forEach((btn) => {
    btn.onclick = () => openAddModal(Number(btn.dataset.index));
  });

  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach((btn) => {
    btn.onclick = () => openDeleteModal(Number(btn.dataset.index));
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(categories.length / totalPerPage);
  pagination.innerHTML = "";

  let paginationButtons = "";

  let prevBtn = "<button id='btnPrev'> < </button>";
  if (currentPage === 1) {
    prevBtn = "<button id='btnPrev' disabled> < </button>";
  }
  paginationButtons += prevBtn;

  for (let i = 1; i <= totalPages; i++) {
    paginationButtons += `
      <button class="page-btn" ${i === currentPage ? 'class="btn-active"' : ''} data-page="${i}">${i}</button>
    `;
  }

  let nextBtn = "<button id='btnNext'> > </button>";
  if (currentPage === totalPages) {
    nextBtn = "<button id='btnNext' disabled> > </button>";
  }
  paginationButtons += nextBtn;

  pagination.innerHTML = paginationButtons;

  const pageBtns = document.querySelectorAll(".page-btn");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      renderCategories();
    });
  });

  document.querySelector("#btnPrev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderCategories();
    }
  });

  document.querySelector("#btnNext").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderCategories();
    }
  });
}

saveModalBtn.onclick = () => {
  const name = categoryInput.value.trim();
  const emoji = emojiInput.value.trim();

  if (!name || !emoji) {
    errorMess.style.display = "block";
    errorMess.innerHTML = "Không được để trống";
    return;
  }

  const nameLower = name.toLowerCase();
  let isDuplicate = false;

  for (let i = 0; i < categories.length; i++) {
    if (i !== currentEditIndex && categories[i].name.toLowerCase() === nameLower) {
      isDuplicate = true;
      break;
    }
  }

  if (isDuplicate) {
    errorMess.style.display = "block";
    errorMess.innerHTML = "Danh mục đã tồn tại";
    return;
  }

  let newCategory;
  if (currentEditIndex === null) {
    let newId = 1;
    if (categories.length > 0) {
      newId = Math.max(...categories.map(c => c.id)) + 1;
    }
    newCategory = { id: newId, name, emoji };
    categories.push(newCategory);
  } else {
    newCategory = { id: categories[currentEditIndex].id, name, emoji };
    categories[currentEditIndex] = newCategory;
  }

  saveCategories();
  closeAddModal();
  renderCategories();
};

deleteModalBtn.onclick = () => {
  if (currentDeleteIndex !== null) {
    categories.splice(currentDeleteIndex, 1);
    saveCategories();
    closeDeleteModal();
    renderCategories();
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

renderCategories();
