// ==========================
// BASE ABSTRACT CLASS
// ==========================
class BaseProperty {

  #id;
  #name;
  #active;
  #location;
  #dateCreated;

  constructor(name, location) {
    if (new.target === BaseProperty) {
      throw new Error("BaseProperty is abstract");
    }

    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#location = location;
    this.#active = true;
    this.#dateCreated = new Date();
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get isActive() { return this.#active; }
  get location() { return this.#location; }
  get dateCreated() { return this.#dateCreated; }

  set location(value) {
    if (!value) throw new Error("Location cannot be empty");
    this.#location = value;
  }

  activate() { this.#active = true; }
  deactivate() { this.#active = false; }

  getType() {
    return this.constructor.name;
  }

  getInfo() {
    throw new Error("Must implement getInfo()");
  }
}

// ==========================
// DERIVED CLASSES
// ==========================
class House extends BaseProperty {
  #price;

  constructor(name, location, price) {
    super(name, location);
    this.#price = price;
  }

  get price() { return this.#price; }

  getInfo() {
    return `House - $${this.#price}`;
  }
}

class Apartment extends BaseProperty {
  #price;

  constructor(name, location, price) {
    super(name, location);
    this.#price = price;
  }

  get price() { return this.#price; }

  getInfo() {
    return `Apartment - $${this.#price}`;
  }
}

class CommercialProperty extends BaseProperty {
  #price;

  constructor(name, location, price) {
    super(name, location);
    this.#price = price;
  }

  get price() { return this.#price; }

  getInfo() {
    return `Commercial - $${this.#price}`;
  }
}

// ==========================
// PERSON
// ==========================
class Person {
  #id;
  #name;
  #email;
  #registrationDate;

  constructor(name, email) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.email = email;
    this.#registrationDate = new Date();
  }

  get id() { return this.#id; }
  get name() { return this.#name; }
  get email() { return this.#email; }

  set email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) throw new Error("Invalid email");
    this.#email = value;
  }
}

class Agent extends Person {}
class Client extends Person {}

// ==========================
// TRANSACTION
// ==========================
class Transaction {
  #id;
  #client;
  #property;
  #type;
  #date;

  constructor(client, property, type) {
    this.#id = crypto.randomUUID();
    this.#client = client;
    this.#property = property;
    this.#type = type;
    this.#date = new Date();
  }

  getInfo() {
    return `${this.#type} - ${this.#property.name}`;
  }
}

// ==========================
// MAIN SYSTEM
// ==========================
class RealEstateSystem {

  #items = [];
  #transactions = [];

  static {
    this.VERSION = "1.0.0";
    this.MAX_ITEMS = 1000;
  }

  addItem(item) {
    this.#items.push(item);
  }

  removeItem(id) {
    this.#items = this.#items.filter(item => item.id !== id);
  }

  findItem(id) {
    return this.#items.find(item => item.id === id);
  }

  searchByName(query) {
    return this.#items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByType(type) {
    if (type === "All") return this.#items;
    return this.#items.filter(item => item.getType() === type);
  }

  getStats() {
    return {
      total: this.#items.length,
      transactions: this.#transactions.length
    };
  }

  get items() {
    return this.#items;
  }
}

// ==========================
// DOM INTEGRATION
// ==========================
const system = new RealEstateSystem();

const form = document.getElementById("propertyForm");
const list = document.getElementById("propertyList");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let editingId = null;

// FORM SUBMIT (CREATE + EDIT)
form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const price = document.getElementById("price").value;
  const type = document.getElementById("type").value;

  if (editingId) {
    const property = system.findItem(editingId);
    property.location = location;
    editingId = null;
  } else {
    let property;

    if (type === "House") {
      property = new House(name, location, price);
    } else if (type === "Apartment") {
      property = new Apartment(name, location, price);
    } else {
      property = new CommercialProperty(name, location, price);
    }

    system.addItem(property);
  }

  form.reset();
  render();
});

searchInput.addEventListener("input", render);
filterType.addEventListener("change", render);

// RENDER FUNCTION
function render() {
  list.innerHTML = "";

  let items = system.searchByName(searchInput.value);
  items = filterType.value === "All"
    ? items
    : items.filter(item => item.getType() === filterType.value);

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.getInfo()}</p>
      <p>Location: ${item.location}</p>
      <button onclick="editProperty('${item.id}')">Edit</button>
      <button onclick="deleteProperty('${item.id}')">Delete</button>
    `;

    list.appendChild(div);
  });

  const data = system.getStats();
  stats.textContent = `Total Properties: ${data.total}`;
}

// EDIT FUNCTION
function editProperty(id) {
  const property = system.findItem(id);

  document.getElementById("name").value = property.name;
  document.getElementById("location").value = property.location;

  editingId = id;
}

// DELETE FUNCTION
function deleteProperty(id) {
  system.removeItem(id);
  render();
}