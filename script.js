document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".site-header nav");

    if (menuButton && navbar) {
        menuButton.addEventListener("click", function () {
            navbar.classList.toggle("show-menu");
        });
    }

    const navLinks = document.querySelectorAll(".site-header nav a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(function (link) {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    const loginButton = document.querySelector(".login-toggle");
    const loginDropdown = document.querySelector(".login-dropdown");

    if (loginButton && loginDropdown) {
        loginButton.addEventListener("click", function (event) {
            event.preventDefault();
            loginDropdown.classList.toggle("show-dropdown");
        });

        document.addEventListener("click", function (event) {
            if (
                !loginButton.contains(event.target) &&
                !loginDropdown.contains(event.target)
            ) {
                loginDropdown.classList.remove("show-dropdown");
            }
        });
    }

    const forms = document.querySelectorAll("form");

    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            const inputs = form.querySelectorAll(
                "input[required], textarea[required], select[required]"
            );

            let isValid = true;

            inputs.forEach(function (input) {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.border = "1px solid red";
                } else {
                    input.style.border = "";
                }

                if (
                    input.type === "email" &&
                    input.value.trim() &&
                    !input.checkValidity()
                ) {
                    isValid = false;
                    input.style.border = "1px solid red";
                }
            });

            if (!isValid) {
                event.preventDefault();
                alert("Please fill all required fields correctly.");
            }
        });
    });

    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirmPassword");

    if (password && confirmPassword) {
        confirmPassword.addEventListener("input", function () {
            if (password.value !== confirmPassword.value) {
                confirmPassword.setCustomValidity("Passwords do not match.");
            } else {
                confirmPassword.setCustomValidity("");
            }
        });
    }

    document.querySelectorAll(".book-now").forEach(function (button) {
        button.addEventListener("click", function () {
            window.location.href = "booking.html";
        });
    });

    const backToTop = document.querySelector("#backToTop");

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});

