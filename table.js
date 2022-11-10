const BOOKS_PER_PAGE = 10;
let books = [];
let filteredBooks = [];
let currentPage = 0;
const prevButton = document.querySelector(".prev-button");
const radioChoices = document.getElementsByName("attribute");
const nextButton = document.querySelector(".next-button");
const searchInput = document.querySelector(".search-query-input");
const resultNumber = document.querySelector(".result-number");

(async function runOnlyOnce() {
  addEventListeners();
  await loadAllBooksFromServer();
  addBooksToTable();
})();

const getBookMarkup = (book) =>
  `<tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.subject}</td>
        <td>${book["published-date"]}</td>
    </tr>
`;

const updateTableFooter = () => {
  if (currentPage === 0) {
    prevButton.disabled = true;
    nextButton.disabled = false;
  } else if (currentPage >= Math.floor((filteredBooks.length) / BOOKS_PER_PAGE) ) {
    nextButton.disabled = true;
    prevButton.disabled = false;
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
  }
};

function addBooksToTable() {
  const totalBooks = filteredBooks.length;
  const tbodyDiv = document.querySelector("tbody");
  let output = "";
  for (
    let i = 0;
    i < BOOKS_PER_PAGE && currentPage * BOOKS_PER_PAGE + i < totalBooks;
    ++i
  ) {
    const book = filteredBooks[currentPage * BOOKS_PER_PAGE + i];

    output += getBookMarkup(book);
  }

  tbodyDiv.innerHTML = output;
  resultNumber.textContent = filteredBooks.length;

  updateTableFooter();
}

async function loadAllBooksFromServer() {

  const response = await fetch("./books.json");
  books = await response.json();
  filteredBooks = [...books];
}

function addEventListeners() {
  prevButton.addEventListener("click", () => {
    currentPage -= 1;
    addBooksToTable();
  });

  nextButton.addEventListener("click", () => {
    currentPage += 1;
    addBooksToTable();
  });

  searchInput.addEventListener("input", onSearchQuery);
}

function sortByTitle(asc) {
  function compare(a, b) {
    if (a.title < b.title === asc) {
      return -1;
    }
    if (a.title > b.title === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}
function sortByAuthor(asc) {
  function compare(a, b) {
    if (a.author < b.author === asc) {
      return -1;
    }
    if (a.author > b.author === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}
function sortBySubject(asc) {
  function compare(a, b) {
    if (a.subject < b.subject === asc) {
      return -1;
    }
    if (a.subject > b.subject === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}

function onSearchQuery(e) {
  let attributeSelected = "";

  var filter = document.getElementById("filter-by");
  var filter_by_val = filter.value;
  var filter_by_text = filter.options[filter.selectedIndex].text;
  console.log(filter_by_text);
  attributeSelected = filter_by_text.toLowerCase();

  const query = e.target.value;

  filteredBooks = filteredBooks.filter((book) =>
    book[attributeSelected].toLowerCase().includes(query.toLowerCase())
  );

  if (query === "") {
    filteredBooks = [...books];
  }

  addBooksToTable();
}
