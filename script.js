// Book data used in all pages
const books = [
  {
    id: 1,
    title: "The Godfather",
    author: "Mario Puzo",
    genre: "Crime / Classic",
    publisher: "Arrow Books",
    price: 20,
    image: "./godfather.jpg",
    rating: 5,
    description: "A classic crime novel about the Corleone family, power, loyalty, and the violent world of organized crime in America.",
    preview: "Sample preview: The story introduces the Corleone family and follows how power, family duty, and revenge shape their lives."
  },
  {
    id: 2,
    title: "Mexican Gothic",
    author: "Silvia Moreno-Garcia",
    genre: "Gothic Horror",
    publisher: "Del Rey",
    price: 19,
    image: "./mexican-gothic.jpg",
    rating: 4,
    description: "A gothic horror novel set in 1950s Mexico, where Noem\u00ed Taboada visits a remote house to investigate her cousin's disturbing claims.",
    preview: "Sample preview: Noem\u00ed arrives at High Place and slowly discovers that the house, the family, and the past are all deeply unsettling."
  },
  {
    id: 3,
    title: "The Hacienda",
    author: "Isabel Ca\u00f1as",
    genre: "Gothic Horror",
    publisher: "Berkley",
    price: 19,
    image: "./the-hacienda.jpg",
    rating: 4,
    description: "A haunted-house gothic novel set after the Mexican War of Independence, where Beatriz enters a dangerous estate filled with dark secrets.",
    preview: "Sample preview: Beatriz reaches Hacienda San Isidro hoping for safety, but the house quickly reveals signs of fear, silence, and haunting."
  },
  {
    id: 4,
    title: "The Boys from Biloxi",
    author: "John Grisham",
    genre: "Legal Thriller",
    publisher: "Vintage",
    price: 18,
    image: "./boys-from-biloxi.jpg",
    rating: 5,
    description: "A legal thriller about two childhood friends from Biloxi whose families grow into conflict on opposite sides of the law.",
    preview: "Sample preview: The novel begins in Biloxi and follows how friendship, crime, and justice slowly pull two families toward a courtroom battle."
  }
];

const favoriteKey = "favoriteBooks";
const cartKey = "cartBooks";

document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.getAttribute("data-page");

  updateCartCount();

  if (page === "home") {
    loadHomePage();
  }

  if (page === "book") {
    loadBookPage();
  }

  if (page === "favorites") {
    loadFavoritesPage();
  }

  if (page === "contact") {
    loadContactPage();
  }

  if (page === "cart") {
    loadCartPage();
  }

  if (page === "login") {
    loadLoginPage();
  }
});

// Home page
function loadHomePage() {
  const latestBooks = books.slice(0, 2);
  const latestContainer = document.getElementById("latestBooks");
  const allBooksContainer = document.getElementById("allBooks");
  const searchInput = document.getElementById("searchInput");
  const searchResult = document.getElementById("searchResult");

  if (latestContainer) {
    latestContainer.innerHTML = latestBooks.map(function (book) {
      return createLatestCard(book);
    }).join("");
  }

  if (allBooksContainer) {
    showBooks(books, allBooksContainer);
  }

  if (searchResult) {
    searchResult.textContent = "Showing " + books.length + " books.";
  }

  if (searchInput) {
    searchInput.oninput = function () {
      const value = searchInput.value.toLowerCase().trim();

      const filteredBooks = books.filter(function (book) {
        return (
          book.title.toLowerCase().includes(value) ||
          book.author.toLowerCase().includes(value) ||
          book.genre.toLowerCase().includes(value)
        );
      });

      showBooks(filteredBooks, allBooksContainer);
      if (searchResult) {
        searchResult.textContent = "Found " + filteredBooks.length + " book(s).";
      }
    };
  }
}

