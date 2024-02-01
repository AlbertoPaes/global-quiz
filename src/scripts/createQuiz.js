let basicCreationData;
let quizData;

const createInputNode = (...args) => {
  const [placeholder, id, name, type, minlength, maxlength, min, max, pattern, required] = args;

  const input = document.createElement("input");
  input.setAttribute("placeholder", placeholder);
  input.setAttribute("name", name);

  if (id !== undefined) input.setAttribute("id", id);
  if (type !== undefined) input.setAttribute("type", type);
  if (minlength !== undefined) input.setAttribute("minlength", minlength);
  if (maxlength !== undefined) input.setAttribute("maxlength", maxlength);
  if (min !== undefined) input.setAttribute("min", min);
  if (max !== undefined) input.setAttribute("max", max);
  if (pattern !== undefined) input.setAttribute("pattern", pattern);
  if (required) input.setAttribute("required", "");

  return input;
}

const createInputHTML = (...args) => {
  return createInputNode(...args).outerHTML;
}

const showCreationScreen = () => {
  const mainScreen = document.querySelector(".main-page-body");
  const creationScreen = document.querySelector(".basic-info-screen");

  creationScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");

  const instructionParagraph = document.createElement("p");
  instructionParagraph.classList.add("instruction");
  instructionParagraph.textContent = "Start from the beginning";

  const creationContent = document.createElement("div");
  creationContent.classList.add("creation-content");

  const form = document.createElement("form");
  form.onsubmit = function () {
    checkCreation();
    return false;
  };
  form.setAttribute("accept-charset", "utf-8");
  form.setAttribute("name", "basic-info");

  const dataQuiz = document.createElement("div");
  dataQuiz.classList.add("data-quiz");

  const titleInput = createInputNode("Title of your quiz", "creation-title", "quiz_title", "text", 20, 65, undefined, undefined, undefined, true);
  titleInput.addEventListener("input", () => {
    const inputValue = titleInput.value;
  
    if (inputValue.length < 20 || inputValue.length > 65) {
      titleInput.classList.add("input-error");

      document.querySelector(".button-proceed").disabled = true;
      document.querySelector(".button-proceed").style.cursor = "not-allowed";

    } else {
      titleInput.classList.remove("input-error");

      document.querySelector(".button-proceed").disabled = false;
      document.querySelector(".button-proceed").style.cursor = "pointer";
    }
  });

  const imageInput = createInputNode("URL of your quiz image", "creation-img", "image_quiz", "url", undefined, undefined, undefined, undefined, undefined, true);
  const questionsInput = createInputNode("Number of quiz questions", "creation-question-quantity", "quiz_questions", "number", undefined, undefined, 3, undefined, undefined, true);
  const levelsInput = createInputNode("Number of quiz levels", "creation-level-quantity", "quiz_levels", "number", undefined, undefined, 2, undefined, undefined, true);

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.classList.add("button-proceed");

  const buttonText = document.createElement("p");
  buttonText.textContent = "Prosseguir para criar perguntas";

  submitButton.appendChild(buttonText);

  dataQuiz.appendChild(titleInput);
  dataQuiz.appendChild(imageInput);
  dataQuiz.appendChild(questionsInput);
  dataQuiz.appendChild(levelsInput);

  form.appendChild(dataQuiz);
  form.appendChild(submitButton);

  creationContent.appendChild(instructionParagraph);
  creationContent.appendChild(form);

  creationScreen.appendChild(creationContent);
}
  
const checkCreation = () => {
  const creationQuizTitle = document.querySelector("#creation-title").value;
  const creationQuizImg = document.querySelector("#creation-img").value;
  const creationQuizQuestionQuantity = document.querySelector("#creation-question-quantity").value;
  const creationQuizLevelQuantity = document.querySelector("#creation-level-quantity").value;

  quizData = {
    title: creationQuizTitle,
    image: creationQuizImg,
    questions: [],
    levels: [],
  };

  basicCreationData = {
    title: creationQuizTitle,
    image: creationQuizImg,
    questionQuantity: creationQuizQuestionQuantity,
    levels: creationQuizLevelQuantity,
  };

  showQuestionCreationScreen(creationQuizQuestionQuantity);
}

