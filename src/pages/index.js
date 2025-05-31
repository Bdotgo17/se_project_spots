import "./index.css";
import logoImage from "../images/logo.svg";
import avatarImage from "../images/avatar.jpg";
import pencilIcon from "../images/pencilLightAv.svg";
import redTrashCan from "../images/redTrashCan.svg"; // Import the SVG file
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

enableValidation({
  formSelector: ".form",
  inputSelector: ".form__input",
  submitButtonSelector: ".form__submit",
  inactiveButtonClass: "form__submit_disabled",
  inputErrorClass: "form__input_type_error",
});

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;

//const cardTemplate = document.querySelector("#card-template");
// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];

let currentUserId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "3e11d65b-b09c-46fc-aefb-4bca8b1f4fd1",
    "Content-Type": "application/json",
  },
});

console.log(api);

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;
    console.log("Cards received:", cards);
    console.log("User info received:", userInfo);
    console.log("Card data:", cards);
    //console.log("Initial userInfo received:", userInfo); // Add this line to check the data
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    //console.log("userInfo:", userInfo);
    profileAvatar.src = userInfo.avatar;
    profileAvatar.alt = "Profile avatar";
    profileAvatar.onerror = function () {
      console.error("Error loading initial avatar");
      this.alt = "Failed to load avatar";
    };
  })
  .catch(console.error);

const cardsContainer = document.querySelector(".cards-container");
console.log("Cards container:", cardsContainer);

//Fetch all cards and log the first card's details
// api
//   .getCards()
//   .then((cards) => {
//     console.log("All cards:", cards);

//     if (cards.length > 0) {
//       const validCardId = cards[0]._id; // Use the ID of the first card
//       console.log("Fetching card with ID:", validCardId);
//       api
//         .getCard(validCardId)
//         .then((card) => console.log("Card details:", card))
//         .catch((error) => console.error("Error fetching card:", error));
//     } else {
//       console.error("No cards found in the database.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching cards:", error);
//   });

// console.log("Fetching all cards...");
// api.getCards().then((cards) => {
//   console.log("Fetched cards:", cards);
// });

// console.log("Fetching a single card...");
// api.getCard(cardId).then((card) => {
//   console.log("Fetched card:", card);
// });

// api
//   .getCard(cardId)
//   .then((card) => {
//     console.log("Fetched card:", card);
//   })
//   .catch((error) => {
//     console.error("Error fetching card:", error);
//   });

const handleFormSubmit = (event) => {
  event.preventDefault();

  const submitBtn = event.target.querySelector(".form__submit");
  setButtonText(submitBtn, true); // Set the button to the loading state

  api
    .submitFormData(formData)
    .then(() => {
      console.log("Form submitted successfully.");
      // Add any additional cleanup actions here
    })
    .catch((error) => {
      console.error("Error submitting form:", error);
    })
    .finally(() => {
      setButtonText(submitBtn, false); // Reset the button text to "Save"
    });
};
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const profilePencilIcon = document.querySelector(".profile__pencil-icon");
profilePencilIcon.src = pencilIcon;

const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");

const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = document.querySelector("#deleteCancelBtn");

// avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");