// Book details page
function loadBookPage() {
  const params = new URLSearchParams(window.location.search);
  const bookId = Number(params.get("id"));
  const book = books.find(function (item) {
    return item.id === bookId;
  });

  const detailsContainer = document.getElementById("bookDetails");

  if (!detailsContainer) return;

  if (!book) {
    detailsContainer.innerHTML = "<p>Book not found.</p>";
    return;
  }

  detailsContainer.innerHTML = `
    <div class="details-layout">
      <div class="details-image">
        <img src="${book.image}" alt="${book.title} Book Cover">
      </div>

      <div>
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
        <p><strong>Rating:</strong> ${renderStars(book.rating)}</p>
        <p>${book.description}</p>

        <div class="buttons">
          <button class="btn" id="favoriteButton">${isFavorite(book.id) ? "Remove from Favorites" : "Add to Favorites"}</button>
          <button class="btn-light" id="addToCartButton">Add to Cart</button>
          <a href="cart.html" class="btn-light">Open Cart</a>
        </div>
      </div>
    </div>

    <div class="info-box">
      <h3>Compare Prices</h3>
      <div class="price-item">Reader Store: $${book.price.toFixed(2)}</div>
      <div class="price-item">Campus Store: $${(book.price + 2).toFixed(2)}</div>
      <div class="price-item">Online Offer: $${(book.price - 1).toFixed(2)}</div>
    </div>

    <div class="info-box">
      <h3>Book Preview</h3>
      <p>${book.preview}</p>
    </div>

    <div class="info-box">
      <h3>Sample Reviews</h3>
      <div class="review-item"><strong>Salma:</strong> ${renderStars(5)} Easy to read and very interesting.</div>
      <div class="review-item"><strong>Ali:</strong> ${renderStars(4)} Good choice for a literature discussion.</div>
      <div class="review-item"><strong>Mona:</strong> ${renderStars(5)} The book idea is simple but engaging.</div>
    </div>
  `;

  const favoriteBtn = document.getElementById("favoriteButton");
  if (favoriteBtn) {
    favoriteBtn.addEventListener("click", function () {
      toggleFavorite(book.id);
      loadBookPage();
    });
  }

  const addToCartBtn = document.getElementById("addToCartButton");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      addToCart(book.id);
    });
  }
}

// Favorites page
function loadFavoritesPage() {
  const favoriteIds = getFavorites();
  const favoriteBooks = books.filter(function (book) {
    return favoriteIds.includes(book.id);
  });

  const favoritesList = document.getElementById("favoritesList");

  if (!favoritesList) return;

  if (favoriteBooks.length === 0) {
    favoritesList.innerHTML = "<p>No favorite books yet.</p>";
    return;
  }

  showBooks(favoriteBooks, favoritesList);
}

// Contact page
function loadContactPage() {
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (!contactForm) return;

  contactForm.onsubmit = function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      if (formMessage) {
        formMessage.textContent = "Please fill in all fields.";
        formMessage.style.color = "#e74c3c";
      }
      return;
    }

    if (formMessage) {
      formMessage.textContent = "Thank you for contacting us! Your message has been sent.";
      formMessage.style.color = "#27ae60";
    }

    contactForm.reset();
  };
}

// Login page
function loadLoginPage() {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  if (!loginForm) return;

  loginForm.onsubmit = function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      if (loginMessage) {
        loginMessage.textContent = "Please enter both username and password.";
        loginMessage.style.color = "#e74c3c";
      }
      return;
    }

    if (loginMessage) {
      loginMessage.textContent = "Logged in successfully! Redirecting to home page...";
      loginMessage.style.color = "#27ae60";
    }

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1200);
  };
}

// Cart page
function loadCartPage() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutButton = document.getElementById("checkoutButton");
  const checkoutMessage = document.getElementById("checkoutMessage");

  if (!cartItemsContainer || !cartTotal || !checkoutButton) return;

  renderCartItems(cartItemsContainer, cartTotal, checkoutButton);

  if (checkoutForm) {
    checkoutForm.onsubmit = function (event) {
      event.preventDefault();

      const name = document.getElementById("checkoutName").value.trim();
      const email = document.getElementById("checkoutEmail").value.trim();
      const address = document.getElementById("checkoutAddress").value.trim();
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cart = getCart();

      if (cart.length === 0) {
        if (checkoutMessage) {
          checkoutMessage.textContent = "Your cart is empty.";
          checkoutMessage.style.color = "#e74c3c";
        }
        return;
      }

      if (name === "" || email === "" || address === "" || cardNumber === "") {
        if (checkoutMessage) {
          checkoutMessage.textContent = "Please fill in all checkout fields.";
          checkoutMessage.style.color = "#e74c3c";
        }
        return;
      }

      if (checkoutMessage) {
        checkoutMessage.textContent = "Payment completed successfully! This is a frontend simulation only.";
        checkoutMessage.style.color = "#27ae60";
      }
      localStorage.removeItem(cartKey);
      checkoutForm.reset();
      updateCartCount();
      renderCartItems(cartItemsContainer, cartTotal, checkoutButton);
    };
  }
}

