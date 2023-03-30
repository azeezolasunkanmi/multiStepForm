const container = document.querySelector(".container");
const sidenumbers = document.querySelectorAll(".step");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const nameInput = container.querySelector('input[type="text"]');
const emailInput = container.querySelector('input[type="email"]');
const phoneInput = container.querySelector('input[type="tel"]');
const planBtn = document.querySelectorAll(".plan");
const planPriceYr = document.querySelectorAll(".plan-price-yr");
const planPriceMo = document.querySelectorAll(".plan-price");
const freeMonths = document.querySelectorAll(".free-plan");
const planSwitch = document.querySelector(".switch");
const moYearlySwitch = document.querySelector(".switch-btn");
const addonsBtn = document.querySelectorAll(".addon");
const cart = document.querySelector(".cart");
const cartTotal = document.querySelector(".total-amount");

class App {
  // object to store data to be later rendered
  #person = {
    title: "",
    price: "",
    addons: [],
    addonPrices: [],
    plan: "",
  };

  constructor() {
    this._renderPage(this._currentPage());
    this._filterBtns();
    this._selectPlan();
    this._sideState();
    nextBtn.addEventListener("click", this._btnHandler.bind(this));
    prevBtn.addEventListener("click", this._btnHandler.bind(this));
    this._planSwitch();
    this._selectAddons();
    this._submit();
  }

  // SELECT CURRENT PAGE
  _currentPage() {
    const active = Array.from(slides).find(slide =>
      slide.classList.contains("active")
    );
    return active;
  }

  _renderPage(page) {
    container.insertAdjacentElement("afterbegin", page);
  }

  // Hide and show buttons
  _filterBtns() {
    prevBtn.classList.remove("invincible");
    nextBtn.innerHTML = "Next Step";

    if (this._currentPage().id === "first") {
      prevBtn.classList.add("invincible");
    }
    if (this._currentPage().id === "fifth") {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      // submit form on last slide
      nextBtn.addEventListener("click", this._submit());
    }

    if (this._currentPage().id === "fourth") {
      nextBtn.innerHTML = "Confirm";
    }
  }

  _btnHandler(e) {
    e.preventDefault();
    // add listners to next button to change form slides
    if (e.target.classList.contains("btn-next")) {
      if (this._validateForm()) {
        this._currentPage().nextElementSibling.classList.remove("hidden");
        this._currentPage().nextElementSibling.classList.add("active");
        this._currentPage().classList.add("hidden");
        this._currentPage().classList.remove("active");
        this._filterBtns();
        this._sideState();
        this._renderCart(); //////////////////////////////////////
      }
    }
    // add listners to go back button to change form slides
    if (e.target.classList.contains("btn-prev")) {
      this._currentPage().previousElementSibling.classList.remove("hidden");
      this._currentPage().previousElementSibling.classList.add("active");
      this._currentPage().nextElementSibling.classList.remove("active");
      this._currentPage().nextElementSibling.classList.add("hidden");
      this._filterBtns();
      this._sideState();
    }
  }

  // CHANGE STATE ON SIDE PANEL
  _sideState() {
    sidenumbers.forEach(side => {
      side.classList.remove("active");
    });
    Array.from(sidenumbers).find(side => {
      if (side.id === this._currentPage().id) {
        side.classList.add("active");
      }
    });
  }

  // validate form
  _validateForm() {
    if (nameInput.value === "") {
      this._showError(nameInput, "Name is required");
      return false;
    }

    if (emailInput.value === "") {
      this._showError(emailInput, "Email is required");
      return false;
    } else if (!this._isValidEmail(emailInput.value)) {
      this._showError(emailInput, "Email is not valid");
      return false;
    }

    if (phoneInput.value === "") {
      this._showError(phoneInput, "Phone number is required");
      return false;
    } else if (!this._isValidPhone(phoneInput.value)) {
      this._showError(phoneInput, "Phone number not valid");
      return false;
    } else {
      this._showSuccess(emailInput);
      this._showSuccess(nameInput);
      this._showSuccess(phoneInput);
      return true;
    }
  }
  // Error message
  _showError(input, message) {
    const formGroup = input.parentElement;
    const errorSpan = formGroup.querySelector("label span");
    errorSpan.textContent = message;
    input.classList.add("error");
  }
  // success message
  _showSuccess(input) {
    const formGroup = input.parentElement;
    const errorSpan = formGroup.querySelector("label span");
    errorSpan.textContent = "";
    input.classList.remove("error");
  }

  _isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  _isValidPhone(phone) {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/;
    return phoneRegex.test(phone);
  }

  // function to unselect plan
  _unselectPlan() {
    planBtn.forEach(plan => plan.classList.remove("selected"));
  }

  // push default plan values to person obeject
  _initValues() {
    const title = Array.from(planBtn).find(plan =>
      plan.classList.contains("selected")
    );
    this.#person.title = title.querySelector(".plan-name").innerHTML;
    this.#person.price = title.querySelector(
      ".plan-prices:not(.hidden)"
    ).innerHTML;

    if (this.#person.price.includes("mo")) {
      this.#person.plan = "Monthly";
    } else {
      this.#person.plan = "Yearly";
    }
  }

  // slect plan
  _selectPlan() {
    this._initValues();
    planBtn.forEach(plan =>
      plan.addEventListener("click", e => {
        this._unselectPlan();
        e.currentTarget.closest("button").classList.add("selected");
        // push selected values to object
        this.#person.title = e.currentTarget
          .closest("button")
          .querySelector(".plan-name").innerHTML;
        this.#person.price = e.currentTarget
          .closest("button")
          .querySelector(".plan-prices:not(.hidden)").innerHTML;
      })
    );
  }
  //method to switch prices from monthly to yearly
  _yearlyPrice() {
    const addonMonth = document.querySelectorAll(".addon-month");
    const addonYear = document.querySelectorAll(".addon-year");
    addonMonth.forEach(addon => addon.classList.add("hidden"));
    addonYear.forEach(addon => addon.classList.remove("hidden"));
    planPriceMo.forEach(plan => plan.classList.add("hidden"));
    planPriceYr.forEach(plan => plan.classList.remove("hidden"));
  }

  // method to switch prices from yearly to monthly
  _monthlyPrice() {
    const addonMonth = document.querySelectorAll(".addon-month");
    const addonYear = document.querySelectorAll(".addon-year");
    addonMonth.forEach(addon => addon.classList.remove("hidden"));
    addonYear.forEach(addon => addon.classList.add("hidden"));
    planPriceMo.forEach(plan => plan.classList.remove("hidden"));
    planPriceYr.forEach(plan => plan.classList.add("hidden"));
  }

  // add click listner to plan switch button from monthly to yearly
  _planSwitch() {
    planSwitch.addEventListener("click", e => {
      freeMonths.forEach(free => {
        free.classList.toggle("hidden");
        if (!free.classList.contains("hidden")) {
          this._yearlyPrice();
        } else {
          this._monthlyPrice();
        }
        moYearlySwitch.classList.toggle("yearly");
      });
      this._initValues();
      this._initAddons(); //////////////////////////////////////
    });
  }
  // initialize pre-selected addons and push values to person object
  _initAddons() {
    this.#person.addons = [];
    this.#person.addonPrices = [];
    addonsBtn.forEach(btn => {
      if (btn.classList.contains("checked")) {
        const initAddon = btn.querySelector(".checkmark-name").innerHTML;
        const initAddonPrice = btn.querySelector(
          ".addon-price:not(.hidden)"
        ).innerHTML;

        this.#person.addons.push(initAddon);
        this.#person.addonPrices.push(initAddonPrice);
      }
    });
  }
  // add click listners on addons buttons and push selected values to object
  _selectAddons() {
    addonsBtn.forEach(btn => {
      btn.addEventListener("click", e => {
        e.currentTarget.classList.toggle("checked");
        e.currentTarget.querySelector(".checkmark").classList.toggle("checked");

        const addon =
          e.currentTarget.querySelector(".checkmark-name").innerHTML;
        const addonPrice = e.currentTarget.querySelector(
          ".addon-price:not(.hidden)"
        ).innerHTML;
        if (this.#person.addons.includes(addon)) {
          const index = this.#person.addons.indexOf(addon);
          this.#person.addons.splice(index, 1);
          this.#person.addonPrices.splice(index, 1);
        } else {
          this.#person.addons.push(addon);
          this.#person.addonPrices.push(addonPrice);
        }
      });
    });
  }

  // render summary page
  _renderCart() {
    const html = `
    <div>
    <span>
      <p>${this.#person.title} (${this.#person.plan})</p>
      <button class="change" type="button">change</button>
    </span>
    <p class="num amount">${this.#person.price}</p>
  </div>
  <div>
    <span>
      <p>${this.#person.addons.length >= 1 ? this.#person.addons[0] : ""}</p>
      <p>${this.#person.addons.length >= 2 ? this.#person.addons[1] : ""}</p>
      <p>${this.#person.addons.length === 3 ? this.#person.addons[2] : ""}</p>
    </span>
    <span>
      <p class="num amount2">${
        this.#person.addonPrices.length >= 1 ? this.#person.addonPrices[0] : ""
      }</p>
      <p class="num amount2">${
        this.#person.addonPrices.length >= 2 ? this.#person.addonPrices[1] : ""
      }</p>
      <p class="num amount2">${
        this.#person.addonPrices.length === 3 ? this.#person.addonPrices[2] : ""
      }</p>
    </span>
  </div>
  
    `;
    cart.innerHTML = html;

    const amount = document.querySelectorAll(".num");
    let sum = 0;
    amount.forEach(amt => {
      const amountStr = amt.textContent;
      const amountNum = Number(amountStr.replace(/[^0-9.-]+/g, ""));
      sum += amountNum;
    });

    const html2 = `
    <div class="total">
    <p>Total (per ${this.#person.plan.slice(0, -2)})</p>
    <p class="total-amount">+$${sum}/mo</p>
  </div>`;
    cartTotal.innerHTML = html2;
    this._changeBtn();
  }

  // add click listner to change button on summary page
  _changeBtn() {
    const changeBtn = document.querySelector(".change");
    changeBtn.addEventListener("click", () => {
      this._currentPage().previousElementSibling.previousElementSibling.classList.remove(
        "hidden"
      );
      this._currentPage().classList.add("hidden");
      this._currentPage().previousElementSibling.previousElementSibling.classList.add(
        "active"
      );
      this._currentPage().nextElementSibling.nextElementSibling.classList.remove(
        "active"
      );

      this._filterBtns();
      this._sideState();
    });
  }

  _submit(e) {
    document.addEventListener("DOMContentLoaded", function () {
      container.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
    });

    console.log(this.#person);
  }
}

const app = new App();
