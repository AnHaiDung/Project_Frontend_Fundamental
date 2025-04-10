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
  const testTimeInput = document.querySelector("#emoji");
  const tbody = document.querySelector("tbody");
  const pagination = document.querySelector(".change-page");
  const errorMess = document.querySelector("#error-message");
  const logoutButton = document.querySelector("#sig-out");

  logoutButton.addEventListener('click', function(e) {
    e.preventDefault();
  
    localStorage.removeItem('loggedInUser');
  
    window.location.href = "../pages/login.html"
  });
  
  let tests = JSON.parse(localStorage.getItem("tests")) || [];
  
  if (tests.length === 0) {
    tests = defaultTests;
    saveTests();
  }
  
  let currentEditIndex = null;
  let currentDeleteIndex = null;
  let currentPage = 1;
  let perPage = 3;
  
  function saveTests() {
    localStorage.setItem("tests", JSON.stringify(tests));
  }
  
  function openAddModal(index = null) {
    currentEditIndex = index;
    if (index !== null) {
      testNameInput.value = tests[index].name;
      testTimeInput.value = tests[index].time;
    } else {
      testNameInput.value = "";
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
  
  function renderTests() {
    tbody.innerHTML = "";
  
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentTests = tests.slice(start, end);
  
    currentTests.forEach((test, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + i + 1}</td>
        <td>${test.name}</td>
        <td>${test.questions}</td>
        <td>${test.time}</td>
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
    const totalPages = Math.ceil(tests.length / perPage);
    pagination.innerHTML = "";
  
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "<";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      currentPage--;
      renderTests();
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
        renderTests();
      };
      pagination.appendChild(pageBtn);
    }
  
    const nextBtn = document.createElement("button");
    nextBtn.textContent = ">";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      currentPage++;
      renderTests();
    };
    pagination.appendChild(nextBtn);
  }
  
  saveModalBtn.onclick = () => {
    const name = testNameInput.value.trim();
    const time = testTimeInput.value.trim();
  
    if (!name || !time) {
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
      newTest = { id: newId, name, time, questions: 0 };
      tests.push(newTest);
    } else {
      newTest = { id: tests[currentEditIndex].id, name, time, questions: tests[currentEditIndex].questions };
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
  