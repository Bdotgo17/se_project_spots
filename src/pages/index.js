import "../pages/index.css";
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
import {
  checkInputValidity,
  showInputError,
  hideInputError,
  toggleButtonState,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

enableValidation({
  config,
});

const cardsList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;

let currentUserId;
let cardToDeleteId = null; // Store the card ID to delete

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
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
    profileAvatar.alt = "Profile avatar";
  })
  .catch(console.error);

const cardsContainer = document.querySelector(".cards-container");
console.log("Cards container:", cardsContainer);

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

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(".modal__close-btn");

const setEventListeners = (formEl, config) => {
  // Select all inputs within the form
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  // Select the submit button within the form
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  console.log("Form being processed:", formEl);
  console.log("Submit button found:", buttonEl);

  // Check if the submit button exists
  if (!buttonEl) {
    console.error("Submit button not found in the DOM for form:", formEl);
    return;
  }

  // Add event listeners to each input
  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", () => {
      checkInputValidity(formEl, inputEl, config); // Validate the input
      toggleButtonState(inputList, buttonEl, config); // Update the button state
    });
  });

  // Initialize the button state
  toggleButtonState(inputList, buttonEl, config);
};

// Function to create a card element
function getCardElement(card) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card");
  cardElement.setAttribute("data-id", card._id); // Add card ID for easy identification

  //console.log(card)
  const cardImageEl = document.createElement("img");
  cardImageEl.classList.add("card__image");
  cardImageEl.src = card.link;
  cardImageEl.alt = card.name || "Card image";

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
    openDeleteModal(card._id); // Ensure the function name matches exactly
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

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_opened");
    closeModal(activeModal);
  }
}

