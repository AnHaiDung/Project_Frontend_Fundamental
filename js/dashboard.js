const quizzes = JSON.parse(localStorage.getItem("quizzes")) || [
    {
      title: "🏠 Đời sống",
      description: "Thách thức sự hiểu biết của bạn",
      questions: 15,
      plays: 2,
      image: "../assets/images/Image.png"
    },
    {
      title: "📚 Kiến thức tổng hợp",
      description: "Kiểm tra kiến thức đa lĩnh vực",
      questions: 20,
      plays: 5,
      image: "../assets/images/Image.png"
    },
    {
      title: "🧪 Khoa học vui",
      description: "Bạn có phải là nhà khoa học?",
      questions: 10,
      plays: 3,
      image: "../assets/images/Image.png"
    },
    {
      title: "🌏 Địa lý thế giới",
      description: "Bạn biết bao nhiêu quốc gia?",
      questions: 12,
      plays: 4,
      image: "../assets/images/Image.png"
    },
    {
      title: "🎵 Âm nhạc phổ thông",
      description: "Bạn có gu âm nhạc tốt không?",
      questions: 15,
      plays: 6,
      image: "../assets/images/Image.png"
    }
  ];

  const quizList = document.querySelector("#quiz-list");

  function renderQuizBoxes() {
    quizList.innerHTML = "";
  
    quizzes.forEach((quiz) => {
      const box = document.createElement("div");
      box.className = "quiz-box";
      box.innerHTML = `
        <img src="${quiz.image}" alt="">
        <div class="content">
          <h3>${quiz.title}</h3>
          <p>${quiz.description}</p>
          <p>${quiz.questions} câu hỏi - ${quiz.plays} lượt chơi</p>
          <button class="btn-play">Chơi</button>
        </div>
      `;
      quizList.appendChild(box);
    });
  }
  
  renderQuizBoxes();
  
