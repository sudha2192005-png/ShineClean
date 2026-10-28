
"use strict";

// ==========================================
// 1. SHINECLEAN SERVICE PRICES
// ==========================================

const servicePrices = {
    "Home Cleaning": 799,
    "Deep Cleaning": 1499,
    "Kitchen Cleaning": 599,
    "Bathroom Cleaning": 399,
    "Sofa Cleaning": 499
};

const EXTRA_ROOM_PRICE = 150;
const BOOKINGS_KEY = "shineCleanBookings";
const CURRENT_BOOKING_KEY = "shineCleanBooking";

// ==========================================
// 2. COMMON HELPER FUNCTIONS
// ==========================================

function getElement(id) {
    return document.getElementById(id);
}

function getSavedBookings() {
    try {
        const data = JSON.parse(
            localStorage.getItem(BOOKINGS_KEY) || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error reading bookings:", error);
        return [];
    }
}

function getCurrentBooking() {
    try {
        return JSON.parse(
            localStorage.getItem(CURRENT_BOOKING_KEY) || "{}"
        );
    } catch (error) {
        console.error("Error reading current booking:", error);
        return {};
    }
}

function saveCurrentBooking(booking) {
    localStorage.setItem(
        CURRENT_BOOKING_KEY,
        JSON.stringify(booking)
    );
}

function getLocalToday() {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}

function formatPrice(amount) {
    return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

function goToPage(page) {
    window.location.href = page;
}

function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value ?? "";
    }
}

// ==========================================
// 3. PRICE CALCULATION
// ==========================================

function calculatePrice(service, rooms) {
    const basePrice = servicePrices[service] || 0;
    const roomCount = Math.max(1, Number(rooms) || 1);

    const extraPrice =
        Math.max(0, roomCount - 1) * EXTRA_ROOM_PRICE;

    return {
        basePrice,
        extraPrice,
        totalPrice: basePrice + extraPrice
    };
}

// ==========================================
// 4. SELECT SERVICE PAGE
// select-service.html
// ==========================================

function initServicePage() {
    const cards = document.querySelectorAll(".service-card");

    if (!cards.length) return;

    cards.forEach(card => {
        const button = card.querySelector(".select-btn");

        if (!button) return;

        const serviceName =
            button.dataset.service || card.dataset.service;

        button.addEventListener("click", () => {
            if (!servicePrices[serviceName]) {
                alert("Please select a valid cleaning service.");
                return;
            }

            // Start a fresh booking.
            saveCurrentBooking({
                service: serviceName,
                rooms: 1,
                basePrice: servicePrices[serviceName]
            });

            goToPage("booking-form.html");
        });
    });
}

// ==========================================
// 5. BOOKING FORM PAGE
// booking-form.html
// ==========================================

function initBookingForm() {
    const form = getElement("bookingForm");

    if (!form) return;

    const serviceSelect = getElement("service");
    const roomsSelect = getElement("rooms");
    const dateInput = getElement("bookingDate");
    const message = getElement("formMessage");

    const today = getLocalToday();

    if (dateInput) {
        dateInput.min = today;
    }

    const currentBooking = getCurrentBooking();

    if (serviceSelect && servicePrices[currentBooking.service]) {
        serviceSelect.value = currentBooking.service;
    }

    if (roomsSelect && currentBooking.rooms) {
        roomsSelect.value = String(currentBooking.rooms);
    }

    function updatePrice() {
        const prices = calculatePrice(
            serviceSelect?.value || "",
            roomsSelect?.value || 1
        );

        setText("basePrice", formatPrice(prices.basePrice));
        setText("extraPrice", formatPrice(prices.extraPrice));
        setText("totalPrice", formatPrice(prices.totalPrice));

        return prices;
    }

    serviceSelect?.addEventListener("change", updatePrice);
    roomsSelect?.addEventListener("change", updatePrice);

    form.addEventListener("input", () => {
        if (message) message.textContent = "";
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (message) message.textContent = "";

        if (!servicePrices[serviceSelect?.value]) {
            if (message) {
                message.textContent =
                    "Please select a cleaning service.";
            }
            return;
        }

        if (!dateInput?.value || dateInput.value < today) {
            if (message) {
                message.textContent =
                    "Please select today or a future date.";
            }
            return;
        }

        const phone = getElement("phone")?.value.trim() || "";

        if (!/^[6-9]\d{9}$/.test(phone)) {
            if (message) {
                message.textContent =
                    "Enter a valid 10-digit Indian mobile number.";
            }
            return;
        }

        const customerName =
            getElement("customerName")?.value.trim() || "";

        const address =
            getElement("address")?.value.trim() || "";

        const timeSlot =
            getElement("timeSlot")?.value || "";

        if (!customerName || !address || !timeSlot) {
            if (message) {
                message.textContent =
                    "Please complete all required fields.";
            }
            return;
        }

        const prices = updatePrice();

        const booking = {
            ...getCurrentBooking(),
            service: serviceSelect.value,
            rooms: Number(roomsSelect?.value || 1),
            homeSize: getElement("homeSize")?.value || "",
            date: dateInput.value,
            timeSlot,
            customerName,
            phone,
            address,
            instructions:
                getElement("instructions")?.value.trim() || "",
            ...prices
        };

        saveCurrentBooking(booking);
        goToPage("booking-price.html");
    });

    updatePrice();
}