/* Safety page mobile navigation */
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.getElementById("safetyMenuToggle");
    const navigation = document.getElementById("safetyNav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("is-open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.innerHTML = isOpen
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const compareButton = document.getElementById("comparePhotosBtn");
    const compareResult = document.getElementById("compareResult");

    if (compareButton && compareResult) {
        compareButton.addEventListener("click", function () {
            compareResult.textContent =
                "Sample photos displayed for visual review. " +
                "Automatic image comparison is not enabled yet.";
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("photoUploadForm");
    if (!form) return;

    const roleInput = document.getElementById("uploaderRole");
    const bookingInput = document.getElementById("bookingId");
    const beforeInput = document.getElementById("beforePhoto");
    const afterInput = document.getElementById("afterPhoto");
    const beforePreview = document.getElementById("beforePreview");
    const afterPreview = document.getElementById("afterPreview");
    const message = document.getElementById("photoMessage");
    const records = document.getElementById("photoRecords");

    let beforeURL = "";
    let afterURL = "";

    function showPreview(input, preview, imageType) {
        const file = input.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            message.textContent = "Please select a valid image.";
            input.value = "";
            return;
        }

        if (imageType === "before" && beforeURL) {
            URL.revokeObjectURL(beforeURL);
        }

        if (imageType === "after" && afterURL) {
            URL.revokeObjectURL(afterURL);
        }

        const imageURL = URL.createObjectURL(file);

        if (imageType === "before") {
            beforeURL = imageURL;
        } else {
            afterURL = imageURL;
        }

        preview.src = imageURL;
        preview.hidden = false;
        message.textContent = "";
    }

    beforeInput.addEventListener("change", function () {
        showPreview(beforeInput, beforePreview, "before");
    });

    afterInput.addEventListener("change", function () {
        showPreview(afterInput, afterPreview, "after");
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const role = roleInput.value;
        const bookingId = bookingInput.value.trim();
        const beforeFile = beforeInput.files[0];
        const afterFile = afterInput.files[0];

        if (!role || !bookingId || !beforeFile || !afterFile) {
            message.textContent = "Please select your role and both photos.";
            return;
        }

        if (
            !beforeFile.type.startsWith("image/") ||
            !afterFile.type.startsWith("image/")
        ) {
            message.textContent = "Please upload valid image files.";
            return;
        }

        const record = document.createElement("article");
        record.className = "photo-record";

        const title = document.createElement("h3");
        title.textContent = "Booking ID: " + bookingId;

        const uploader = document.createElement("p");
        uploader.textContent = "Uploaded by: " + role;

        const photoGrid = document.createElement("div");
        photoGrid.className = "record-photo-grid";

        function createPhotoColumn(label, url) {
            const column = document.createElement("div");
            const heading = document.createElement("h3");
            const image = document.createElement("img");

            heading.textContent = label;
            image.src = url;
            image.alt = label + " cleaning photo";

            column.append(heading, image);
            return column;
        }

        photoGrid.append(
            createPhotoColumn("Before Cleaning", beforeURL),
            createPhotoColumn("After Cleaning", afterURL)
        );

        record.append(title, uploader, photoGrid);
        records.prepend(record);

        message.textContent = "Photos added to the page successfully!";

        form.reset();
        beforePreview.hidden = true;
        afterPreview.hidden = true;
        beforePreview.removeAttribute("src");
        afterPreview.removeAttribute("src");

        beforeURL = "";
        afterURL = "";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const inventoryForm = document.getElementById("inventoryForm");
    if (!inventoryForm) return;

    const itemName = document.getElementById("itemName");
    const itemRoom = document.getElementById("itemRoom");
    const itemQuantity = document.getElementById("itemQuantity");
    const itemStatus = document.getElementById("itemStatus");
    const itemNotes = document.getElementById("itemNotes");
    const itemPhoto = document.getElementById("itemPhoto");
    const itemPhotoPreview = document.getElementById("itemPhotoPreview");
    const inventoryMessage = document.getElementById("inventoryMessage");
    const inventoryList = document.getElementById("inventoryList");
    const inventoryCount = document.getElementById("inventoryCount");

    let inventoryItems = [];
    let selectedPhoto = "";

    itemPhoto.addEventListener("change", function () {
        const file = itemPhoto.files[0];

        selectedPhoto = "";
        itemPhotoPreview.hidden = true;
        itemPhotoPreview.removeAttribute("src");

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            inventoryMessage.textContent = "Please select an image file.";
            itemPhoto.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            inventoryMessage.textContent = "Image size must be 5 MB or less.";
            itemPhoto.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            selectedPhoto = reader.result;
            itemPhotoPreview.src = selectedPhoto;
            itemPhotoPreview.hidden = false;
            inventoryMessage.textContent = "";
        };

        reader.onerror = function () {
            inventoryMessage.textContent = "Could not read this image. Please try again.";
        };

        reader.readAsDataURL(file);
    });

    inventoryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = itemName.value.trim();
        const room = itemRoom.value;
        const quantity = Number(itemQuantity.value);
        const condition = itemStatus.value;

        if (
            !name ||
            !room ||
            !condition ||
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            inventoryMessage.textContent =
                "Please complete all required fields correctly.";
            return;
        }

        inventoryItems.push({
            id: Date.now() + Math.random(),
            name,
            room,
            quantity,
            condition,
            notes: itemNotes.value.trim(),
            photo: selectedPhoto,
            afterStatus: "Not checked"
        });

        renderInventory();

        inventoryMessage.textContent = "Item added to your checklist successfully.";
        inventoryForm.reset();
        selectedPhoto = "";
        itemPhotoPreview.hidden = true;
        itemPhotoPreview.removeAttribute("src");
    });

    function renderInventory() {
        inventoryList.replaceChildren();

        inventoryCount.textContent =
            inventoryItems.length +
            (inventoryItems.length === 1 ? " item" : " items");

        if (inventoryItems.length === 0) {
            const emptyBox = document.createElement("div");
            emptyBox.className = "inventory-empty";

            const heading = document.createElement("h3");
            heading.textContent = "No items added yet";

            const description = document.createElement("p");
            description.textContent = "Add your first item using the form above.";

            emptyBox.append(heading, description);
            inventoryList.appendChild(emptyBox);
            return;
        }

        inventoryItems.forEach(function (item) {
            const card = document.createElement("article");
            card.className = "inventory-item-card";

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const roomText = document.createElement("p");
            roomText.textContent = "Room: " + item.room;

            const quantityText = document.createElement("p");
            quantityText.textContent = "Quantity: " + item.quantity;

            const conditionText = document.createElement("p");
            conditionText.textContent =
                "Condition before cleaning: " + item.condition;

            card.append(heading, roomText, quantityText, conditionText);

            if (item.notes) {
                const notesText = document.createElement("p");
                notesText.textContent = "Notes: " + item.notes;
                card.appendChild(notesText);
            }

            if (item.photo) {
                const photo = document.createElement("img");
                photo.src = item.photo;
                photo.alt = "Photo of " + item.name;
                card.appendChild(photo);
            }

            const statusLabel = document.createElement("label");
            statusLabel.textContent = "Condition after cleaning";

            const statusSelect = document.createElement("select");
            statusSelect.setAttribute(
                "aria-label",
                "Condition after cleaning for " + item.name
            );

            [
                "Not checked",
                "Same condition",
                "Changed condition",
                "Unable to verify"
            ].forEach(function (status) {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;
                statusSelect.appendChild(option);
            });

            statusSelect.value = item.afterStatus;

            const statusBadge = document.createElement("span");
            statusBadge.className = "inventory-status";
            statusBadge.textContent = "After cleaning: " + item.afterStatus;

            statusSelect.addEventListener("change", function () {
                item.afterStatus = statusSelect.value;
                statusBadge.textContent = "After cleaning: " + item.afterStatus;
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "inventory-delete-btn";
            deleteButton.textContent = "Delete Item";

            deleteButton.addEventListener("click", function () {
                inventoryItems = inventoryItems.filter(function (savedItem) {
                    return savedItem.id !== item.id;
                });

                renderInventory();
                inventoryMessage.textContent = "Item removed from the checklist.";
            });

            card.append(
                statusLabel,
                statusSelect,
                document.createElement("br"),
                statusBadge,
                document.createElement("br"),
                deleteButton
            );

            inventoryList.appendChild(card);
        });
    }

    renderInventory();
});
document.addEventListener("DOMContentLoaded", function () {
    const bookingForm = document.getElementById("cvBookingForm");
    if (!bookingForm) return;

    const bookingInput = document.getElementById("cvBookingId");
    const bookingMessage = document.getElementById("cvBookingMessage");

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const bookingId = bookingInput.value.trim();

        if (!bookingId) {
            bookingMessage.textContent = "Please enter your booking ID.";
            return;
        }

        bookingMessage.textContent =
            "Booking ID entered: " + bookingId +
            ". Cleaner details will appear after your booking is connected to the backend.";

        bookingMessage.setAttribute("role", "status");
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const complaintForm = document.getElementById("complaintForm");
    if (!complaintForm) return;

    const bookingInput = document.getElementById("complaintBookingId");
    const categoryInput = document.getElementById("complaintCategory");
    const subjectInput = document.getElementById("complaintSubject");
    const descriptionInput = document.getElementById("complaintDescription");
    const photoInput = document.getElementById("complaintPhoto");
    const photoPreview = document.getElementById("complaintPhotoPreview");
    const message = document.getElementById("complaintMessage");
    const complaintList = document.getElementById("complaintList");
    const complaintCount = document.getElementById("complaintCount");

    let complaints = [];
    let selectedPhoto = "";

    photoInput.addEventListener("change", function () {
        const file = photoInput.files[0];

        selectedPhoto = "";
        photoPreview.hidden = true;
        photoPreview.removeAttribute("src");

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            message.textContent = "Please select a valid image file.";
            photoInput.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.textContent = "Image size must be 5 MB or less.";
            photoInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = function () {
            selectedPhoto = reader.result;
            photoPreview.src = selectedPhoto;
            photoPreview.hidden = false;
            message.textContent = "";
        };

        reader.onerror = function () {
            message.textContent = "Unable to read the image. Please try again.";
        };

        reader.readAsDataURL(file);
    });

    complaintForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const bookingId = bookingInput.value.trim();
        const category = categoryInput.value;
        const subject = subjectInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!bookingId || !category || !subject || !description) {
            message.textContent = "Please fill in all required fields.";
            return;
        }

        const complaint = {
            id: "CMP-" + Date.now(),
            bookingId,
            category,
            subject,
            description,
            photo: selectedPhoto,
            status: "Submitted",
            date: new Date().toLocaleString()
        };

        complaints.unshift(complaint);
        renderComplaints();

        message.textContent =
            "Demo complaint submitted successfully. Reference: " + complaint.id;

        complaintForm.reset();
        selectedPhoto = "";
        photoPreview.hidden = true;
        photoPreview.removeAttribute("src");
    });

    function renderComplaints() {
        complaintList.replaceChildren();

        complaintCount.textContent =
            complaints.length +
            (complaints.length === 1 ? " complaint" : " complaints");

        if (complaints.length === 0) {
            const emptyBox = document.createElement("div");
            emptyBox.className = "complaints-empty";

            const heading = document.createElement("h3");
            heading.textContent = "No complaints submitted";

            const description = document.createElement("p");
            description.textContent = "Your submitted complaints will appear here.";

            emptyBox.append(heading, description);
            complaintList.appendChild(emptyBox);
            return;
        }

        complaints.forEach(function (complaint) {
            const card = document.createElement("article");
            card.className = "complaint-item-card";

            const heading = document.createElement("h3");
            heading.textContent = complaint.subject;

            const reference = document.createElement("p");
            reference.textContent = "Reference: " + complaint.id;

            const booking = document.createElement("p");
            booking.textContent = "Booking ID: " + complaint.bookingId;

            const category = document.createElement("p");
            category.textContent = "Category: " + complaint.category;

            const description = document.createElement("p");
            description.textContent = "Details: " + complaint.description;

            const date = document.createElement("p");
            date.textContent = "Submitted: " + complaint.date;

            const status = document.createElement("span");
            status.className = "complaint-status";
            status.textContent = "Status: " + complaint.status;

            card.append(
                heading,
                reference,
                booking,
                category,
                description,
                date,
                status
            );

            if (complaint.photo) {
                const photo = document.createElement("img");
                photo.src = complaint.photo;
                photo.alt = "Supporting photo for complaint";
                card.appendChild(photo);
            }

            complaintList.appendChild(card);
        });
    }

    renderComplaints();
});
document.addEventListener("DOMContentLoaded", function () {
    const supportForm = document.getElementById("supportForm");
    if (!supportForm) return;

    const bookingInput = document.getElementById("supportBookingId");
    const categoryInput = document.getElementById("supportCategory");
    const subjectInput = document.getElementById("supportSubject");
    const descriptionInput = document.getElementById("supportDescription");
    const message = document.getElementById("supportMessage");
    const requestList = document.getElementById("supportRequestList");
    const requestCount = document.getElementById("supportCount");

    let supportRequests = [];

    supportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const bookingId = bookingInput.value.trim();
        const category = categoryInput.value;
        const subject = subjectInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!category || !subject || !description) {
            message.textContent = "Please complete all required fields.";
            return;
        }

        const request = {
            id: "SUP-" + Date.now(),
            bookingId: bookingId || "Not provided",
            category,
            subject,
            description,
            date: new Date().toLocaleString(),
            status: "Submitted"
        };

        supportRequests.unshift(request);
        renderSupportRequests();

        message.textContent =
            "Demo request submitted! Reference ID: " + request.id +
            ". It has not been sent to a real support team.";

        supportForm.reset();
    });

    function renderSupportRequests() {
        requestList.replaceChildren();

        requestCount.textContent =
            supportRequests.length +
            (supportRequests.length === 1 ? " request" : " requests");

        if (supportRequests.length === 0) {
            const emptyBox = document.createElement("div");
            emptyBox.className = "support-empty";

            const heading = document.createElement("h3");
            heading.textContent = "No support requests yet";

            const description = document.createElement("p");
            description.textContent = "Your submitted requests will appear here.";

            emptyBox.append(heading, description);
            requestList.appendChild(emptyBox);
            return;
        }

        supportRequests.forEach(function (request) {
            const card = document.createElement("article");
            card.className = "support-request-card";

            const heading = document.createElement("h3");
            heading.textContent = request.subject;

            const reference = document.createElement("p");
            reference.textContent = "Reference ID: " + request.id;

            const booking = document.createElement("p");
            booking.textContent = "Booking ID: " + request.bookingId;

            const category = document.createElement("p");
            category.textContent = "Category: " + request.category;

            const description = document.createElement("p");
            description.textContent = "Details: " + request.description;

            const date = document.createElement("p");
            date.textContent = "Submitted: " + request.date;

            const status = document.createElement("span");
            status.className = "support-request-status";
            status.textContent = "Status: " + request.status;

            card.append(
                heading,
                reference,
                booking,
                category,
                description,
                date,
                status
            );

            requestList.appendChild(card);
        });
    }

    renderSupportRequests();
});