// Function to create a card element
function getCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("data-id", card._id); // Add card ID for easy identification

  const cardImageEl = document.createElement("img");
  cardImageEl.classList.add("card__image");
  cardImageEl.src = card.link;
  cardImageEl.alt = card.name || "Card image";

  cardImageEl.onerror = function () {
    console.error("Error loading card image:", cardImageEl.src);
    cardImageEl.src = "https://picsum.photos/150"; // Fallback image
  };

  cardElement.appendChild(cardImageEl);

  const cardContent = document.createElement("div");
  cardContent.classList.add("card__content");

  const cardTitle = document.createElement("h2");
  cardTitle.classList.add("card__title");
  cardTitle.textContent = card.name || "Untitled";
  cardContent.appendChild(cardTitle);

  // Add the delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("card__delete-button");
  deleteButton.innerHTML = `<img src="${redTrashCan}" alt="Delete" class="card__delete-icon" />`; // Use the imported SVG
  deleteButton.addEventListener("click", () => {
    openDeleteModal(card._id); // Pass the card ID to the delete modal
  });
  cardElement.appendChild(deleteButton); // Append the delete button to the card

  // Add the like button
  const likeButton = document.createElement("button");
  likeButton.classList.add("card__like-button");
  if (card.isLiked) {
    likeButton.classList.add("card__like-button_liked"); // Set initial state based on server data
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains("card__like-button_liked");

    // Toggle the like state
    if (isLiked) {
      api
        .unlikeCard(card._id) // Call API to unlike the card
        .then(() => {
          likeButton.classList.remove("card__like-button_liked");
        })
        .catch((error) => {
          console.error("Error unliking card:", error);
        });
    } else {
      api
        .likeCard(card._id) // Call API to like the card
        .then(() => {
          likeButton.classList.add("card__like-button_liked");
        })
        .catch((error) => {
          console.error("Error liking card:", error);
        });
    }
  });

  cardContent.appendChild(likeButton); // Append the like button to the card content
  cardElement.appendChild(cardContent); // Append the card content to the card

  return cardElement;
}

// Fetch and render cards on page load
api
  .getCards()
  .then((cards) => {
    const cardsContainer = document.querySelector(".cards-container");

    if (!cardsContainer) {
      console.error("Cards container not found in the DOM.");
      return;
    }

    cards.forEach((card) => {
      const cardElement = getCardElement(card); // Pass the card object to the function
      cardsContainer.appendChild(cardElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching cards:", error);
  });

document.addEventListener("DOMContentLoaded", () => {
  const deleteCancelBtn = document.querySelector("#deleteCancelBtn");
  const deleteModal = document.querySelector("#deleteModal"); // Ensure this is defined

  if (deleteCancelBtn) {
    deleteCancelBtn.addEventListener("click", () => {
      closeModal(deleteModal);
    });
  } else {
    console.error("deleteCancelBtn not found in the DOM");
  }
});

function handleImageClick(data) {
  previewModalImageEl.src = data.link;
  previewModalImageEl.alt = data.name;
  previewModalCaptionEl.textContent = data.name;
  openModal(previewModal);
}

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const cardId = deleteForm.dataset.cardId;
  console.log("Attempting to delete card:", cardId);

  api
    .deleteCard(cardId)
    .then(() => {
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      cardElement.remove();
      closeModal(deleteModal);
    })
    .catch((error) => {
      console.error("Error deleting card:", error); // Improve error logging
    });
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    closeModal(activeModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keyup", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keyup", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  //change text content to saving...
  const submitBtn = evt.submitter;
  //submitBtn.textContent = "Saving...";
  setButtonText(submitBtn, true);

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      //call setButtonText instead
      // Add any cleanup or final actions here if needed
      //submitBtn.textContent = "Save"; // Example: Reset button text
      setButtonText(submitBtn, false);
    });
  // change text content back to save
}

//implement loading text for all other form submissions
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .addCard(inputValues)
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

function handleAvatarUpdate(avatarUrl) {
  console.log("Avatar URL being sent:", avatarUrl);

  api
    .updateAvatar(avatarUrl)
    //return Promise.reject(`Error: ${res.status}`);
    .then((userData) => {
      console.log("Server response from avatar update:", userData);

      profileAvatar.src = userData.avatar;
      console.log("Avatar image URL:", profileAvatar.src);

      profileAvatar.alt = "Profile avatar";
      profileAvatar.onerror = function () {
        console.error("Error loading avatar image", profileAvatar.src);
        function handleAvatarUpdate(avatarUrl) {
          console.log("Avatar URL being sent:", avatarUrl);

          api
            .updateAvatar(avatarUrl)
            .then((userData) => {
              console.log("Server response from avatar update:", userData);

              profileAvatar.src = userData.avatar;
              profileAvatar.alt = "Profile avatar";
              profileAvatar.onerror = function () {
                console.error("Error loading avatar image:", profileAvatar.src);
                profileAvatar.src = "https://via.placeholder.com/150"; // Fallback avatar
              };
            })
            .catch((error) => {
              console.error("Error updating avatar:", error);
            });
        }
      };
    })

    .catch((error) => {
      return Promise.reject();
      console.error("Error updating avatar:", error);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    console.log("clicked", event.target);
    if (
      event.target.classList.contains("modal__close-btn") ||
      event.target.classList.contains("modal")
    ) {
      closeModal(modal);
    }
  });
});

