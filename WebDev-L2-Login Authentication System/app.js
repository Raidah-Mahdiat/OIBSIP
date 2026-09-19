const USERS_KEY = "northstar.users";
const SESSION_KEY = "northstar.session";

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const normalize = (value) => value.trim().toLowerCase();

function setNotice(message = "") {
  const notice = document.querySelector("#form-notice");
  if (notice) notice.textContent = message;
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
  form.querySelectorAll("input").forEach((input) => input.classList.remove("invalid"));
}

function showFieldError(inputId, message) {
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`[data-error-for="${inputId}"]`);
  if (input) input.classList.add("invalid");
  if (error) error.textContent = message;
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function makeSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function switchMode(mode) {
  const isRegistering = mode === "register";
  document.querySelector("#login-view").classList.toggle("is-hidden", isRegistering);
  document.querySelector("#register-view").classList.toggle("is-hidden", !isRegistering);
  document.querySelector("#login-tab").classList.toggle("is-active", !isRegistering);
  document.querySelector("#register-tab").classList.toggle("is-active", isRegistering);
  document.querySelector("#login-tab").setAttribute("aria-selected", String(!isRegistering));
  document.querySelector("#register-tab").setAttribute("aria-selected", String(isRegistering));
  document.querySelector("#form-eyebrow").textContent = isRegistering ? "Start something good" : "Welcome back";
  document.querySelector("#form-title").textContent = isRegistering ? "Create your account" : "Sign in to Northstar";
  document.querySelector("#form-helper").textContent = isRegistering ? "One account for a calmer, clearer workspace." : "Enter your details to continue to your workspace.";
  setNotice();
  clearFieldErrors(document.querySelector(isRegistering ? "#register-view" : "#login-view"));
  history.replaceState(null, "", isRegistering ? "#register" : "#login");
}

function validateRegistration(username, email, password) {
  const errors = [];
  if (!username) { showFieldError("register-username", "Username is required."); errors.push(true); }
  if (!email) { showFieldError("register-email", "Email is required."); errors.push(true); }
  else if (!/^\S+@\S+\.\S+$/.test(email)) { showFieldError("register-email", "Enter a valid email address."); errors.push(true); }
  if (!password) { showFieldError("register-password", "Password is required."); errors.push(true); }
  else if (password.length < 8 || !/\d/.test(password)) { showFieldError("register-password", "Use 8+ characters and at least 1 number."); errors.push(true); }
  return errors.length === 0;
}

async function handleRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFieldErrors(form);
  setNotice();
  const username = normalize(form.username.value);
  const email = normalize(form.email.value);
  const password = form.password.value;
  if (!validateRegistration(username, email, password)) return;

  const users = getUsers();
  if (users.some((user) => user.username === username || user.email === email)) {
    setNotice("An account with that username or email already exists.");
    return;
  }

  const salt = makeSalt();
  users.push({ username, email, salt, passwordHash: await hashPassword(password, salt), createdAt: new Date().toISOString() });
  saveUsers(users);
  form.reset();
  switchMode("login");
  setNotice("Account created. Log in to open your workspace.");
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFieldErrors(form);
  setNotice();
  const identity = normalize(form.identity.value);
  const password = form.password.value;
  let valid = true;
  if (!identity) { showFieldError("login-identity", "Username or email is required."); valid = false; }
  if (!password) { showFieldError("login-password", "Password is required."); valid = false; }
  if (!valid) return;

  const user = getUsers().find((candidate) => candidate.username === identity || candidate.email === identity);
  const passwordHash = user ? await hashPassword(password, user.salt) : "";
  if (!user || passwordHash !== user.passwordHash) {
    setNotice("Unable to sign in with those credentials.");
    return;
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, email: user.email, signedInAt: new Date().toISOString() }));
  window.location.href = "dashboard.html";
}

function protectDashboard() {
  const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  if (!session) {
    window.location.replace("index.html#login");
    return;
  }
  document.querySelector("#user-name").textContent = session.username;
  document.querySelector("#user-email").textContent = session.email;
  document.querySelector("#logout-button").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace("index.html#login");
  });
}

if (document.querySelector("#login-view")) {
  document.querySelector("#login-view").addEventListener("submit", handleLogin);
  document.querySelector("#register-view").addEventListener("submit", handleRegistration);
  document.querySelector("#login-tab").addEventListener("click", () => switchMode("login"));
  document.querySelector("#register-tab").addEventListener("click", () => switchMode("register"));
  document.querySelectorAll("[data-switch]").forEach((button) => button.addEventListener("click", () => switchMode(button.dataset.switch)));
  document.querySelector("#register-password").addEventListener("input", (event) => {
    document.querySelector("#length-check").classList.toggle("valid", event.target.value.length >= 8);
    document.querySelector("#number-check").classList.toggle("valid", /\d/.test(event.target.value));
  });
  if (window.location.hash === "#register") switchMode("register");
}

if (document.querySelector("#logout-button")) protectDashboard();
