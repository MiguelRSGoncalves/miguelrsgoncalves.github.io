var lastTab = '';
var isInProjectWindow = false;

const tabsEnum = {
  home: "home",
  gameDev: "game-dev",
  projects: "projects",
  contacts: "contacts"
}

var tabs = [];
var mainContent;
var pageTitle;

function updateMainContent(data) {
  cleanupResources();
  scrollToTheTop();
  mainContent.innerHTML = data;
  startObsevingVideos();
}

function loadTab(tabName) {
  if (tabName === lastTab && !isInProjectWindow) {
    scrollToTheTop();
    closeFilterDropdown();
    return;
  } else {
    lastTab = tabName;
  }

  const path = `tabs/${tabName}.html`;

  fetch(path)
    .then(response => response.text())
    .then(data => {
      isInProjectWindow = false;
      pageTitle.innerHTML = "";
      pageTitle.classList.remove('active');
      updateMainContent(data);
      perTabLoad(tabName);
      tabs.forEach(t => t.classList.remove("active"));
      document.getElementById(tabName).classList.add("active");
    })
    .catch(err => {
      console.error("Error loading the content: ", err);
      mainContent.innerHTML = "<p>Error loading content</p>";
    });
}

function loadPage(pageURL, title) {
  fetch(pageURL)
    .then(response => response.text())
    .then(data => {
      isInProjectWindow = true;
      if(title) {pageTitle.innerHTML = title; pageTitle.classList.add('active')}
      updateMainContent(data);
    })
    .catch(error => {
      console.error("Error loading project:", error);
      mainContent.innerHTML = `<p>Error loading project. Please try again.</p>`;
    });
}

function perTabLoad(tabName) {
  switch (tabName) {
    case tabsEnum.projects:
      loadProjects('card-container', 'assets/page-data-files/projects-data.json');
      return;
    case tabsEnum.gameDev:
      loadProjects('card-container', 'assets/page-data-files/game-dev-data.json');
      return;
    default:
      return;
  }
}

function loadEmbeddedProject(startButton, container, embeddedProjectHTML, loadingScreen) {
  const embeddedProjectContent = document.getElementById(container);
  const loadingScreenElement = document.getElementById(loadingScreen);

  if(startButton.innerHTML == 'Start') {
    loadingScreenElement.style.visibility = 'visible';
    fetch(embeddedProjectHTML)
    .then(response => response.text())
    .then(data => {
      startButton.innerHTML = "Stop"
      embeddedProjectContent.innerHTML = data;
    })
    .catch(error => {
      loadingScreenElement.style.visibility = 'hidden';
      console.error("Error loading embedded project:", error);
      embeddedProjectContent.innerHTML = `<p>Error loading project. Please try again.</p>`;
    });
  } else {
    loadingScreenElement.style.visibility = 'hidden';
    startButton.innerHTML = "Start"
    embeddedProjectContent.innerHTML = "";
  }
}

function restartEmbeddedProject(startButton, container, embeddedProjectHTML, loadingScreen) {
  const embeddedProjectContent = document.getElementById(container);
  const startButtonElement = document.getElementById(startButton);
  const loadingScreenElement = document.getElementById(loadingScreen);

  if(startButtonElement.innerHTML == 'Stop') {
    loadingScreenElement.style.visibility = 'visible';
    fetch(embeddedProjectHTML)
    .then(response => response.text())
    .then(data => {
      embeddedProjectContent.innerHTML = data;
    })
    .catch(error => {
      loadingScreenElement.style.visibility = 'hidden';
      console.error("Error loading embedded project:", error);
      embeddedProjectContent.innerHTML = `<p>Error loading project. Please try again.</p>`;
    });
  }
}

function scrollToTheTop() {
  window.scrollTo(0, 0);
}

function cleanupResources() {
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }
  stopObservingVideos();
}