const showQuestionCreationScreen = (questionQuantity) => {
  const questionsScreen = document.querySelector(".questions-screen");
  const infoScreen = document.querySelector(".basic-info-screen");

  questionsScreen.classList.remove("hidden");
  infoScreen.classList.add("hidden");

  let questionContainer = "";

  for (let i = 0; i < parseInt(questionQuantity); i++) {
    const questionId = `question_${i + 1}`;
  
    questionContainer += `
      <div class="quiz-creation-box" onclick="edit(this)" data-identifier="expand">
        <h3 class="title">Question ${i + 1}</h3>
        <ion-icon class="pencil" name="create-outline"></ion-icon>
        <div class="form-container questions hidden">
          <div class="question" data-identifier="question">
            ${createInputHTML("Question text", questionId, "question_text", undefined, 20, undefined, undefined, undefined, undefined, true)}
            ${createInputHTML("Background color of the question (#RRGGBB)", questionId, "background_color_question", "text", undefined, undefined, undefined, undefined, "^#[A-Fa-f0-9]{6}$", true)}
          </div>
          <h3>Correct Answer</h3>
          <div class="correct-answer">
            ${createInputHTML("Correct answer", questionId, "correct_answer_text", "text", 1, undefined, undefined, undefined, undefined, true)}
            ${createInputHTML("Image URL", questionId, "correct_answer_img_url", "url", undefined, undefined, undefined, undefined, undefined, true)}
          </div>
  
          <h3>Incorrect Answers</h3>
          <div class="incorrect-answers">
            <div class="incorrect-answer">
              ${createInputHTML("Incorrect answer 1", questionId, "incorrect_answer_text", "text", 1, undefined, undefined, undefined, undefined, true)}
              ${createInputHTML("Image URL 1", questionId, "incorrect_answer_img_url", "url", undefined, undefined, undefined, undefined, undefined, true)}
            </div>
  
            <div class="incorrect-answer">
              ${createInputHTML("Incorrect answer 2", questionId, "incorrect_answer_text", "text", 1, undefined, undefined, undefined, undefined, undefined)}
              ${createInputHTML("Image URL 2", questionId, "incorrect_answer_img_url", "url", undefined, undefined, undefined, undefined, undefined, undefined)}
            </div>
  
            <div class="incorrect-answer">
              ${createInputHTML("Incorrect answer 3", questionId, "incorrect_answer_text", "text", 1, undefined, undefined, undefined, undefined, undefined)}
              ${createInputHTML("Image URL 3", questionId, "incorrect_answer_img_url", "url", undefined, undefined, undefined, undefined, undefined, undefined)}
            </div>
          </div>
        </div>
      </div>`;
  }

  questionsScreen.innerHTML += `
    <p class="instruction">Create your questions</p>
    <div class="creation-content">
      <form onsubmit="checkQuestions(); return false" accept-charset="utf-8" name="info-perguntas">
        ${questionContainer}
        <button type="submit" class="button-proceed">
          <p>Proceed to create levels</p>
        </button>
      </form>
    </div>`;

};

const edit = (createQuizBox) => {
  const active = document.querySelector(".active");
  if (active !== null) {
    toggleClasses(active);
    active.classList.remove("active");
  }
  toggleClasses(createQuizBox);
  createQuizBox.classList.add("active");
}

const toggleClasses = (element) => {
  const questionTitle = element.querySelector(".title");
  const ionIconPencil = element.querySelector(".pencil");
  const questionsFormContainer = element.querySelector(".form-container");

  questionTitle.classList.toggle("margin");
  ionIconPencil.classList.toggle("hidden");
  questionsFormContainer.classList.toggle("hidden");
}

const collectQuestionData = (questionBox) => {
  const title = questionBox.querySelector('input[name="question_text"]').value;
  const color = questionBox.querySelector('input[name="background_color_question"]').value;

  const correctAnswer = {
    text: questionBox.querySelector('input[name="correct_answer_text"]').value,
    image: questionBox.querySelector('input[name="correct_answer_img_url"]').value,
    isCorrectAnswer: true,
  };

  const incorrectAnswers = Array.from(questionBox.querySelectorAll(".incorrect-answer"))
    .map((incorrectAnswer) => ({
      text: incorrectAnswer.querySelector('input[name="incorrect_answer_text"]').value,
      image: incorrectAnswer.querySelector('input[name="incorrect_answer_img_url"]').value,
      isCorrectAnswer: false,
    }));

  return { title, color, answers: [correctAnswer, ...incorrectAnswers] };
};

const checkQuestions = () => {
  const questionsFormContainers = document.querySelectorAll(".form-container.questions");
  const questionsData = Array.from(questionsFormContainers).map(collectQuestionData);
  quizData.questions.push(...questionsData);

  showLevelsScreen(basicCreationData.levels);
};

