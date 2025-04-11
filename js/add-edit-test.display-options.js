const categorySelect = document.querySelector("#arrange");
const nameInput = document.querySelector("#test-name");
const timeInput = document.querySelector("#test-time");
const saveBtn = document.querySelector("#btn-save-test");
const errorMessage = document.querySelector("#error-message-main");

const modal = document.querySelector(".modal-add-question");
const btnAddQuestion = document.querySelector(".btn-add");
const errorModal = document.querySelector("#error-message-modal");
const saveQuestionBtn = document.querySelector(".save-modal");
const addAnswerBtn = document.querySelector(".add-modal");
const questionTableBody = document.querySelector("table tbody");

let editQuestionId = null;

document.querySelectorAll(".close-question-modal, .cancel-question-btn").forEach(button => {
  button.addEventListener("click", () => {
    modal.style.display = "none";
    errorModal.textContent = "";
    editQuestionId = null;
  });
});

function loadCategories() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.emoji + " " + cat.name;
    categorySelect.appendChild(option);
  });
}

function loadTestIfEditing() {
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get("id");
  const tests = JSON.parse(localStorage.getItem("tests")) || [];
  const test = testId ? tests.find(t => t.id === parseInt(testId)) : tests.find(t => t.id === parseInt(localStorage.getItem("currentEditingTestId")));
  if (test) {
    nameInput.value = test.name;
    timeInput.value = parseInt(test.time);
    categorySelect.value = test.categoryId;
    renderQuestionTable(test.questions || []);
  }
}

saveBtn.addEventListener("click", function () {
  const name = nameInput.value.trim();
  const time = timeInput.value.trim();
  const categoryId = Number(categorySelect.value);

  if (!name || !time || !categoryId) {
    errorMessage.textContent = "Vui lòng điền đầy đủ thông tin.";
    return;
  }

  let tests = JSON.parse(localStorage.getItem("tests")) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get("id");

  if (testId) {
    const test = tests.find(t => t.id === parseInt(testId));
    if (test) {
      test.name = name;
      test.time = time + " min";
      test.categoryId = categoryId;
      test.questionsCount = test.questions.length;
    }
  } else {
    const newId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
    localStorage.setItem("currentEditingTestId", newId);
    tests.push({
      id: newId,
      name: name,
      time: time + " min",
      categoryId: categoryId,
      questions: [],
      questionsCount: 0
    });
  }

  localStorage.setItem("tests", JSON.stringify(tests));
  window.location.href = "../pages/test-manager.html";
});

btnAddQuestion.addEventListener("click", function () {
  modal.style.display = "flex";
});

addAnswerBtn.addEventListener("click", function () {
  const newOption = document.createElement("div");
  newOption.className = "option";
  newOption.innerHTML = `
    <input type="checkbox" class="checkbox">
    <input type="text" class="option-content" placeholder="Nhập câu trả lời">
    <img src="../assets/images/Trash_Full.png" alt="Xóa" class="trash">
  `;
  document.querySelector(".modal-body").insertBefore(newOption, errorModal);
  attachTrashEvent(newOption.querySelector(".trash"));
});

function attachTrashEvent(img) {
  img.addEventListener("click", function () {
    img.closest(".option").remove();
  });
}
document.querySelectorAll(".trash").forEach(attachTrashEvent);

saveQuestionBtn.addEventListener("click", function () {
  const questionText = document.querySelector("#question-text").value.trim();
  const optionElements = document.querySelectorAll(".option");

  if (!questionText) {
    errorModal.textContent = "Vui lòng nhập nội dung câu hỏi.";
    return;
  }

  const options = [];
  let hasCorrect = false;

  optionElements.forEach(opt => {
    const text = opt.querySelector(".option-content").value.trim();
    const isCorrect = opt.querySelector(".checkbox").checked;
    if (text) {
      options.push({ text, isCorrect });
      if (isCorrect) hasCorrect = true;
    }
  });

  if (options.length < 2) {
    errorModal.textContent = "Cần ít nhất 2 đáp án.";
    return;
  }

  if (!hasCorrect) {
    errorModal.textContent = "Phải chọn ít nhất 1 đáp án đúng.";
    return;
  }

  let testId = parseInt(new URLSearchParams(window.location.search).get("id"));
  if (isNaN(testId)) {
    testId = parseInt(localStorage.getItem("currentEditingTestId"));
  }

  let tests = JSON.parse(localStorage.getItem("tests")) || [];
  const test = tests.find(t => t.id === testId);
  if (!test) {
    errorModal.textContent = "Không tìm thấy bài test.";
    return;
  }

  if (editQuestionId !== null) {
    const q = test.questions.find(q => q.id === editQuestionId);
    if (q) {
      q.text = questionText;
      q.options = options;
    }
  } else {
    const newId = test.questions.length > 0 ? Math.max(...test.questions.map(q => q.id)) + 1 : 1;
    test.questions.push({ id: newId, text: questionText, options });
  }

  test.questionsCount = test.questions.length;
  localStorage.setItem("tests", JSON.stringify(tests));

  renderQuestionTable(test.questions);

  document.querySelector("#question-text").value = "";
  optionElements.forEach(opt => {
    opt.querySelector(".option-content").value = "";
    opt.querySelector(".checkbox").checked = false;
  });

  errorModal.textContent = "";
  modal.style.display = "none";
  editQuestionId = null;
});

function renderQuestionTable(questions) {
  questionTableBody.innerHTML = "";
  questions.forEach((q) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${q.id}</td>
      <td>${q.text}</td>
      <td>
        <button class="btn-edit" data-id="${q.id}">Sửa</button>
        <button class="btn-delete" data-id="${q.id}">Xoá</button>
      </td>
    `;
    questionTableBody.appendChild(row);
  });

  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      let testId = parseInt(new URLSearchParams(window.location.search).get("id"));
      if (isNaN(testId)) testId = parseInt(localStorage.getItem("currentEditingTestId"));
      let tests = JSON.parse(localStorage.getItem("tests")) || [];
      const test = tests.find(t => t.id === testId);
      const q = test.questions.find(q => q.id === id);
      if (q) {
        document.querySelector("#question-text").value = q.text;
        const modalBody = document.querySelector(".modal-body");
        modalBody.querySelectorAll(".option").forEach(e => e.remove());
        q.options.forEach(opt => {
          const div = document.createElement("div");
          div.className = "option";
          div.innerHTML = `
            <input type="checkbox" class="checkbox" \${opt.isCorrect ? 'checked' : ''}>
            <input type="text" class="option-content" value="\${opt.text}">
            <img src="../assets/images/Trash_Full.png" alt="Xóa" class="trash">
          `;
          modalBody.insertBefore(div, document.querySelector("#error-message-modal"));
          attachTrashEvent(div.querySelector(".trash"));
        });
        editQuestionId = id;
        modal.style.display = "flex";
      }
    });
  });

  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      let testId = parseInt(new URLSearchParams(window.location.search).get("id"));
      if (isNaN(testId)) testId = parseInt(localStorage.getItem("currentEditingTestId"));
      let tests = JSON.parse(localStorage.getItem("tests")) || [];
      const test = tests.find(t => t.id === testId);
      if (test) {
        test.questions = test.questions.filter(q => q.id !== id);
        test.questionsCount = test.questions.length;
        localStorage.setItem("tests", JSON.stringify(tests));
        renderQuestionTable(test.questions);
      }
    });
  });
}

loadCategories();
loadTestIfEditing();