// Элементы
const lengthSlider = document.querySelector("#lenRange");
const options = document.querySelectorAll(".option input");
const copyIcon = document.querySelector("#copyBtn");
const passwordInput = document.querySelector("#pwd");
const passIndicator = document.querySelector("#indicator");
const generateBtn = document.querySelector("#genBtn");
const langButtons = document.querySelectorAll(".lang-btn");
const lenOut = document.querySelector("#lenOut");

// Наборы символов
const characters = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!$%&|[](){}:;.,*+-#@<>~"
};

// I18N
const i18n = {
  ru: {
    title: "Генератор паролей",
    length_label: "Длина пароля",
    settings: "Настройки",
    lower: "Строчные (a-z)",
    upper: "Прописные (A-Z)",
    nums: "Числа (0-9)",
    symb: "Символы (!-$^+)",
    no_dup: "Исключить дубли",
    spaces: "Разрешить пробелы",
    generate: "Сгенерировать",
    home: "На главную",
    copy_title: "Скопировать",
    copied: "check",
    copy_icon: "copy_all"
  },
  en: {
    title: "Password Generator",
    length_label: "Password length",
    settings: "Settings",
    lower: "Lowercase (a-z)",
    upper: "Uppercase (A-Z)",
    nums: "Numbers (0-9)",
    symb: "Symbols (!-$^+)",
    no_dup: "Exclude duplicates",
    spaces: "Allow spaces",
    generate: "Generate",
    home: "Home",
    copy_title: "Copy",
    copied: "check",
    copy_icon: "copy_all"
  }
};

function applyLang(lang) {
  const dict = i18n[lang] || i18n.ru;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  // заголовок
  const h2 = document.querySelector("h2[data-i18n='title']");
  if (h2) document.title = h2.textContent;

  // тултип и иконка копирования
  copyIcon.title = dict.copy_title;
  copyIcon.innerText = dict.copy_icon;

  // активная кнопка
  langButtons.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));

  // сохранить выбор
  localStorage.setItem("pg_lang", lang);
}

function initLang() {
  const saved = localStorage.getItem("pg_lang") || "ru";
  applyLang(saved);
}

// Генерация пароля
const generatePassword = () => {
  let staticPassword = "",
      randomPassword = "",
      excludeDuplicate = false,
      passLength = Number(lengthSlider.value);

  options.forEach(option => {
    if (option.checked) {
      if (option.id !== "exc-duplicate" && option.id !== "spaces") {
        staticPassword += characters[option.id];
      } else if (option.id === "spaces") {
        staticPassword += `  ${staticPassword}  `;
      } else {
        excludeDuplicate = true;
      }
    }
  });

  // если ничего не выбрано — по умолчанию строчные
  if (!staticPassword) staticPassword = characters.lowercase;

  for (let i = 0; i < passLength; i++) {
    const randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
    if (excludeDuplicate) {
      !randomPassword.includes(randomChar) || randomChar === " "
        ? randomPassword += randomChar
        : i--;
    } else {
      randomPassword += randomChar;
    }
  }
  passwordInput.value = randomPassword;
};

const updatePassIndicator = () => {
  const val = Number(lengthSlider.value);
  passIndicator.id = val <= 8 ? "weak" : val <= 16 ? "medium" : "strong";
};

const updateSlider = () => {
  lenOut.textContent = lengthSlider.value;
  generatePassword();
  updatePassIndicator();
};

// Копирование
const copyPassword = () => {
  if (!passwordInput.value) return;
  navigator.clipboard.writeText(passwordInput.value);
  copyIcon.innerText = i18n[document.documentElement.lang]?.copied || "check";
  copyIcon.style.color = "#2f5bff";
  setTimeout(() => {
    copyIcon.innerText = i18n[document.documentElement.lang]?.copy_icon || "copy_all";
    copyIcon.style.color = "";
  }, 1200);
};

// Слушатели
copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click", generatePassword);
langButtons.forEach(btn => btn.addEventListener("click", () => applyLang(btn.dataset.lang)));

// Инициализация
initLang();
updateSlider();

// Защита от отсутствующих элементов (если вдруг где-то переиспользуете скрипт)
const scrollButton = document.getElementById('scrollButton');
if (scrollButton) {
  scrollButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollBy({ top: 200, behavior: 'smooth' });
  });
}
