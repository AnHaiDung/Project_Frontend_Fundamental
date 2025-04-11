
const categorySelect = document.querySelector("#arrange");
const nameInput = document.querySelector("#test-name");
const timeInput = document.querySelector("#test-time");
const saveBtn = document.querySelector("#btn-save-test");
const errorMessage = document.querySelector("#error-message-main");
const questionTableBody = document.querySelector("tbody");

const modal = document.querySelector(".modal-add-question");
const btnAddQuestion = document.querySelector(".btn-add");
const btnCloseModal = document.querySelector(".close-question-modal");
const btnCancelModal = document.querySelector(".cancel-question-btn");
const btnSaveQuestion = document.querySelector(".save-modal");
const btnAddAnswer = document.querySelector(".add-modal");
const answerContainer = document.querySelector(".modal-body");
const questionInput = document.querySelector("#question-text");
const modalError = document.querySelector("#error-message-modal");

let questions = [];
let editId = null;

function showError(el, msg) {
  el.textContent = msg;
  setTimeout(() => el.textContent = '', 3000);
}

function renderQuestions() {
  questionTableBody.innerHTML = "";
  questions.forEach((q, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${q.text}</td>
      <td>
        <button class="edit-question" data-id="${index}">Sửa</button>
        <button class="delete-question" data-id="${index}">Xóa</button>
      </td>
    `;
    questionTableBody.appendChild(tr);
  });

  document.querySelectorAll(".edit-question").forEach(btn => {
    btn.addEventListener("click", () => {
      editId = parseInt(btn.dataset.id);
      const q = questions[editId];
      questionInput.value = q.text;
      const optionsHTML = q.options.map(opt => `
        <div class="option">
          <input type="checkbox" class="checkbox" ${opt.isCorrect ? "checked" : ""}>
          <input type="text" class="option-content" value="${opt.text}">
          <img src="../assets/images/Trash_Full.png" alt="Xóa" class="trash">
        </div>`).join('');
      answerContainer.querySelectorAll(".option").forEach(opt => opt.remove());
      answerContainer.insertAdjacentHTML("beforeend", optionsHTML);
      attachTrashEvents();
      modal.style.display = "flex";
    });
  });

  document.querySelectorAll(".delete-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      questions.splice(id, 1);
      renderQuestions();
    });
  });
}

btnAddQuestion.onclick = () => {
  editId = null;
  questionInput.value = "";
  answerContainer.querySelectorAll(".option").forEach(opt => opt.remove());
  for (let i = 0; i < 2; i++) btnAddAnswer.click();
  modal.style.display = "flex";
};

btnCloseModal.onclick = btnCancelModal.onclick = () => {
  modal.style.display = "none";
};

btnAddAnswer.onclick = () => {
  const div = document.createElement("div");
  div.className = "option";
  div.innerHTML = `
    <input type="checkbox" class="checkbox">
    <input type="text" class="option-content" placeholder="Nhập câu trả lời">
    <img src="../assets/images/Trash_Full.png" class="trash">
  `;
  div.querySelector(".trash").onclick = () => div.remove();
  answerContainer.insertBefore(div, modalError);
};

function attachTrashEvents() {
  document.querySelectorAll(".trash").forEach(img => {
    img.onclick = () => img.closest(".option").remove();
  });
}

btnSaveQuestion.onclick = () => {
  const text = questionInput.value.trim();
  const optionElements = Array.from(answerContainer.querySelectorAll(".option"));
  const options = optionElements.map(opt => {
    return {
      text: opt.querySelector(".option-content").value.trim(),
      isCorrect: opt.querySelector(".checkbox").checked
    };
  }).filter(opt => opt.text);

  if (!text) return showError(modalError, "Vui lòng nhập câu hỏi");
  if (options.length < 2) return showError(modalError, "Phải có ít nhất 2 đáp án");
  if (!options.some(opt => opt.isCorrect)) return showError(modalError, "Phải có ít nhất 1 đáp án đúng");

  if (editId !== null) {
    questions[editId] = { text, options };
  } else {
    questions.push({ text, options });
  }

  modal.style.display = "none";
  renderQuestions();
};

saveBtn.onclick = () => {
  const name = nameInput.value.trim();
  const time = timeInput.value.trim();
  const cat = categorySelect.value;
  if (!name || !time || !cat) {
    showError(errorMessage, "Vui lòng điền đầy đủ thông tin.");
    return;
  }
  const tests = JSON.parse(localStorage.getItem("tests") || "[]");
  const newId = tests.length > 0 ? Math.max(...tests.map(t => t.id)) + 1 : 1;
  tests.push({
    id: newId,
    name,
    time: time + " min",
    categoryId: cat,
    questions,
    questionsCount: questions.length
  });
  localStorage.setItem("tests", JSON.stringify(tests));
  window.location.href = "../pages/test-manager.html";
};

(function loadCategories() {
  const cats = JSON.parse(localStorage.getItem("categories") || "[]");
  categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.emoji} ${c.name}`;
    categorySelect.appendChild(opt);
  });
})();