function openModal(modal) {
  console.log("Opening modal:", modal);
  modal.classList.add("modal_opened");
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
      setButtonText(submitBtn, false);
    });
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

  return api
    .updateAvatar(avatarUrl)
    .then((userData) => {
      console.log("Server response from avatar update:", userData);

      // Update the avatar in the DOM
      profileAvatar.src = userData.avatar;
      profileAvatar.alt = "Profile avatar";

      // Handle fallback if the avatar fails to load
      profileAvatar.onerror = function () {
        console.error("Error loading avatar image:", profileAvatar.src);
        profileAvatar.src = "https://via.placeholder.com/150"; // Fallback avatar
      };
    })
    .catch((error) => {
      console.error("Error updating avatar:", error);
      // Optionally show an error message to the user
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

enableValidation(config);

// Function to open the delete modal
function openDeleteModal(cardId) {
  console.log("Opening delete modal for card ID:", cardId);
  cardToDeleteId = cardId; // Assign the card ID to the existing variable
  const deleteModal = document.querySelector("#delete-modal");
  if (!deleteModal) {
    console.error("Delete modal not found in the DOM.");
    return;
  }
  deleteModal.classList.add("modal_opened"); // Open the modal
}

// Function to close the delete modal
function closeDeleteModal() {
  const deleteModal = document.querySelector("#delete-modal");
  if (!deleteModal) {
    console.error("Delete modal not found in the DOM.");
    return;
  }
  deleteModal.classList.remove("modal_opened"); // Close the modal
  cardToDeleteId = null; // Clear the stored card ID
}

function handleDeleteCard(deleteConfirmBtn) {
  if (!deleteConfirmBtn) {
    console.error("Delete button is not defined.");
    return;
  }

  if (!cardToDeleteId) {
    console.warn("No card ID to delete. Operation aborted.");
    return;
  }

  // Provide user feedback: change button text and disable it
  setButtonText(deleteConfirmBtn, true, "Deleting...");
  deleteConfirmBtn.disabled = true;

  // Make the API call to delete the card
  api
    .deleteCard(cardToDeleteId)
    .then(() => {
      console.log(`Card with ID ${cardToDeleteId} deleted successfully.`);
      // Remove the card element from the DOM
      const cardElement = document.querySelector(
        `[data-id="${cardToDeleteId}"]`
      );
      if (cardElement) {
        console.log("Removing card element from the DOM:", cardElement);
        cardElement.remove();
      } else {
        console.error("Card element not found in the DOM.");
      }
      closeDeleteModal(); // Close the modal after successful deletion
    })
    .catch((error) => {
      // Handle errors during deletion
      console.error("Error deleting card:", error);
      alert("Failed to delete card. Please try again."); // User-friendly alert
    })
    .finally(() => {
      // Always run: Reset button text and re-enable it
      setButtonText(deleteConfirmBtn, false, "Delete"); // Reset to original text
      deleteConfirmBtn.disabled = false;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const deleteModal = document.querySelector("#delete-modal");
  const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
  const deleteForm = deleteModal.querySelector("#delete-form");
  const deleteCancelBtn = document.querySelector("#cancel-btn");
  const deleteConfirmBtn = document.querySelector("#delete-btn");
  const cardsContainer = document.querySelector(".cards-container");
  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = avatarModal.querySelector(".modal__form");
  const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
  const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
  const avatarInput = avatarModal.querySelector("#profile-avatar-input");

  let cardToDeleteId = null; // Store the card ID for deletion

  // Helper Functions
  function openModal(modal) {
    if (!modal) {
      console.error("Modal not found in the DOM.");
      return;
    }
    modal.classList.add("modal_opened");
  }

  function closeModal(modal) {
    if (!modal) {
      console.error("Modal not found in the DOM.");
      return;
    }
    modal.classList.remove("modal_opened");
  }

  function openDeleteModal(cardId) {
    console.log("Opening delete modal for card ID:", cardId);
    cardToDeleteId = cardId; // Store the card ID
    openModal(deleteModal);
  }

  function closeDeleteModal() {
    console.log("Closing delete modal...");
    closeModal(deleteModal);
    cardToDeleteId = null; // Clear the stored card ID
  }

  function createDeleteButton(card) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("card__delete-button");
    deleteButton.innerHTML = `<img src="${redTrashCan}" alt="Delete" class="card__delete-icon" />`; // Use the imported SVG
    deleteButton.addEventListener("click", () => {
      openDeleteModal(card._id); // Open the delete modal with the card ID
    });
    return deleteButton;
  }

  function addCard(cardElement) {
    if (cardsContainer) {
      cardsContainer.appendChild(cardElement); // Append the card to the container
    } else {
      console.error("Cards container not found in the DOM.");
    }
  }

  // Form Validation Logic
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  if (formList.length === 0) {
    console.error("No forms found in the DOM.");
  } else {
    formList.forEach((formEl) => {
      console.log("Initializing validation for form:", formEl);
      setEventListeners(formEl, {
        inputSelector: ".modal__input",
        submitButtonSelector: ".modal__submit-btn",
        inactiveButtonClass: "modal__submit-btn_disabled",
        inputErrorClass: "modal__input_type_error",
        errorClass: "modal__error_visible",
      });
    });
  }

  // Avatar Modal Logic
  avatarModalBtn.addEventListener("click", () => {
    console.log("Avatar modal open button clicked");
    openModal(avatarModal);
  });

  avatarForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = evt.submitter; // Get the submit button
    setButtonText(submitBtn, true); // Change button text to "Saving..."

    handleAvatarUpdate(avatarInput.value) // Call the function to update the avatar
      .then(() => {
        closeModal(avatarModal); // Close the modal on success
        console.log("Avatar updated successfully!");
        avatarForm.reset(); // Reset the form fields
      })
      .catch((error) => {
        console.error("An error occurred:", error); // Log any errors
      })
      .finally(() => {
        setButtonText(submitBtn, false); // Reset button text to "Save"
      });
  });

  // Event Delegation for Delete Buttons
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("card__delete-button")) {
      const cardElement = event.target.closest(".card");
      if (!cardElement) {
        console.error("Card element not found.");
        return;
      }
      const cardId = cardElement.dataset.id; // Get the card ID from the data attribute
      if (!cardId) {
        console.error("Card ID not found.");
        return;
      }
      openDeleteModal(cardId); // Open the delete modal
    }

    if (event.target.id === "cancel-btn") {
      closeDeleteModal(); // Close the delete modal
    }
  });

  // Event Listener for Confirm Delete Button
  deleteConfirmBtn.addEventListener("click", () => {
    handleDeleteCard(deleteConfirmBtn, cardToDeleteId);
  });

  deleteCancelBtn.addEventListener("click", () => {
    console.log("Cancel button clicked");
    closeDeleteModal();
  });

  // Fetch and Render Cards
  api
    .getCards()
    .then((cards) => {
      cards.forEach((card) => {
        const cardElement = getCardElement(card); // Create the card element
        addCard(cardElement); // Append the card to the DOM
      });
    })
    .catch((error) => {
      console.error("Error fetching cards:", error);
    });
});

// Export necessary functions, variables, or classes
export { handleEditFormSubmit, handleAddCardSubmit };
