//Variable Declaration
const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_SHELF";

//CekLocalStorage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung local storage !");
    return false;
  }
  return true;
}

//EventRender
document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookshelfList = document.getElementById(
    "uncompleteBookshelfList"
  );
  uncompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBooklist(bookItem);
    if (!bookItem.isCompleted) {
      uncompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);
    }
  }
});

//SavedEvent
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

//AddBook
function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete");
  isCompleted.addEventListener("change", function () {
    if (isCompleted.checked) {
      document.getElementById("cek").innerText = "Selesai dibaca";
    } else {
      document.getElementById("cek").innerText = "Belum selesai dibaca";
    }
  });
  let status;
  if (isCompleted.checked) {
    status = true;
  } else {
    status = false;
  }

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    status
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
}

//generateId
function generateId() {
  return +new Date();
}

//generateBookObject
function generateBookObject(
  bookId,
  bookTitle,
  bookAuthor,
  bookYear,
  isCompleted
) {
  return {
    bookId,
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  };
}

//membuat Booklist
function makeBooklist(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerHTML = bookObject.bookTitle;
  const bookAuthor = document.createElement("p");
  bookAuthor.innerHTML = "Penulis : " + bookObject.bookAuthor;
  const bookYear = document.createElement("p");
  bookYear.innerHTML = "Tahun : " + bookObject.bookYear;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(bookTitle, bookAuthor, bookYear);
  container.setAttribute("id", "book-${bookObject.bookId}");

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerHTML = "Belum Selesai Dibaca";
    undoButton.addEventListener("click", function () {
      undoBookFromComplete(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerHTML = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBookFromBooklist(bookObject.id);
    });

    bookContainer.append(undoButton, removeButton);
    container.append(bookContainer);
  } else {
    const checklistButton = document.createElement("button");
    checklistButton.classList.add("green");
    checklistButton.innerHTML = "Selesai dibaca";

    checklistButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerHTML = "Hapus Buku";

    removeButton.addEventListener("click", function () {
      removeBookFromBooklist(bookObject.id);
    });

    bookContainer.append(checklistButton, removeButton);
    container.append(bookContainer);
  }
  return container;
}

//AddBookToCompleted
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
  alert("Buku anda telah berhasil ditambahkan...");
}

//findBook
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

//undoBookFromComplete
function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
  alert("Buku anda telah berhasil di Undo untuk dibaca...");
}

//removeBookFromComplete
function removeBookFromBooklist(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
  alert("Buku anda telah berhasil dihapus...");
}

//findBookIndex
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

//saveData
function saveDataToLocalStorage() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

//loadData
function loadDataFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  let bookList = JSON.parse(data);

  if (bookList !== null) {
    for (const book of bookList) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

//DOMContentLoad
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromLocalStorage();
  }
});
