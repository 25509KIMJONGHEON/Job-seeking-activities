// /Users/kimjongheon/Desktop/mynavi-clone/app.js

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const dom = {
    body: document.body,
    // Modals
    bookModal: document.getElementById("book-modal"),
    myListModal: document.getElementById("my-list-modal"),
    myPageModal: document.getElementById("my-page-modal"),
    modalCloseButtons: document.querySelectorAll(".close-button"),
    myListCloseButton: document.querySelector(".my-list-close"),
    myPageCloseButton: document.querySelector(".my-page-close"),
    modalBookDetails: document.getElementById("modal-book-details"),
    myListContent: document.getElementById("my-list-content"),
    searchHistoryList: document.getElementById("search-history-list"),
    viewHistoryList: document.getElementById("view-history-list"),
    // Theme
    themeToggle: document.getElementById("checkbox"),
    // User Profile
    userProfile: document.getElementById("user-profile"),
    // Controls
    keywordInput: document.getElementById("keyword"),
    searchButton: document.querySelector(".search-box button"),
    categorySelect: document.getElementById("category-select"),
    sortButtons: document.querySelectorAll(".sort-btn"),
    gridViewBtn: document.getElementById("grid-view-btn"),
    listViewBtn: document.getElementById("list-view-btn"),
    // Results & Pagination
    resultsContainer: document.querySelector("main .results-container"),
    paginationContainer: document.getElementById("pagination"),
    // Scroll to top
    scrollTopBtn: document.getElementById("scrollTopBtn"),
  };

  // --- Application State ---
  const state = {
    currentPage: 1,
    currentKeyword: "",
    currentSortOrder: "relevance",
    currentCategory: "",
    userFavorites: [],
    totalItems: 0,
    searchHistory: [],
    viewHistory: [],
  };

  // --- Initialization & Event Handlers ---
  function initializeApp() {
    initializeTheme();
    initializeEventListeners();
    dom.resultsContainer.classList.add("grid-view"); // Set default view
  }

  function initializeTheme() {
    if (localStorage.getItem("theme") === "dark") {
      dom.body.classList.add("dark-mode");
      dom.themeToggle.checked = true;
    }
  }

  // --- Event Listeners ---
  function initializeEventListeners() {
    // Modals
    dom.modalCloseButtons.forEach((btn) =>
      btn.addEventListener("click", () =>
        dom.bookModal.classList.remove("show"),
      ),
    );
    dom.myListCloseButton.addEventListener("click", () =>
      dom.myListModal.classList.remove("show"),
    );
    dom.myPageCloseButton.addEventListener("click", () =>
      dom.myPageModal.classList.remove("show"),
    );
    window.addEventListener("click", (event) => {
      if (event.target === dom.bookModal)
        dom.bookModal.classList.remove("show");
      if (event.target === dom.myListModal)
        dom.myListModal.classList.remove("show");
      if (event.target === dom.myPageModal)
        dom.myPageModal.classList.remove("show");
    });

    // Theme
    dom.themeToggle.addEventListener("change", handleThemeToggle);

    // Search
    dom.searchButton.addEventListener("click", searchBooks);
    dom.keywordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchBooks();
    });

    // Controls
    dom.categorySelect.addEventListener("change", handleCategoryChange);
    dom.sortButtons.forEach((button) =>
      button.addEventListener("click", handleSortChange),
    );
    dom.gridViewBtn.addEventListener("click", () => switchView("grid"));
    dom.listViewBtn.addEventListener("click", () => switchView("list"));

    // Scroll to top
    window.addEventListener("scroll", handleScroll);
    dom.scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  function handleThemeToggle() {
    dom.body.classList.toggle("dark-mode");
    const theme = dom.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }

  // Google 로그인 초기화는 window.onload에서 수행하여 GSI 라이브러리가 로드된 후 실행되도록 합니다.
  window.onload = async () => {
    try {
      const configRes = await fetch("/api/config");
      const config = await configRes.json();

      google.accounts.id.initialize({
        client_id: config.clientId,
        callback: handleCredentialResponse,
      });
      await checkLoginStatus();
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      // 설정 로드에 실패하더라도 사용자가 로그인을 시도할 수 있도록 버튼을 표시합니다.
      // google 객체가 없을 수 있으므로 확인 후 호출합니다.
      if (window.google && google.accounts && google.accounts.id)
        renderLoginButton();
    }
  };

  async function handleCredentialResponse(response) {
    try {
      const res = await fetch("/auth/google/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      if (res.ok) {
        const user = await res.json();
        renderUserProfile(user);
        await fetchUserFavorites();
        await fetchHistory();
      } else {
        console.error("Login Failed");
      }
    } catch (error) {
      console.error("Error during credential handling:", error);
    }
  }

  function handleScroll() {
    const show =
      document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
    dom.scrollTopBtn.style.display = show ? "block" : "none";
  }

  function handleCategoryChange(e) {
    state.currentCategory = e.target.value;
    state.currentPage = 1;
    if (state.currentKeyword) fetchAndDisplayBooks();
  }

  function handleSortChange(e) {
    dom.sortButtons.forEach((btn) => btn.classList.remove("active"));
    const button = e.currentTarget;
    button.classList.add("active");
    state.currentSortOrder = button.dataset.sort;
    state.currentPage = 1;
    if (state.currentKeyword) fetchAndDisplayBooks();
  }

  function switchView(viewType) {
    const isGrid = viewType === "grid";
    dom.resultsContainer.classList.toggle("grid-view", isGrid);
    dom.resultsContainer.classList.toggle("list-view", !isGrid);
    dom.gridViewBtn.classList.toggle("active", isGrid);
    dom.listViewBtn.classList.toggle("active", !isGrid);
  }

  // --- API & Data Fetching ---
  async function checkLoginStatus() {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const user = await res.json();
        renderUserProfile(user);
        await fetchUserFavorites();
        await fetchHistory();
      } else {
        renderLoginButton();
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      renderLoginButton();
    }
  }

  async function fetchUserFavorites() {
    try {
      const res = await fetch("/api/mylist");
      state.userFavorites = res.ok ? await res.json() : [];
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      state.userFavorites = [];
    }
  }

  async function searchBooks() {
    state.currentKeyword = dom.keywordInput.value;
    state.currentPage = 1;
    dom.categorySelect.value = "";
    state.currentCategory = "";
    await addSearchHistory(state.currentKeyword);
    await fetchAndDisplayBooks();
  }

  async function changePage(newPage) {
    state.currentPage = newPage;
    await fetchAndDisplayBooks();
  }

  async function fetchAndDisplayBooks() {
    renderSkeletonLoader();
    if (!state.currentKeyword) {
      dom.resultsContainer.innerHTML = "<p>キーワードを入力してください。</p>";
      return;
    }

    try {
      const { currentKeyword, currentPage, currentSortOrder, currentCategory } =
        state;
      const response = await fetch(
        `/search?q=${currentKeyword}&page=${currentPage}&orderBy=${currentSortOrder}&category=${currentCategory}`,
      );
      const data = await response.json();

      dom.resultsContainer.innerHTML = "";
      if (data.items?.length > 0) {
        state.totalItems = data.totalItems;
        // DocumentFragment를 사용하여 DOM 조작 최소화
        const fragment = document.createDocumentFragment();
        data.items.forEach((item) =>
          fragment.appendChild(createBookCard(item)),
        );
        dom.resultsContainer.appendChild(fragment);
      } else {
        state.totalItems = 0;
        dom.resultsContainer.innerHTML = "<p>結果が見つかりませんでした。</p>";
      }
      renderPagination();
    } catch (error) {
      console.error("Error fetching books:", error);
      dom.resultsContainer.innerHTML =
        "<p>情報の取得中にエラーが発生しました。</p>";
    }
  }

  async function toggleLike(bookId, btn) {
    if (!document.querySelector(".profile-name")) {
      alert("「いいね」機能を利用するにはログインが必要です。");
      return;
    }

    const isLiked = btn.classList.toggle("liked");
    try {
      if (isLiked) {
        state.userFavorites.push(bookId);
        await fetch("/api/mylist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId }),
        });
      } else {
        state.userFavorites = state.userFavorites.filter((id) => id !== bookId);
        await fetch(`/api/mylist/${bookId}`, { method: "DELETE" });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert UI on error
      btn.classList.toggle("liked");
    }
  }

  async function showMyList() {
    dom.myListContent.innerHTML = "<p>読み込み中...</p>";
    dom.myListModal.classList.add("show");

    if (state.userFavorites.length === 0) {
      dom.myListContent.innerHTML = "<p>「いいね」した本がありません。</p>";
      return;
    }

    try {
      const bookPromises = state.userFavorites.map((bookId) =>
        fetch(`/api/book/${bookId}`).then((res) => res.json()),
      );
      const favoriteBooks = await Promise.all(bookPromises);
      dom.myListContent.innerHTML = "";
      favoriteBooks.forEach(renderMyListItem);
    } catch (error) {
      console.error("Error showing my list:", error);
      dom.myListContent.innerHTML =
        "<p>リストの読み込み中にエラーが発生しました。</p>";
    }
  }

  async function removeFromMyList(bookId, cardElement) {
    try {
      await fetch(`/api/mylist/${bookId}`, { method: "DELETE" });
      state.userFavorites = state.userFavorites.filter((id) => id !== bookId);
      cardElement.remove();

      const mainResultCard = dom.resultsContainer.querySelector(
        `[data-book-id="${bookId}"]`,
      );
      if (mainResultCard) {
        mainResultCard.querySelector(".like-btn")?.classList.remove("liked");
      }

      if (state.userFavorites.length === 0) {
        dom.myListContent.innerHTML = "<p>「いいね」した本がありません。</p>";
      }
    } catch (error) {
      console.error("Error removing from my list:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  // --- History Functions ---
  async function fetchHistory() {
    if (!document.querySelector(".profile-name")) return;
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const { searchHistory, viewHistory } = await res.json();
        state.searchHistory = searchHistory;
        state.viewHistory = viewHistory;
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  async function addSearchHistory(keyword) {
    if (!keyword) return;
    if (!document.querySelector(".profile-name")) return; // 비로그인 시 저장 안함

    // Optimistic UI update
    state.searchHistory = state.searchHistory.filter(
      (item) => item !== keyword,
    );
    state.searchHistory.unshift(keyword);
    if (state.searchHistory.length > 10) state.searchHistory.pop();

    await fetch("/api/history/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });
  }

  async function addViewHistory(bookItem) {
    if (!bookItem) return;
    if (!document.querySelector(".profile-name")) return; // 비로그인 시 저장 안함

    // Optimistic UI update
    state.viewHistory = state.viewHistory.filter(
      (item) => item.id !== bookItem.id,
    );
    state.viewHistory.unshift(bookItem);
    if (state.viewHistory.length > 20) state.viewHistory.pop();

    await fetch("/api/history/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookItem }),
    });
  }

  function showMyPage() {
    renderSearchHistory();
    renderViewHistory();
    dom.myPageModal.classList.add("show");
  }

  function renderSearchHistory() {
    dom.searchHistoryList.innerHTML = "";
    if (state.searchHistory.length === 0) {
      dom.searchHistoryList.innerHTML = "<li>検索履歴がありません。</li>";
      return;
    }
    state.searchHistory.forEach((keyword) => {
      const li = document.createElement("li");
      li.textContent = keyword;
      li.onclick = () => {
        dom.keywordInput.value = keyword;
        dom.myPageModal.classList.remove("show");
        searchBooks();
      };
      dom.searchHistoryList.appendChild(li);
    });
  }

  function renderViewHistory() {
    dom.viewHistoryList.innerHTML = "";
    if (state.viewHistory.length === 0) {
      dom.viewHistoryList.innerHTML = "<p>閲覧履歴がありません。</p>";
      return;
    }
    const fragment = document.createDocumentFragment();
    state.viewHistory.forEach((item) => {
      // createBookCard 함수는 '좋아요' 등 다른 상태에 의존하므로
      // 히스토리용 카드 렌더링 함수를 간소화하여 만듭니다.
      const card = createBookCard(item);
      // 히스토리 카드에는 좋아요 버튼이 필요 없으므로 제거합니다.
      const likeBtn = card.querySelector(".like-btn");
      if (likeBtn) likeBtn.remove();
      fragment.appendChild(card);
    });
    dom.viewHistoryList.appendChild(fragment);
  }

  // --- Rendering ---
  function renderLoginButton() {
    dom.userProfile.classList.remove("logged-in");
    dom.userProfile.innerHTML = "";
    google.accounts.id.renderButton(dom.userProfile, {
      theme: "outline",
      size: "medium",
      text: "signin_with",
      shape: "rectangular",
    });
  }

  function renderUserProfile(user) {
    dom.userProfile.classList.add("logged-in");
    dom.userProfile.innerHTML = `
            <img src="${user.picture}" alt="Profile picture" class="profile-pic">
            <span class="profile-name">${user.name}</span>
            <button id="my-page-btn" class="my-list-button">マイページ</button>
            <button id="my-list-btn" class="my-list-button">マイリスト</button>
            <a href="/api/logout" class="logout-btn">ログアウト</a>
        `;
    document
      .getElementById("my-page-btn")
      .addEventListener("click", showMyPage);
    document
      .getElementById("my-list-btn")
      .addEventListener("click", showMyList);
  }

  function renderSkeletonLoader() {
    dom.resultsContainer.innerHTML = "";
    dom.paginationContainer.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const skeletonCard = document.createElement("div");
      skeletonCard.className = "skeleton-card";
      skeletonCard.innerHTML = `
                <div class="skeleton image"></div>
                <div class="skeleton title"></div>
                <div class="skeleton text"></div>`;
      dom.resultsContainer.appendChild(skeletonCard);
    }
  }

  function createBookCard(item) {
    const { volumeInfo, id: bookId } = item;
    const { title, authors, description, imageLinks } = volumeInfo;
    const authorText = authors ? authors.join(", ") : "著者不明";
    const thumbnail = imageLinks?.thumbnail || "";
    const shortDescription =
      (description || "").substring(0, 100) +
      ((description || "").length > 100 ? "..." : "");

    const card = document.createElement("div");
    card.className = "book-card";
    card.dataset.bookId = bookId; // For easy selection later
    card.addEventListener("click", () => showBookDetails(item));

    card.innerHTML = `
            ${thumbnail ? `<img src="${thumbnail}" alt="${title}" loading="lazy">` : ""}
            <button class="like-btn">&#x2764;</button>
            <div class="card-content">
                <h3></h3>
                <p class="author"></p>
                <p class="description"></p>
            </div>
        `;

    card.querySelector("h3").textContent = title;
    card.querySelector(".author").textContent = `著者: ${authorText}`;
    card.querySelector(".description").textContent = shortDescription;

    const likeBtn = card.querySelector(".like-btn");
    if (state.userFavorites.includes(bookId)) {
      likeBtn.classList.add("liked");
    }
    likeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleLike(bookId, likeBtn);
    });

    return card;
  }

  function renderMyListItem(item) {
    const { volumeInfo, id: bookId } = item;
    const { title, authors, imageLinks } = volumeInfo;
    const authorText = authors ? authors.join(", ") : "著者不明";
    const thumbnail = imageLinks?.thumbnail || "";

    const card = document.createElement("div");
    card.className = "book-card";

    card.innerHTML = `
            <button class="remove-btn" title="リストから削除">🗑️</button>
            <img src="${thumbnail}" alt="${title}" loading="lazy">
            <div class="card-content">
                <h3></h3>
                <p></p>
            </div>
        `;
    card.querySelector("h3").textContent = title;
    card.querySelector("p").textContent = `著者: ${authorText}`;

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".remove-btn")) {
        dom.myListModal.classList.remove("show");
        showBookDetails(item);
      }
    });

    card.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromMyList(bookId, card);
    });

    dom.myListContent.appendChild(card);
  }

  async function showBookDetails(bookItem) {
    const { volumeInfo } = bookItem;
    const {
      title,
      authors,
      publisher,
      publishedDate,
      description,
      imageLinks,
    } = volumeInfo;

    const detailsHTML = `
            <img src="${imageLinks?.thumbnail || ""}" alt="${title || "책 표지"}" loading="lazy">
            <div class="text-content">
                <h2></h2>
                <p class="author"></p>
                <p class="publisher"></p>
                <p class="description"></p>
            </div>
        `;
    dom.modalBookDetails.innerHTML = detailsHTML;

    const textContentDiv = dom.modalBookDetails.querySelector(".text-content");
    textContentDiv.querySelector("h2").textContent = title || "タイトル不明";
    textContentDiv.querySelector(".author").innerHTML =
      `<strong>著者:</strong> ${authors ? authors.join(", ") : "著者不明"}`;
    textContentDiv.querySelector(".publisher").innerHTML =
      `<strong>出版社:</strong> ${publisher || "出版社不明"} (${publishedDate || "出版日不明"})`;
    textContentDiv.querySelector(".description").textContent =
      description || "説明がありません。";

    await addViewHistory(bookItem); // 조회 기록에 추가
    dom.bookModal.classList.add("show");
  }

  function renderPagination() {
    dom.paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(state.totalItems / 12);

    if (totalPages <= 1) return;

    // Previous button
    if (state.currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.innerText = "前へ";
      prevButton.onclick = () => changePage(state.currentPage - 1);
      dom.paginationContainer.appendChild(prevButton);
    }

    // Page info
    const pageInfo = document.createElement("span");
    pageInfo.innerText = `${state.currentPage} / ${totalPages} ページ`;
    dom.paginationContainer.appendChild(pageInfo);

    // Next button
    if (state.currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.innerText = "次へ";
      nextButton.onclick = () => changePage(state.currentPage + 1);
      dom.paginationContainer.appendChild(nextButton);
    }
  }

  // --- Start the application ---
  initializeApp();
});