// ==========================================
// 6. PRICE SUMMARY PAGE
// booking-price.html
// ==========================================

function initPricePage() {
    const continueButton = getElement("continueBooking");

    if (!continueButton) return;

    const booking = getCurrentBooking();

    if (!servicePrices[booking.service]) {
        alert("Please select a service first.");
        goToPage("select-service.html");
        return;
    }

    const prices = calculatePrice(
        booking.service,
        booking.rooms
    );

    setText("priceService", booking.service);
    setText("priceRooms", String(booking.rooms || 1));
    setText("priceBase", formatPrice(prices.basePrice));
    setText("priceExtra", formatPrice(prices.extraPrice));
    setText("priceTotal", formatPrice(prices.totalPrice));

    setText("priceHomeSize", booking.homeSize || "Not specified");
    setText("priceDate", booking.date || "Not specified");
    setText("priceTime", booking.timeSlot || "Not specified");
    setText("priceAddress", booking.address || "Not specified");

    continueButton.addEventListener("click", () => {
        saveCurrentBooking({
            ...booking,
            ...prices
        });

        goToPage("booking-confirmation.html");
    });

    getElement("editBooking")?.addEventListener("click", () => {
        goToPage("booking-form.html");
    });
}

// ==========================================
// 7. BOOKING CONFIRMATION PAGE
// booking-confirmation.html
// ==========================================

function initConfirmationPage() {
    const confirmation = getElement("confirmation");

    if (!confirmation) return;

    const confirmButton = getElement("confirmBooking");
    const booking = getCurrentBooking();

    if (!servicePrices[booking.service]) {
        alert("Please select a service before confirming.");
        goToPage("select-service.html");
        return;
    }

    function showBookingDetails(savedBooking) {
        setText("bookingId", savedBooking.bookingId);
        setText("confirmedService", savedBooking.service);

        setText(
            "confirmedDate",
            `${savedBooking.date || "Not specified"} | ${
                savedBooking.timeSlot || "Not specified"
            }`
        );

        setText(
            "confirmedPrice",
            formatPrice(savedBooking.totalPrice)
        );

        setText(
            "confirmedName",
            savedBooking.customerName || ""
        );

        setText(
            "confirmedAddress",
            savedBooking.address || ""
        );

        setText(
            "confirmedStatus",
            savedBooking.status || "Confirmed"
        );

        confirmation.classList.remove("hidden");
    }

    // Do not create a duplicate if this booking was already confirmed.
    if (booking.bookingId) {
        showBookingDetails(booking);

        if (confirmButton) {
            confirmButton.textContent = "View My Bookings";

            confirmButton.addEventListener("click", () => {
                goToPage("my-bookings.html");
            });
        }

        return;
    }

    if (!confirmButton) {
        console.error('Missing button: id="confirmBooking"');
        return;
    }

    confirmButton.addEventListener("click", () => {
        confirmButton.disabled = true;

        try {
            const bookings = getSavedBookings();
            const prices = calculatePrice(
                booking.service,
                booking.rooms
            );

            const confirmedBooking = {
                ...booking,
                ...prices,
                bookingId: "SC" + Date.now(),
                status: "Confirmed",
                createdAt: new Date().toISOString()
            };

            bookings.push(confirmedBooking);

            localStorage.setItem(
                BOOKINGS_KEY,
                JSON.stringify(bookings)
            );

            saveCurrentBooking(confirmedBooking);

            showBookingDetails(confirmedBooking);
            confirmButton.textContent = "Booking Confirmed!";

            window.setTimeout(() => {
                goToPage("my-bookings.html");
            }, 700);

        } catch (error) {
            console.error("Unable to save booking:", error);

            alert("Unable to save booking. Please try again.");
            confirmButton.disabled = false;
        }
    });
}