// Show books inside any container
function showBooks(bookList, container) {
  if (!container) return;

  if (bookList.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  container.innerHTML = bookList.map(function (book) {
    return createBookCard(book);
  }).join("");

  addFavoriteEvents();
  addCartEvents();
}

// Book card for latest releases
function createLatestCard(book) {
  return `
    <div class="book-card">
      <img src="${book.image}" alt="${book.title} Book Cover">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p>${renderStars(book.rating)}</p>
        <div class="buttons">
          <a href="book.html?id=${book.id}" class="btn">Details</a>
        </div>
      </div>
    </div>
  `;
}

// Main book card
function createBookCard(book) {
  return `
    <div class="book-card">
      <img src="${book.image}" alt="${book.title} Book Cover">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
        <p>${renderStars(book.rating)}</p>
        <div class="buttons">
          <a href="book.html?id=${book.id}" class="btn">Details</a>
          <button class="btn-light cart-btn" data-id="${book.id}">Add to Cart</button>
          <button class="btn-light favorite-btn" data-id="${book.id}">
            ${isFavorite(book.id) ? "Remove Favorite" : "Add Favorite"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function addFavoriteEvents() {
  const buttons = document.querySelectorAll(".favorite-btn");

  buttons.forEach(function (button) {
    button.onclick = function () {
      const id = Number(button.getAttribute("data-id"));
      toggleFavorite(id);

      const page = document.body.getAttribute("data-page");

      if (page === "home") {
        loadHomePage();
      }

      if (page === "favorites") {
        loadFavoritesPage();
      }
    };
  });
}

function addCartEvents() {
  const buttons = document.querySelectorAll(".cart-btn");

  buttons.forEach(function (button) {
    button.onclick = function () {
      const id = Number(button.getAttribute("data-id"));
      addToCart(id);
    };
  });
}

// Favorite functions
function getFavorites() {
  const data = localStorage.getItem(favoriteKey);
  const validIds = books.map(function (book) {
    return book.id;
  });

  if (data) {
    try {
      return JSON.parse(data).filter(function (id) {
        return validIds.includes(id);
      });
    } catch (e) {
      return [];
    }
  }

  return [];
}

function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(function (item) {
      return item !== id;
    });
  } else {
    favorites.push(id);
  }

  localStorage.setItem(favoriteKey, JSON.stringify(favorites));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

// Cart functions
function getCart() {
  const data = localStorage.getItem(cartKey);
  const validIds = books.map(function (book) {
    return book.id;
  });

  if (data) {
    try {
      return JSON.parse(data).filter(function (item) {
        return validIds.includes(item.id) && item.quantity > 0;
      });
    } catch (e) {
      return [];
    }
  }

  return [];
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(function (cartItem) {
    return cartItem.id === id;
  });

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  saveCart(cart);
}

function changeCartQuantity(id, change) {
  let cart = getCart();

  cart = cart.map(function (item) {
    if (item.id === id) {
      return { id: item.id, quantity: item.quantity + change };
    }

    return item;
  }).filter(function (item) {
    return item.quantity > 0;
  });

  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(function (item) {
    return item.id !== id;
  });

  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  let count = 0;

  cart.forEach(function (item) {
    count += item.quantity;
  });

  document.querySelectorAll(".cart-count").forEach(function (span) {
    span.textContent = count;
  });
}

function renderCartItems(container, totalElement, checkoutButton) {
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalElement.textContent = "";
    checkoutButton.disabled = true;
    return;
  }

  checkoutButton.disabled = false;

  let total = 0;

  container.innerHTML = cart.map(function (item) {
    const book = books.find(function (bookItem) {
      return bookItem.id === item.id;
    });

    if (!book) return "";

    const itemTotal = book.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item">
        <img src="${book.image}" alt="${book.title} Book Cover">
        <div class="cart-item-info">
          <h3>${book.title}</h3>
          <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><strong>Total:</strong> $${itemTotal.toFixed(2)}</p>
          <div class="qty-box">
            <button class="qty-btn decrease-btn" data-id="${book.id}">-</button>
            <button class="qty-btn increase-btn" data-id="${book.id}">+</button>
            <button class="btn-light remove-btn" data-id="${book.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  totalElement.textContent = "Order Total: $" + total.toFixed(2);

  addCartPageEvents();
}

function addCartPageEvents() {
  document.querySelectorAll(".decrease-btn").forEach(function (button) {
    button.onclick = function () {
      const id = Number(button.getAttribute("data-id"));
      changeCartQuantity(id, -1);
      loadCartPage();
    };
  });

  document.querySelectorAll(".increase-btn").forEach(function (button) {
    button.onclick = function () {
      const id = Number(button.getAttribute("data-id"));
      changeCartQuantity(id, 1);
      loadCartPage();
    };
  });

  document.querySelectorAll(".remove-btn").forEach(function (button) {
    button.onclick = function () {
      const id = Number(button.getAttribute("data-id"));
      removeFromCart(id);
      loadCartPage();
    };
  });
}

// Rating stars
function renderStars(rating) {
  let stars = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += "&#9733;";
    } else {
      stars += "&#9734;";
    }
  }

  return '<span class="stars">' + stars + "</span>";
}
