import { returnHome } from "./modules/main/events.js";
import { Loading } from './components/Loading.js';

window.Loading = Loading;

let accuracyPercentage = 0;
let totalAnswers = 0;
let countOfCorrectAnswers = 0;
let levels = [];

window.BASE_URL = "https://mock-api.driven.com.br/api/v4/buzzquizz";

window.showLoading = () => {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.innerHTML = Loading();
}

window.removeLoading = () => {
  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.innerHTML = "";
}

const isValidURL = (url) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(url);
}

const shuffleAnswers = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const restartQuiz = (currentQuiz) => {
	const restartPage = document.querySelector(".quiz-page");
	accuracyPercentage = 0;
	totalAnswers = 0;
	countOfCorrectAnswers = 0;
	restartPage.remove();
	goToQuizScreen(currentQuiz);
}

const backToHome = () => {
	document.location.reload(true);
}

const getUserQuizzes = async () => {
  const createFirstQuizzContainer = document.querySelector(".create-quiz");
  const containerYourQuizzes = document.querySelector(".container-your-quizzes");
  const yourQuizzes = document.querySelector(".your-quizzes");
  let quizzesUsuario = "";

  if (localStorage.getItem("id")) {
      createFirstQuizzContainer.classList.add("hidden");
      containerYourQuizzes.classList.remove("hidden");
      const id = JSON.parse(localStorage.getItem("id"));

      for (const quizId of id) {
          try {
              const response = await axios.get(`${BASE_URL}/quizzes/${quizId.toString()}`);
              const userQuiz = response.data;

              const quizElement = document.createElement("div");

              quizElement.classList.add("other-quizzes");
              quizElement.setAttribute("data-identifier", "quiz-card");
              quizElement.setAttribute("data-quiz-id", userQuiz.id)
          
              const imgElement = document.createElement("img");
              imgElement.src = userQuiz.image;
          
              const shadowElement = document.createElement("div");
              shadowElement.classList.add("image-shadow");
          
              const spanElement = document.createElement("span");
              spanElement.textContent = userQuiz.title;
          
              quizElement.appendChild(imgElement);
              quizElement.appendChild(shadowElement);
              quizElement.appendChild(spanElement);
          
              quizzesUsuario += quizElement.outerHTML;
          } catch (error) {
              throw error;
          }
      }

      yourQuizzes.innerHTML = quizzesUsuario;

      yourQuizzes.addEventListener("click", (event) => {
        if (event.target.classList.contains("image-shadow")) {
          const quizElement = event.target.closest(".other-quizzes");
          
          if (quizElement) {
            const quizId = quizElement.getAttribute("data-quiz-id");
            goToQuizScreen(quizId);
          }
        }
      });
      
  }
}

const goToQuizScreen = async (id) => {
  try {
    showLoading();
    const mainScreen = document.querySelector(".main-page-body");
    const quiz = await axios.get(`${BASE_URL}/quizzes/${id}`);
    mainScreen.classList.add("hidden");
    displayQuizScreen(quiz.data);
    window.scrollTo(0, 0);
  } catch (error) {  
    throw error;
  }
}

window.displayQuizScreen = (quizData) => {
  removeLoading();
  levels = quizData.levels;

  const body = document.querySelector("body");

  const quizPage = document.createElement("div");
  quizPage.classList.add("quiz-page");
  quizPage.innerHTML = `
    <div class="cover-photo-container">
      <img src="${quizData.image}"/>
      <span>${quizData.title}</span>
    </div>
  `;

  quizData.questions.forEach((item) => {
    const answerBox = document.createElement("div");
    answerBox.classList.add("individual-question-container");
    answerBox.dataset.identifier = "question-card";

    const wrapperContainer = document.createElement("div");
    wrapperContainer.classList.add("wrapper-container");

    const questionCard = document.createElement("div");
    questionCard.classList.add("individual-question-title-container");
    questionCard.style.backgroundColor = item.color;

    const answerCard = document.createElement("div");
    answerCard.classList.add("individual-question-answers-container");

    questionCard.innerHTML = `
      <h2 style=" color: ${item.color >= "#7FFFFF" ? "black" : "white"}">${item.title}</h2>
    `;

    const answers = displayQuizAnswers(item.answers, quizData.questions.length);
    answers.forEach(answer => {
      answerCard.appendChild(answer);
    });

    wrapperContainer.appendChild(questionCard);
    wrapperContainer.appendChild(answerCard);

    answerBox.appendChild(wrapperContainer);
    quizPage.appendChild(answerBox);
  });

  const endOfQuizContainer = document.createElement("div");
  endOfQuizContainer.classList.add("quiz-end-container", "hidden");
  endOfQuizContainer.innerHTML = `
    <div class="result-container" data-identifier="quiz-result">
      <h1 class="end-quiz-title" >${accuracyPercentage}% accuracy: ${levels[0].title}</h1>
    </div>
    <div class="image-and-description">
      <img src=${levels[0].image}"/>
      <p class= "quiz-text">${levels[0].text}</p>
    </div>
    <button class="restart-quiz" onclick="restartQuiz(${quizData.id})">
      Restart Quiz
    </button>
    <button class="back-to-home" onclick="backToHome()">
      Back to home
    </button>
  `;

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('restart-quiz')) {
      restartQuiz(quizData.id);
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('back-to-home')) {
      backToHome();
    }
  });

  quizPage.appendChild(endOfQuizContainer);
  body.appendChild(quizPage);
}