// ==========================================
// 8. NEW BOOKING BUTTON
// ==========================================

function initNewBookingButton() {
    const button = getElement("newBooking");

    if (!button) return;

    button.addEventListener("click", () => {
        localStorage.removeItem(CURRENT_BOOKING_KEY);
        goToPage("select-service.html");
    });
}

// ==========================================
// 9. MY BOOKINGS PAGE
// my-bookings.html
// ==========================================

function initMyBookingsPage() {
    const bookingsList = getElement("myBookingsList");

    if (!bookingsList) return;

    const countElement = getElement("bookingCount");
    const emptyMessage = getElement("noBookingsMessage");

    const bookings = getSavedBookings();

    bookingsList.replaceChildren();

    if (countElement) {
        countElement.textContent = bookings.length;
    }

    if (bookings.length === 0) {
        emptyMessage?.classList.remove("hidden");
        return;
    }

    emptyMessage?.classList.add("hidden");

    bookings.forEach(booking => {
        const card = document.createElement("article");
        card.className = "my-booking-card";

        const top = document.createElement("div");
        top.className = "booking-card-top";

        const titleArea = document.createElement("div");

        const serviceTitle = document.createElement("h3");
        serviceTitle.textContent =
            booking.service || "Cleaning Service";

        const bookingId = document.createElement("p");
        bookingId.className = "booking-card-id";
        bookingId.textContent =
            "Booking ID: " + (booking.bookingId || "N/A");

        titleArea.append(serviceTitle, bookingId);

        const status = document.createElement("span");
        status.className = "booking-status-badge";
        status.textContent = booking.status || "Confirmed";

        top.append(titleArea, status);
        card.appendChild(top);

        function addDetail(label, value) {
            const row = document.createElement("div");
            row.className = "booking-card-detail";

            const labelElement = document.createElement("span");
            labelElement.textContent = label;

            const valueElement = document.createElement("strong");
            valueElement.textContent =
                value === undefined || value === null || value === ""
                    ? "Not specified"
                    : String(value);

            row.append(labelElement, valueElement);
            card.appendChild(row);
        }

        addDetail("Booking Date", booking.date);
        addDetail("Time", booking.timeSlot);
        addDetail("Customer", booking.customerName);
        addDetail("Total Price", formatPrice(booking.totalPrice));

        const trackLink = document.createElement("a");

        trackLink.className = "member2-primary-btn";
        trackLink.href =
            "track-service.html?bookingId=" +
            encodeURIComponent(booking.bookingId || "");

        trackLink.textContent = "Track Service";

        card.appendChild(trackLink);
        bookingsList.appendChild(card);
    });
}

// ==========================================
// 10. TRACK SERVICE PAGE
// track-service.html
// ==========================================

function initTrackServicePage() {
    const trackingDetails = getElement("trackingDetails");

    if (!trackingDetails) return;

    const emptyMessage = getElement("trackingEmpty");

    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId");

    const bookings = getSavedBookings();

    const booking = bookings.find(item =>
        item.bookingId === bookingId
    );

    if (!booking) {
        emptyMessage?.classList.remove("hidden");
        trackingDetails.classList.add("hidden");
        return;
    }

    emptyMessage?.classList.add("hidden");
    trackingDetails.classList.remove("hidden");

    setText("trackBookingId", booking.bookingId);
    setText("trackServiceName", booking.service);
    setText("trackDate", booking.date);
    setText("trackTime", booking.timeSlot);
    setText("trackCustomer", booking.customerName);

    const status = booking.status || "Confirmed";

    setText("trackStatus", status);

    const statusSteps = {
        "Confirmed": 1,
        "Staff Assigned": 2,
        "Cleaning Started": 3,
        "Completed": 4
    };

    const currentStep = statusSteps[status] || 1;
    const progressFill = getElement("progressFill");

    if (progressFill) {
        progressFill.style.width =
            ((currentStep - 1) / 3 * 100) + "%";
    }

    document.querySelectorAll(".progress-step").forEach(step => {
        const stepNumber = Number(step.dataset.step);

        step.classList.toggle(
            "completed",
            stepNumber <= currentStep
        );
    });

    const progressMessages = {
        "Confirmed":
            "Your booking is confirmed. Staff assignment is pending.",
        "Staff Assigned":
            "A cleaning staff member has been assigned.",
        "Cleaning Started":
            "Your cleaning service has started.",
        "Completed":
            "Your cleaning service has been completed."
    };

    setText(
        "trackProgressMessage",
        progressMessages[status] ||
            "Your booking is confirmed. More updates will appear here."
    );

    setText(
        "trackStaffInfo",
        booking.staffName
            ? "Assigned staff: " + booking.staffName
            : status === "Confirmed"
                ? "Staff assignment is pending."
                : "Staff details have not been added yet."
    );
}

