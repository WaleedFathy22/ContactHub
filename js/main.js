// ── DOM  ──
var photoInput = document.getElementById("photoInput");
var fullNameInput = document.getElementById("fullName");
var phoneNumberInput = document.getElementById("phoneNumber");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groubInput = document.getElementById("groub");
var notesInput = document.getElementById("notes");
var searchInput = document.getElementById("search");
var favoritesCheckInput = document.getElementById("favCheck");
var emergencyCheckInput = document.getElementById("emergencyCheck");
var totalContactsCount = document.getElementById("total-contacts");
var totalFavoritesCount = document.getElementById("favorites");
var totalemergencyCount = document.getElementById("emergency");
var avatarGradient = document.getElementsByClassName("contact-profile-icon");
// ── To determine if we are in add or update mode  ──
var updateMode = false;
// To keep track of the contact being updated using contact index
var updatedIndex = 0;
// ── To avoid repeating the same gradient for consecutive contacts  ──
var lastGradient = null;
// ── Gradients  ──
var gradients = [
  "gradient-ocean",
  "gradient-sunset",
  "gradient-forest",
  "gradient-fire",
  "gradient-midnight",
  "gradient-aurora",
  "gradient-toxic",
  "gradient-candy",
  "gradient-volcano",
  "gradient-gold",
  "gradient-pink-red",
  "gradient-yellow-orange",
  "gradient-nebula",
  "gradient-crimson",
  "gradient-arctic",
  "gradient-emerald",
  "gradient-royal",
  "gradient-rust",
  "gradient-steel",
  "gradient-jade",
  "gradient-magma",
  "gradient-indigo",
  "gradient-purple-violet",
  "gradient-violet-indigo",
  "gradient-indigo-blue",
  "gradient-blue-indigo",
  "gradient-rose-red",
  "gradient-rose-purple",
  "gradient-amber-red",
  "gradient-amber-orange",
  "gradient-emerald-blue",
  "gradient-green-emerald",
  "gradient-purple-rose",
  "gradient-violet-rose",
  "gradient-indigo-violet",
  "gradient-blue-violet",
  "gradient-purple-indigo",
  "gradient-red-rose",
  "gradient-amber-emerald",
  "gradient-blue-emerald",
  "gradient-rose-amber",
  "gradient-purple-blue",
  "gradient-violet-emerald",
  "gradient-indigo-rose",
  "gradient-green-blue",
  "gradient-red-violet",
  "gradient-amber-violet",
  "gradient-rose-emerald",
  "gradient-purple-amber",
  "gradient-blue-rose",
  "gradient-indigo-amber",
  "gradient-emerald-violet",
];

// ── Get random gradient for contact avatar  ──
function getRandomGradient() {
  let currentGradient;
  do {
    currentGradient = Math.floor(Math.random() * gradients.length);
  } while (currentGradient === lastGradient);
  lastGradient = currentGradient;
  return gradients[currentGradient];
}

function getGroubSelectedStyle(groubValue) {
  switch (groubValue) {
    case "family":
      return "family";
    case "friends":
      return "friends";
    case "work":
      return "work";
    case "school":
      return "school";
    case "other":
      return "other";
  }
}

// ── Validation regex patterns  ──
var validationRegex = {
  fullName: /^[A-Za-z\u0600-\u06FF\s]{2,50}$/,
  phoneNumber: /^(\+02|02)?01[0125][0-9]{8}$/
};

function isValidInput(regex, input) {
  if(!regex.test(input.value)) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.nextElementSibling.innerText = input.id === "fullName" ? "Name should contain only letters and spaces (2-50 characters)" : "Please enter a valid Egyptian phone number";
    input.focus();
    return false;
  } else {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    input.nextElementSibling.innerText = "";
    swal.close();
    return true;
  }
}