// select the avatar
// todo select avatarmodalbtn at the top of the page
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

// profileAvatar.addEventListener("click", () => {
//   const newAvatarUrl = prompt("Please enter the URL for your new avatar:");
//   if (newAvatarUrl) {
//     handleAvatarUpdate(newAvatarUrl);
//   }
// });

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  handleAvatarUpdate(avatarInput.value)
    .then(() => {
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    })
    .finally(() => {
      setButtonText(submitBtn, false);
    });
});

function isValidImageUrl(url) {
  // Can you think of what checks we should add here?
  try {
    const urlObject = new URL(url);
    // What else should we check?

    return true;
  } catch (e) {
    return false;
  }
}

enableValidation(settings); // Ensure this line ends with a semicolon

// class Api {
//   constructor({ baseUrl, headers }) {
//     this._baseUrl = baseUrl;
//     this._headers = headers;
//   }

//   // Fetch all cards
//   getCards() {
//     return fetch(`${this._baseUrl}/cards`, {
//       method: "GET",
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }

//   // Fetch a single card by ID
//   getCard(cardId) {
//     return fetch(`${this._baseUrl}/cards/${cardId}`, {
//       method: "GET",
//       headers: this._headers,
//     }).then((res) => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(`Error: ${res.status}`);
//     });
//   }
// }

// Select modal elements
const deleteConfirmBtn = document.querySelector("#delete-btn");
let cardToDeleteId = null; // Store the card ID to delete

// Function to open the delete modal
// function openDeleteModal(cardId) {
//   console.log("Opening delete modal for card ID:", cardId);
//   cardToDeleteId = cardId; // Store the card ID
//   const deleteModal = document.querySelector("#delete-modal");
//   deleteModal.classList.add("modal_opened");
// }

// Function to close the delete modal
function closeDeleteModal() {
  const deleteModal = document.querySelector("#delete-modal");
  deleteModal.classList.remove("modal_opened");
  cardToDeleteId = null; // Clear the stored card ID
}

// Event listener for the delete confirmation button
deleteConfirmBtn.addEventListener("click", () => {
  if (cardToDeleteId) {
    api
      .deleteCard(cardToDeleteId) // Call the API to delete the card
      .then(() => {
        console.log(`Card with ID ${cardToDeleteId} deleted.`);
        document.querySelector(`[data-id="${cardToDeleteId}"]`).remove(); // Remove the card from the DOM
        closeDeleteModal();
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  }
});

// Event listener for the cancel button
cancelBtn.addEventListener("click", closeDeleteModal);

// const deleteCancelBtn = document.querySelector("#deleteCancelBtn");
// if (!deleteCancelBtn) {
//   console.error("deleteCancelBtn not found in the DOM");
// } else {
//   deleteCancelBtn.addEventListener("click", closeDeleteModal);
// }

document.addEventListener("DOMContentLoaded", () => {
  const deleteConfirmBtn = document.querySelector("#delete-btn");
  let cardToDeleteId = null; // Store the card ID to delete

  function openDeleteModal(cardId) {
    console.log("Opening delete modal for card ID:", cardId);
    cardToDeleteId = cardId; // Store the card ID
    const deleteModal = document.querySelector("#delete-modal");
    if (!deleteModal) {
      console.error("Delete modal not found in the DOM.");
      return;
    }
    deleteModal.classList.add("modal_opened");
  }
});

export default Api;
