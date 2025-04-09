const defaultCategories = [
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
const pagination = document.querySelector(".change-page");
const errorMess = document.querySelector("#error-message");

let categories = JSON.parse(localStorage.getItem("categories")) || [];

if (categories.length === 0) {
  categories = defaultCategories;
  saveCategories();
}

let currentEditIndex = null;
let currentDeleteIndex = null;
let currentPage = 1;
let perPage = 3;

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

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const currentCategories = categories.slice(start, end);

  currentCategories.forEach((cat, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${start + i + 1}</td>
      <td>${cat.emoji} ${cat.name}</td>
      <td>
        <button class="btn-edit" data-index="${start + i}">Sửa</button>
        <button class="btn-delete" data-index="${start + i}">Xoá</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.onclick = () => openAddModal(Number(btn.dataset.index));
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = () => openDeleteModal(Number(btn.dataset.index));
  });

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(categories.length / perPage);
  pagination.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "<";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderCategories();
  };
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.onclick = () => {
      currentPage = i;
      renderCategories();
    };
    pagination.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = ">";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderCategories();
  };
  pagination.appendChild(nextBtn);
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
  const isDuplicate = categories.some((cat, index) => {
    return index !== Number(currentEditIndex) && cat.name.toLowerCase() === nameLower;
  });

  if (isDuplicate) {
    errorMess.style.display = "block";
    errorMess.innerHTML = "Danh mục đã tồn tại";
    return;
  }

  let newCategory;
  if (currentEditIndex === null) {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
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