// ── Data  ──
var contactsList = JSON.parse(localStorage.getItem("contactsList")) || [];
var favoritesList = JSON.parse(localStorage.getItem("favoritesList")) || [];
var emergencyList = JSON.parse(localStorage.getItem("emergencyList")) || [];

// ── Initial render ──
totalContactsCount.innerHTML = contactsList.length;
totalFavoritesCount.innerHTML = favoritesList.length;
totalemergencyCount.innerHTML = emergencyList.length;
document.getElementById("total").innerHTML = contactsList.length;

displayContacts(contactsList);
displayFavorites();
displayEmergency();

// ── Get first letters of contact name for avatar  ──
function getFirstLetters(name) {
  var parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// ── Render all contacts  ──
function displayContacts(contacts) {
  var container = document.getElementById("rowdata");
  var contactCards = "";

  // no contacts, show empty state
  if (contacts.length === 0) {
    container.innerHTML = `
  <div class="d-flex mt-5 justify-content-center mb-5">
    <div class="text-center mt-3">
      <div class="empty-state-icon mx-auto mb-4">
        <i class="fa-solid fa-address-book"></i>
      </div>
      <p class="empty-title mb-1">No contacts found</p>
      <p class="empty-subtitle mb-0">Click "Add Contact" to get started</p>
    </div>
  </div>`;
    return;
  }

  // loop through contacts and create cards
  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i];
    var initials = getFirstLetters(contact.fullName);
    var hasAvatar = contact.avatar !== "";
    contactCards += `
      <div class="col-md-6">
        <div class="contact-card overflow-hidden rounded-4 bg-white">

          <!-- Head -->
          <div class="contact-card-head pt-3 px-3">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <div class="contact-profile-icon ${contact.gradient} position-relative rounded-3 d-flex flex-wrap justify-content-center align-items-center ${hasAvatar ? "d-none" : ""}">
                <p class="text-white fw-bold mb-0">${initials}</p>
                <div class="position-absolute layer-icon icon-top rounded-circle border border-2 border-white bg-warning ${contact.isFavorite ? "d-flex" : "d-none"}">
                  <i class="fas fa-star text-white"></i>
                </div>
                <div class="position-absolute layer-icon icon-bottom rounded-circle border border-2 border-white ${contact.isEmergency ? "d-flex" : "d-none"}">
                  <i class="fa-solid text-white fa-heart-pulse"></i>
                </div>
              </div>

              <div class="contact-profile-image position-relative rounded-3 object-fit-cover ${hasAvatar ? "d-block" : "d-none"}">
                <img class="rounded-3" src="${contact.avatar}" alt="${contact.fullName}">
                <div class="position-absolute layer-icon icon-top rounded-circle border border-2 border-white bg-warning ${contact.isFavorite ? "d-flex" : "d-none"}">
                  <i class="fas fa-star text-white"></i>
                </div>
                <div class="position-absolute layer-icon icon-bottom rounded-circle border border-2 border-white ${contact.isEmergency ? "d-flex" : "d-none"}">
                  <i class="fa-solid text-white fa-heart-pulse"></i>
                </div>
              </div>

              <div>
                <h3 class="mb-1 fw-semibold fs-6">${contact.fullName}</h3>
                <div class="d-flex flex-wrap gap-1 align-items-center">
                  <span class="bg-blue-100 icon rounded-2">
                    <i class="fas text-primary fa-phone"></i>
                  </span>
                  <span class="fs-xs text-color">${contact.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="contact-card-body pt-3 px-3 py-3">
            <div class="d-flex flex-wrap align-items-center gap-2">
              <span class="card-body-icon email-icon">
                <i class="fas fs-xxs fa-envelope"></i>
              </span>
              <p class="mb-0 text-color fs-xs">${contact.email}</p>
            </div>
            <div class="d-flex mt-2 flex-wrap align-items-center gap-2">
              <span class="card-body-icon location-icon">
                <i class="fas fs-xxs fa-location-dot"></i>
              </span>
              <p class="mb-0 text-color fs-xs">${contact.address}</p>
            </div>
            <div class="d-flex mt-2 flex-wrap gap-2 align-items-center">${contact.groub ? `<div class="groub ${getGroubSelectedStyle(contact.groub)}">
              <span class="fs-xxs">${contact.groub}</span>
            </div>` : ""} ${contact.isEmergency ? `
              <div class="d-flex emergency flex-wrap align-items-center">
                <span class="pe-1"><i class="fa-solid fs-xxs fa-heart-pulse"></i></span>
                <span class="fs-xxs">Emergency</span>
              </div>`
                  : ""
              }
            </div>
          </div>

          <!-- Footer -->
          <div class="contact-card-footer d-flex justify-content-between align-items-center px-3 py-2 bg-body-tertiary">
            <div class="d-flex flex-wrap align-items-center gap-3">
              <div class="phone-anchor position-relative">
                <a href="tel:${contact.phoneNumber}">
                  <i class="fas fs-xs fa-phone"></i>
                </a>
              </div>
              <div class="email-anchor position-relative">
                <a href="mailto:${contact.email}">
                  <i class="fas fs-xs fa-envelope"></i>
                </a>
              </div>
            </div>
            <div class="card-buttons d-flex align-items-center gap-2">
              <button onclick="toggleFavorite(${contacts.length < contactsList.length ? contact.oldIndex : i})" class="border-0 btn-fav fs-xs btn ${contact.isFavorite ? "fav-toggle-checked fav-toggle-hover" : "text-gray"}">
                <i class="  ${contact.isFavorite ? "fas fa-star" : "fa-regular fa-star"}  "></i>
              </button>
              <button onclick="toggleEmergency(${contacts.length < contactsList.length ? contact.oldIndex : i})" class="border-0 btn-emergency fs-xs btn ${contact.isEmergency ? "emergency-toggle-checked emergency-toggle-hover" : "text-gray"}">
                <i class=" ${contact.isEmergency ? "fas fas fa-heart-pulse" : "fa-regular fa-heart"}  "></i>
              </button>
              <button onclick="setDataToInputs(${contacts.length < contactsList.length ? contact.oldIndex : i})" data-bs-toggle="modal" data-bs-target="#contactModal" class="border-0 text-muted btn-update fs-xs btn">
                <i class="fas fa-pen"></i>
              </button>
              <button onclick="DeleteContacts('${contact.phoneNumber}')" class="border-0 text-muted btn-delete fs-xs btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = contactCards;
}

// ── Reset all inputs after add/update contact ──
function resetAllInputs() {
  updateMode = false;
  fullNameInput.value = "";
  phoneNumberInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groubInput.value = "";
  notesInput.value = "";
  favoritesCheckInput.checked = false;
  emergencyCheckInput.checked = false;
  if (photoInput.files[0]) photoInput.value = "";
  document.getElementById("avatarImg").style.display = "none";
  document.getElementById("avatarIcon").style.display = "";

  document.getElementById("fullNameError").innerText = "";
  document.getElementById("phoneNumberError").innerText = "";
}

// ── Display favorite contacts ──
function displayFavorites() {
  var container = document.getElementById("favoritesRowData");
  var favContacts = "";

  if (favoritesList.length === 0) {
    favContacts += `<p class="text-gray text-center fs-xs mb-0 py-4 fw-medium" >No favorites yet</p>`;
    container.innerHTML = favContacts;
    return;
  }

  for (var i = 0; i < favoritesList.length; i++) {
    var contact = favoritesList[i];
    favContacts += `
      <div class="col-md-6 col-xl-12" >
        <a class="d-flex flex-grow-1  rounded-3 p-2 justify-content-between align-items-center" href="tel:${contact.phoneNumber}">
                  <div class="d-flex flex-wrap gap-2 align-items-center">
                    <div id="contact-profile-icon" class="contact-profile-icon ${contact.gradient} rounded-3 ${contact.avatar ? "d-none" : "d-flex"}  flex-wrap justify-content-center align-items-center">
                      <p class="text-white fs-xxs fw-semibold mb-0">${getFirstLetters(contact.fullName)}</p>
                    </div>
                    <div class="contact-profile-image rounded-3 object-fit-cover ${contact.avatar ? "d-block" : "d-none"} ">
                      <img class="rounded-3" id="contact-image"  src="${contact.avatar}" alt="profile image">
                    </div>
                    <div>
                      <h3 class="mb-0 mt-2 fs-xxs">${contact.fullName}</h3>
                      <div >
                        <span class="fs-xxs number text-color">${contact.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="icon d-flex flex-wrap justify-content-center align-items-center">
                      <i class="fas fa-phone" ></i>
                    </div>
                  </div>
                </a>
      </div>

    `;
  }
  container.innerHTML = favContacts;
}

// ── Display emergency contacts ──
function displayEmergency() {
  var emergencyContacts = "";
  var container = document.getElementById("emergencyRowData");

  if (emergencyList.length === 0) {
    emergencyContacts += `<p class="text-gray text-center fs-xs mb-0 py-4 fw-medium" >No emergency contacts</p>`;
    container.innerHTML = emergencyContacts;
    return;
  }

  for (var i = 0; i < emergencyList.length; i++) {
    var contact = emergencyList[i];
    emergencyContacts += `
    
                  <div class="contact-summary col-md-6 col-xl-12 d-flex flex-column gap-3" >
                <a class="d-flex rounded-3 p-2 justify-content-between align-items-center" href="tel:${contact.phoneNumber}">
                  <div class="d-flex flex-wrap gap-2 align-items-center">
                    <div class="contact-profile-icon ${contact.gradient} rounded-3 ${contact.avatar ? "d-none" : "d-flex"} flex-wrap justify-content-center align-items-center">
                      <p class="text-white fs-xxs fw-semibold mb-0">${getFirstLetters(contact.fullName)}</p>
                    </div>
                    <div class="contact-profile-image rounded-3 object-fit-cover ${contact.avatar ? "d-block" : "d-none"} ">
                      <img class="rounded-3" id="contact-image" src="${contact.avatar}" alt="profile image">
                    </div>
                    <div>
                      <h3 class="mb-0 mt-2 fs-xxs">${contact.fullName}</h3>
                      <div >
                        <span class="fs-xxs number text-color">${contact.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="icon d-flex flex-wrap justify-content-center align-items-center">
                      <i class="fas fa-phone" ></i>
                    </div>
                  </div>
                </a>
              </div>
    `;
  }
  container.innerHTML = emergencyContacts;
}

// ── Add new contact ──
function addContact() {

  if(fullNameInput.value.trim() === "" || phoneNumberInput.value.trim() === "") {
    Swal.fire({
      title: fullNameInput.value.trim() === "" ? "Missing Name" : "Missing Phone ",
      text: fullNameInput.value.trim() === "" ? "Please enter a name for the contact!" : "Please enter a phone number!",
      icon: "error",
    });
    return;
  }

  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].phoneNumber === phoneNumberInput.value.trim()) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text: "A contact with this phone number already exists: " + contactsList[i].fullName,
        icon: "error",
      });
      return;
    }
  }

if(isValidInput(validationRegex.fullName, fullNameInput) &&
   isValidInput(validationRegex.phoneNumber, phoneNumberInput)) {
  
  var contact = {
    fullName: fullNameInput.value.trim(),
    phoneNumber: phoneNumberInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    groub: groubInput.value,
    notes: notesInput.value.trim(),
    isFavorite: favoritesCheckInput.checked,
    isEmergency: emergencyCheckInput.checked,
    avatar:
      photoInput.files.length > 0 ? "images/" + photoInput.files[0].name : "",
    gradient: getRandomGradient(),
  };

  // close modal after adding contact اقفل يا حضري
  var modalEl = document.getElementById("contactModal");
  var modal   = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  Swal.fire({
    title: "Added!",
    text: "Contact has been added successfully.",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  });

  if (contact.isFavorite) {
    favoritesList.push(contact);
    localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
    totalFavoritesCount.innerHTML = favoritesList.length;
    displayFavorites();
  }

  if (contact.isEmergency) {
    emergencyList.push(contact);
    localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
    totalemergencyCount.innerHTML = emergencyList.length;
    displayEmergency();
  }

  contactsList.push(contact);
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  totalContactsCount.innerHTML = contactsList.length;
  document.getElementById("total").innerHTML = contactsList.length;

  displayContacts(contactsList);

  resetAllInputs();
}
else {
  Swal.fire({
    title: "Invalid " + (isValidInput(validationRegex.fullName, fullNameInput) ? "Phone Number" : "Name"),
    text: isValidInput(validationRegex.fullName, fullNameInput) ? "Please enter a valid Egyptian phone number." : "Name should contain only letters and spaces (2-50 characters).",
    icon: "error",
  });
}
}

// ── Delete contact ──
function DeleteContacts(phoneNumber) {
  var contactToDelete = contactsList.find(function (contact) {
    return contact.phoneNumber === phoneNumber;
  });

  Swal.fire({
    title: "Delete Contact?",
    text:
      "Are you sure you want to delete " +
      contactToDelete.fullName +
      "? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#333333",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contactsList = contactsList.filter(function (contact) {
        return contact.phoneNumber !== phoneNumber;
      });

      favoritesList = favoritesList.filter(function (contact) {
        return contact.phoneNumber !== phoneNumber;
      });

      emergencyList = emergencyList.filter(function (contact) {
        return contact.phoneNumber !== phoneNumber;
      });

      localStorage.setItem("contactsList", JSON.stringify(contactsList));

      localStorage.setItem("favoritesList", JSON.stringify(favoritesList));

      localStorage.setItem("emergencyList", JSON.stringify(emergencyList));

      displayContacts(contactsList);

      displayFavorites();

      displayEmergency();

      totalContactsCount.innerHTML = contactsList.length;

      totalFavoritesCount.innerHTML = favoritesList.length;

      totalemergencyCount.innerHTML = emergencyList.length;

      document.getElementById("total").innerHTML = contactsList.length;
    }
    Swal.fire({
      title: "Deleted!",
      text: "Contact has been deleted.",
      icon: "success",
      buttonsStyling: false,
      customClass: {
        confirmButton: "d-none",
      },
      timer: 1500,
    });
  });

  
}

// ── Search contacts ──
function search() {
  var searchTirm = searchInput.value;
  var filteredList = [];
  for (var i = 0; i < contactsList.length; i++) {
    var contact = contactsList[i];

    if (
      contact.fullName.toLowerCase().includes(searchTirm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTirm.toLowerCase()) ||
      contact.phoneNumber.toLowerCase().includes(searchTirm.toLowerCase())
    ) {
      filteredList.push({ ...contact, oldIndex: i });
    }
  }
  displayContacts(filteredList);
}

// ── Set data to inputs for updating contact ──
function setDataToInputs(index) {
  updateMode = true;
  updatedIndex = index;
  fullNameInput.value = contactsList[index].fullName;
  phoneNumberInput.value = contactsList[index].phoneNumber;
  emailInput.value = contactsList[index].email;
  addressInput.value = contactsList[index].address;
  groubInput.value = contactsList[index].groub;
  notesInput.value = contactsList[index].notes;
  favoritesCheckInput.checked = contactsList[index].isFavorite;
  emergencyCheckInput.checked = contactsList[index].isEmergency;
  photoInput.value = contactsList[index].avatar;
}

// ── update contacts ──
function updateContact() {
    
  
  if(fullNameInput.value.trim() === "" || phoneNumberInput.value.trim() === "") {
    Swal.fire({
      title: fullNameInput.value.trim() === "" ? "Missing Name" : "Missing Phone ",
      text: fullNameInput.value.trim() === "" ? "Please enter a name for the contact!" : "Please enter a phone number!",
      icon: "error",
    });
    return;
  }

  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].phoneNumber === phoneNumberInput.value.trim()) {
      Swal.fire({
        title: "Duplicate Phone Number",
        text: "A contact with this phone number already exists: " + contactsList[i].fullName,
        icon: "error",
      });
      return;
    }
  }

  if(isValidInput(validationRegex.fullName, fullNameInput) &&
   isValidInput(validationRegex.phoneNumber, phoneNumberInput)) {
  
  var oldPhoneNumber = contactsList[updatedIndex].phoneNumber;
  var updatedContact = {
    fullName: fullNameInput.value.trim(),
    phoneNumber: phoneNumberInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    groub: groubInput.value,
    notes: notesInput.value.trim(),
    isFavorite: favoritesCheckInput.checked,
    isEmergency: emergencyCheckInput.checked,
    avatar:
      photoInput.files.length > 0
        ? "images/" + photoInput.files[0].name
        : contactsList[updatedIndex].avatar,
    gradient: contactsList[updatedIndex].gradient,
  };

  contactsList[updatedIndex] = updatedContact;

  favoritesList = favoritesList.filter(function (contact) {
    return contact.phoneNumber !== oldPhoneNumber;
  });

  if (updatedContact.isFavorite) favoritesList.push(updatedContact);

  emergencyList = emergencyList.filter(function (contact) {
    return contact.phoneNumber !== oldPhoneNumber;
  });

  if (updatedContact.isEmergency) emergencyList.push(updatedContact);

  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  localStorage.setItem("emergencyList", JSON.stringify(emergencyList));

  totalFavoritesCount.innerHTML = favoritesList.length;
  totalemergencyCount.innerHTML = emergencyList.length;

  // close modal after adding contact اقفل يا حضري
  var modalEl = document.getElementById("contactModal");
  var modal   = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully.",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  });

  displayContacts(contactsList);
  displayFavorites();
  displayEmergency();
  resetAllInputs();
}
else {
  Swal.fire({
    title: "Invalid " + (isValidInput(validationRegex.fullName, fullNameInput) ? "Phone Number" : "Name"),
    text: isValidInput(validationRegex.fullName, fullNameInput) ? "Please enter a valid Egyptian phone number." : "Name should contain only letters and spaces (2-50 characters).",
    icon: "error",
  });
}
}

// ── save contact update/add ──
function saveContact() {
  if (updateMode)
    updateContact();
  else 
    addContact();
}

// ── Toggle favorite status of contact ──
function toggleFavorite(index) {
  contactsList[index].isFavorite = !contactsList[index].isFavorite;

  if (contactsList[index].isFavorite) {
    favoritesList.push(contactsList[index]);
  } else {
    favoritesList = favoritesList.filter(
      function(contact) {
        return contact.phoneNumber !== contactsList[index].phoneNumber;
      }
    );
  }

  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
  totalFavoritesCount.innerHTML = favoritesList.length;
  displayContacts(contactsList);
  displayFavorites();
}

// ── Toggle emergency status of contact ──
function toggleEmergency(index) {
  contactsList[index].isEmergency = !contactsList[index].isEmergency;
  if (contactsList[index].isEmergency) {
    emergencyList.push(contactsList[index]);
  } else {
    emergencyList = emergencyList.filter(
      function(contact) {
        return contact.phoneNumber !== contactsList[index].phoneNumber;
      }
    );
  }

  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  localStorage.setItem("emergencyList", JSON.stringify(emergencyList));
  totalemergencyCount.innerHTML = emergencyList.length;
  displayContacts(contactsList);
  displayEmergency();
}