const showLevelsScreen = (levelsQuantity) => {
  const questionsScreen = document.querySelector(".questions-screen");
  const levelsScreen = document.querySelector(".levels-screen");

  questionsScreen.classList.add("hidden");
  levelsScreen.classList.remove("hidden");

  let levelsContainer = "";

  for (let i = 0; i < parseInt(levelsQuantity); i++) {
    const levelId = `level_${i + 1}`;

    levelsContainer += `
      <div class="quiz-creation-box" onclick="edit(this)" data-identifier="expand">
        <h3 class="title">Level ${i + 1}</h3>
        <ion-icon class="pencil" name="create-outline"></ion-icon>
        <div class="form-container levels hidden">
          <div class="input-box" data-identifier="level">
            ${createInputHTML("Level Title", levelId, "level_title", "text", 10, undefined, undefined, undefined, undefined, true)}
            ${createInputHTML("Minimum Accuracy Percentage", levelId, "level_minValue", "number", undefined, undefined, 0, 100, undefined, true)}
            ${createInputHTML("Level Image URL", levelId, "level_image_url", "url", undefined, undefined, undefined, undefined, /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, true)}
            <textarea class="description" placeholder="Level Description" id="${levelId}_level_description" name="level_description" minlength="30" type="text" required></textarea>
          </div>
        </div>
      </div>
    `;
  }

  levelsScreen.innerHTML = `
	<p class="instruction">Now, decide the levels!</p>
	<div class="creation-content">
		<form
		onsubmit = "checkLevels(); return false"
		accept-charset="utf-8"
		name="quests-info">
			${levelsContainer}		
			<button type="submit" class="button-proceed">
				<p>
					Finish Quiz
				</p>
			</button>
		</form>
	</div>	
	`;

}

const collectLevelsData = (levelBox) => {
  const title = levelBox.querySelector('input[name="level_title"]').value;
  const image = levelBox.querySelector('input[name="level_image_url"]').value;
  const text = levelBox.querySelector('textarea[name="level_description"]').value;
  const minValueString = levelBox.querySelector('input[name="level_minValue"]').value;

  const minValue = parseInt(minValueString, 10);

  return { title, image, text, minValue };
}

const checkLevels = () => {
    const levelsFormContainers = document.querySelectorAll(".form-container.levels");
    const levelsData = Array.from(levelsFormContainers).map(collectLevelsData);
  
    quizData.levels.push(...levelsData);
    submitQuiz();
}

const submitQuiz = async () => {
  try {
    showLoading();

    quizData.questions.map((question) => {
      question.answers = question.answers.filter((answer) => answer.text !== "");
    });

    const menorMinValue = Math.min(...quizData.levels.map(level => level.minValue));

    if (menorMinValue !== 0) {
      const indiceMenorMinValue = quizData.levels.findIndex(level => level.minValue === menorMinValue);
    
      if (indiceMenorMinValue !== -1) {
        quizData.levels[indiceMenorMinValue].minValue = 0;
      }
    }

    const response = await axios.post(`${BASE_URL}/quizzes`, quizData);

    removeLoading();
    saveID(response.data.id);
    showFinalScreen(response.data.id);

  } catch (error) {
    window.location.reload();
    throw error;
  }
}

const saveID = (quizId) => {
	if (localStorage.getItem("id")) {
		localStorage.getItem("id");
		const id = JSON.parse(localStorage.getItem("id"));
		id.push(quizId);
		localStorage.setItem("id", JSON.stringify(id));
	} else {
		localStorage.setItem("id", JSON.stringify([quizId]));
	}
}

const showFinalScreen = (quizId) => {
  const finalScreen = document.querySelector(".final-screen");
	const levelsScreen = document.querySelector(".levels-screen");
	levelsScreen.classList.add("hidden");
	finalScreen.classList.remove("hidden");

	finalScreen.innerHTML = `
	<h3 class="instruction">Your quiz is ready!</h3>
	<div onclick ="accessQuiz(${quizId.toString()})" class="image-container">
		<img src="${basicCreationData.image}"/>
		<div class="image-shadow"></div>
		<span>${basicCreationData.title}</span>
	</div>
	<button onclick = "accessQuiz(${quizId.toString()})"class="button-proceed">
	  <p>Access Quiz</p>
  </button>
	<p class="back-to-home" onclick="backToHome()">Back to home</p>	
	`;
}

const accessQuiz = async (id) => {
  try {
    showLoading();
    const finalScreen = document.querySelector(".final-screen");
    finalScreen.classList.add("hidden");

    const response = await axios.get(`${BASE_URL}/quizzes/${id}`);
    displayQuizScreen(response.data);
  } catch (error) {
    window.location.reload();
    throw error;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const createQuizzButton = document.querySelector('.button-creation');
  if (createQuizzButton) {
    createQuizzButton.addEventListener("click", showCreationScreen);
  }
});