const displayQuizAnswers = (answers, quantityOfEachAnswer) => {
  let ARRAY_ANSWERS = [];

  answers.forEach((item) => {
    const answerContainer = document.createElement("div");
    answerContainer.classList.add("individual-answer-container", item.isCorrectAnswer ? "correct-answer" : "wrong-answer");
    answerContainer.dataset.identifier = "answer";
    answerContainer.onclick = () => selectAnswer(answerContainer, quantityOfEachAnswer);
    
    const img = document.createElement("img");
    img.src = item.image;

    const span = document.createElement("span");
    span.textContent = item.text;

    answerContainer.appendChild(img);
    answerContainer.appendChild(span);

    ARRAY_ANSWERS.push(answerContainer);
  });

  return shuffleAnswers(ARRAY_ANSWERS);
}

const selectAnswer = (selectedAnswer, numberOfAnswers) => {
	const individualQuestionAnswersContainer = selectedAnswer.parentNode;
	const individualQuestionTitleContainer = individualQuestionAnswersContainer.previousElementSibling;
	const individualAnswerContainer = individualQuestionAnswersContainer.children;
	const wrongAnswers = individualQuestionAnswersContainer.querySelectorAll(".wrong-answer");
	const correctAnswer = individualQuestionAnswersContainer.querySelector(".correct-answer");

	Array.from(individualAnswerContainer).forEach((item) => {
		item.classList.add("unselected");
		item.onclick = null;
	});

	Array.from(wrongAnswers).forEach((item) => {
		item.classList.add("red");
	});

	if (selectedAnswer.classList.contains("correct-answer")) {
		countOfCorrectAnswers++;
	}

	selectedAnswer.classList.remove("unselected");
	correctAnswer.classList.add("green");
	totalAnswers++;

	if (totalAnswers === numberOfAnswers) {
		const percentage = Math.round((countOfCorrectAnswers / numberOfAnswers) * 100);
		quizResult(percentage);
	}

  setTimeout(() => {
    const question = document.querySelectorAll(".individual-question-title-container");
    const endQuiz = document.querySelector(".quiz-end-container");

    let scrolling = false;
    let targetquestion = 0;

    window.onscroll = () => {
      scrolling = true;
    }

    Array.from(question).forEach((item, index) => {
      if (item === individualQuestionTitleContainer) {
        targetquestion = index;
      }
    });

    if (targetquestion + 1 < question.length && !scrolling) {
      question[targetquestion + 1].scrollIntoView();
    } else if (!scrolling) {
      endQuiz.scrollIntoView();
    }
  }, 1500);
}

const quizResult = (percentage) => {
	const endQuiz = document.querySelector(".quiz-end-container");
	endQuiz.classList.remove("hidden");

	let reachedLevel;
	const finalLevel = levels.length - 1;

	for (let i = finalLevel; i >= 0; i--) {
		if (percentage >= levels[i].minValue) {
			reachedLevel = levels[i];
			break;
		}
	}

	const endQuizTitle = endQuiz.querySelector(".end-quiz-title");
	endQuizTitle.innerHTML = `${percentage}% accuracy: ${reachedLevel.title}`;
	const endQuizImage = endQuiz.querySelector("img");
	endQuizImage.setAttribute("src", reachedLevel.image);
	const quizOutcomeText = endQuiz.querySelector(".quiz-text");
	quizOutcomeText.innerHTML = `${reachedLevel.text}`;
}

const displayGeneralQuizzes = async () => {
  try {
    showLoading();

    await getUserQuizzes();

    const response = await axios.get(`${BASE_URL}/quizzes`);
    removeLoading();

    const quizList = response.data;
    const quizBox = document.querySelector(".quiz-box");

    quizList.forEach((quiz) => {
      if (!isUserQuiz(quiz.id)) {
        if (!isValidURL(quiz.image)) {
          quiz.image = "https://http.cat/404.jpg";
        }

        const quizCard = document.createElement("div");
        quizCard.classList.add("other-quizzes");
        quizCard.dataset.identifier = "quiz-card";
        quizCard.setAttribute("data-quiz-id", quiz.id);

        quizCard.innerHTML = `
          <img src="${quiz.image}"/>
          <div class="image-shadow"></div>
          <span>${quiz.title}</span>
        `;

        quizBox.appendChild(quizCard);
      }
    });

    quizBox.addEventListener("click", (event) => {
      const quizCard = event.target.closest(".other-quizzes[data-identifier='quiz-card']");
      if (quizCard) {
        const quizId = quizCard.getAttribute("data-quiz-id");
        if (quizId) {
          goToQuizScreen(quizId);
        }
      }
    });
  } catch (error) {
    throw error;
  }
};


const isUserQuiz = (quizId) => {
  const userQuizzesIds = JSON.parse(localStorage.getItem("id")) || [];
  return userQuizzesIds.includes(quizId);
};

displayGeneralQuizzes();

const handleEvents = ( () => {
  returnHome();
})();