// ==========================================
// 11. NOTIFICATIONS PAGE
// notifications.html
// ==========================================

function initNotificationsPage() {
    const list = getElement("notificationsList");

    // Run only on the Notifications page.
    if (!list) return;

    const emptyMessage = getElement("noNotifications");
    const countElement = getElement("notificationCount");

    list.replaceChildren();

    const bookings = getSavedBookings();
    const notificationItems = [];

    const statusUpdates = {
        "Confirmed": {
            title: "Booking Confirmed",
            message: "Your cleaning booking has been confirmed successfully.",
            step: 1
        },
        "Staff Assigned": {
            title: "Staff Assigned",
            message: "A cleaning staff member has been assigned to your booking.",
            step: 2
        },
        "Cleaning Started": {
            title: "Cleaning Service Started",
            message: "Your cleaning service has started.",
            step: 3
        },
        "Completed": {
            title: "Service Completed",
            message: "Your cleaning service has been completed.",
            step: 4
        }
    };

    bookings.forEach(booking => {
        const status = booking.status || "Confirmed";
        const currentUpdate = statusUpdates[status];

        // Add booking confirmation notification.
        notificationItems.push({
            title: "Booking Confirmed",
            message:
                `${booking.service || "Cleaning service"} booking confirmed.`,
            bookingId: booking.bookingId,
            createdAt: booking.createdAt || "",
            step: 1
        });

        // Add the current progress notification when status advances.
        if (currentUpdate && currentUpdate.step > 1) {
            notificationItems.push({
                title: currentUpdate.title,
                message: currentUpdate.message,
                bookingId: booking.bookingId,
                createdAt:
                    booking.updatedAt || booking.createdAt || "",
                step: currentUpdate.step
            });
        }
    });

    // Sort by timestamp, newest first.
    notificationItems.sort((a, b) => {
        return new Date(b.createdAt || 0) -
               new Date(a.createdAt || 0);
    });

    if (countElement) {
        countElement.textContent = notificationItems.length;
    }

    if (notificationItems.length === 0) {
        emptyMessage?.classList.remove("hidden");
        return;
    }

    emptyMessage?.classList.add("hidden");

    notificationItems.forEach(item => {
        const card = document.createElement("article");
        card.className = "notification-card";

        const icon = document.createElement("div");
        icon.className = "notification-icon";
        icon.textContent = item.step === 4 ? "✓" : String(item.step);

        const content = document.createElement("div");
        content.className = "notification-content";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const message = document.createElement("p");
        message.textContent = item.message;

        const bookingId = document.createElement("span");
        bookingId.className = "notification-booking-id";
        bookingId.textContent =
            "Booking ID: " + (item.bookingId || "N/A");

        const meta = document.createElement("p");
        meta.className = "notification-meta";

        if (item.createdAt) {
            const date = new Date(item.createdAt);

            meta.textContent = Number.isNaN(date.getTime())
                ? "Booking update"
                : date.toLocaleString();
        } else {
            meta.textContent = "Booking update";
        }

        content.append(title, message, bookingId, meta);
        card.append(icon, content);
        list.appendChild(card);
    });
}

// ==========================================
// 12. START PAGE FUNCTIONS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initServicePage();
    initBookingForm();
    initPricePage();
    initConfirmationPage();
    initNewBookingButton();
    initMyBookingsPage();
    initTrackServicePage();
    initNotificationsPage();
});
