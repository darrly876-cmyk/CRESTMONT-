/* =========================================================
   CRESTMONT DIGITAL ASSETS
   MAIN WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE HOMEPAGE MENU
       ===================================================== */

    const menuButton = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (menuButton && mainNav) {

        menuButton.addEventListener("click", function () {

            mainNav.classList.toggle("mobile-nav-open");

            const isOpen =
                mainNav.classList.contains("mobile-nav-open");

            menuButton.textContent = isOpen ? "✕" : "☰";

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });

        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                mainNav.classList.remove("mobile-nav-open");

                menuButton.textContent = "☰";

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });
    }


    /* =====================================================
       SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    /* =====================================================
       FAQ ACCORDION
       ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {

        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        if (!question || !answer) {
            return;
        }

        question.addEventListener("click", function () {

            const alreadyOpen =
                item.classList.contains("active");

            faqItems.forEach(function (otherItem) {

                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

            });

            if (!alreadyOpen) {

                item.classList.add("active");

                answer.style.maxHeight =
                    answer.scrollHeight + "px";
            }

        });

    });


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    if (header) {

        function updateHeader() {

            if (window.scrollY > 20) {
                header.classList.add("header-scrolled");
            } else {
                header.classList.remove("header-scrolled");
            }

        }

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        updateHeader();
    }


    /* =====================================================
       SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section, .how-card, .plan-card, .market-row, .faq-item, .support-card"
        );

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal-element"
                            );

                            requestAnimationFrame(function () {

                                entry.target.classList.add(
                                    "revealed"
                                );

                            });

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.08
                }
            );

        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       HOMEPAGE MARKET TABLE
       ===================================================== */

    const marketAssets = [
        "BTC",
        "ETH",
        "USDT",
        "BNB",
        "XRP",
        "SOL"
    ];

    function setMarketLoadingState() {

        marketAssets.forEach(function (symbol) {

            const priceElement =
                document.querySelector(
                    '[data-symbol="' + symbol + '"]'
                );

            const changeElement =
                document.querySelector(
                    '[data-change="' + symbol + '"]'
                );

            if (priceElement) {
                priceElement.textContent =
                    "Live data pending";
            }

            if (changeElement) {
                changeElement.textContent = "—";
            }

        });

    }

    setMarketLoadingState();


    /* =====================================================
       MARKET ROW HOVER
       ===================================================== */

    document.querySelectorAll(".market-row")
        .forEach(function (row) {

            row.addEventListener(
                "mouseenter",
                function () {
                    row.classList.add(
                        "market-row-active"
                    );
                }
            );

            row.addEventListener(
                "mouseleave",
                function () {
                    row.classList.remove(
                        "market-row-active"
                    );
                }
            );

        });


// ============================================
// REGISTRATION
// ============================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const firstName = document
            .getElementById("firstName")
            .value.trim();

        const middleName = document
            .getElementById("middleName")
            ?.value.trim() || "";

        const lastName = document
            .getElementById("lastName")
            .value.trim();

        const email = document
            .getElementById("email")
            .value.trim();

        const phone = document
            .getElementById("phone")
            .value.trim();

        const country = document
            .getElementById("country")
            .value.trim();

        const dateOfBirth = document
            .getElementById("dateOfBirth")
            .value;

        const password = document
            .getElementById("password")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        const referralCode = document
            .getElementById("referralCode")
            ?.value.trim() || "";

        const message = document.getElementById("registerMessage");

        if (!message) {
            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        // Basic password length check
        if (password.length < 8) {
            message.textContent =
                "Password must be at least 8 characters.";
            return;
        }

        // Make sure Supabase is connected
        if (!supabaseClient) {
            message.textContent =
                "Connection error. Please try again.";
            return;
        }

        message.textContent = "Creating your account...";

        try {
            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password,

                    options: {
                        data: {
                            first_name: firstName,
                            middle_name: middleName,
                            last_name: lastName,
                            phone: phone,
                            country: country,
                            date_of_birth: dateOfBirth,
                            referral_code: referralCode
                        }
                    }
                });

            if (error) {
                message.textContent = error.message;
                return;
            }

            if (data.session) {
                message.textContent =
                    "Account created successfully.";

                window.location.href = "dashboard.html";
            } else {
                message.textContent =
                    "Account created. Please check your email to confirm your account.";
            }

        } catch (error) {
            console.error("Registration error:", error);

            message.textContent =
                "Something went wrong. Please try again.";
        }
    });
}


 // ============================================
// SIGN IN
// ============================================

const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const message = document.getElementById("signinMessage");

        if (!emailInput || !passwordInput || !message) {
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            message.textContent =
                "Please enter your email and password.";
            return;
        }

        if (!supabaseClient) {
            message.textContent =
                "Connection error. Please try again.";
            return;
        }

        message.textContent = "Signing you in...";

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                message.textContent =
                    "Unable to sign in. Please check your email and password.";
                console.error("Sign in error:", error);
                return;
            }

            if (data.session) {
                message.textContent = "Sign in successful.";

                window.location.href = "dashboard.html";
            }

        } catch (error) {
            console.error("Sign in error:", error);

            message.textContent =
                "Something went wrong. Please try again.";
        }
    });
}


    /* =====================================================
       FORGOT PASSWORD
       ===================================================== */

    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const message =
                    document.getElementById(
                        "signinMessage"
                    );

                if (message) {

                    showAuthMessage(
                        message,
                        "Password recovery will be connected to the secure account system.",
                        "success"
                    );

                }

            }
        );

    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    const dashboardPage =
        document.querySelector(
            ".dashboard-page"
        );

    if (dashboardPage) {

        initializeDashboard();

    }


    /* =====================================================
       FOOTER YEAR
       ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );

    yearElements.forEach(function (element) {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       PREVENT EMPTY # LINKS FROM JUMPING
       ===================================================== */

    document.querySelectorAll(
        'a[href="#"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

            }
        );

    });


    console.log(
        "Crestmont Digital Assets website loaded."
    );

});


/* =========================================================
   AUTH MESSAGE HELPER
   ========================================================= */

function showAuthMessage(
    element,
    text,
    type
) {

    element.textContent = text;

    element.className =
        "auth-message show " + type;

}


/* =========================================================
   DASHBOARD INITIALIZATION
   ========================================================= */

function initializeDashboard() {

    /* =====================================================
       SIDEBAR MOBILE MENU
       ===================================================== */

    const menuButton =
        document.getElementById(
            "dashboardMenuBtn"
        );

    const sidebar =
        document.getElementById(
            "dashboardSidebar"
        );

    if (menuButton && sidebar) {

        menuButton.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }


    /* =====================================================
       CLOSE SIDEBAR AFTER NAVIGATION
       ===================================================== */

    document.querySelectorAll(
        ".dashboard-nav-link"
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (sidebar) {

                    sidebar.classList.remove(
                        "mobile-open"
                    );

                }

            }
        );

    });


    /* =====================================================
       NOTIFICATIONS
       ===================================================== */

    const notificationButton =
        document.getElementById(
            "notificationBtn"
        );

    const notificationPanel =
        document.getElementById(
            "notificationPanel"
        );

    const closeNotifications =
        document.getElementById(
            "closeNotifications"
        );

    if (
        notificationButton &&
        notificationPanel
    ) {

        notificationButton.addEventListener(
            "click",
            function () {

                notificationPanel.classList.toggle(
                    "open"
                );

                notificationPanel.setAttribute(
                    "aria-hidden",
                    notificationPanel.classList.contains(
                        "open"
                    )
                        ? "false"
                        : "true"
                );

            }
        );

    }

    if (
        closeNotifications &&
        notificationPanel
    ) {

        closeNotifications.addEventListener(
            "click",
            function () {

                notificationPanel.classList.remove(
                    "open"
                );

                notificationPanel.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );

    }


    /* =====================================================
       CURRENCY SWITCHER
       ===================================================== */

    const currencySwitcher =
        document.getElementById(
            "currencySwitcher"
        );

    if (currencySwitcher) {

        currencySwitcher.addEventListener(
            "change",
            function () {

                const currency =
                    currencySwitcher.value;

                updateDashboardCurrency(
                    currency
                );

            }
        );

    }


    /* =====================================================
       WITHDRAWAL REQUEST
       ===================================================== */

    const withdrawButton =
        document.getElementById(
            "withdrawButton"
        );

    if (withdrawButton) {

        withdrawButton.addEventListener(
            "click",
            function () {

                const asset =
                    document.getElementById(
                        "withdrawAsset"
                    );

                const amount =
                    document.getElementById(
                        "withdrawAmount"
                    );

                const network =
                    document.getElementById(
                        "withdrawNetwork"
                    );

                const wallet =
                    document.getElementById(
                        "walletAddress"
                    );

                const message =
                    document.getElementById(
                        "withdrawMessage"
                    );

                if (!message) {
                    return;
                }

                if (
                    !asset.value ||
                    !amount.value ||
                    !network.value ||
                    !wallet.value.trim()
                ) {

                    showAuthMessage(
                        message,
                        "Please complete all withdrawal fields.",
                        "error"
                    );

                    return;
                }

                showAuthMessage(
                    message,
                    "Withdrawal request is ready to be submitted to the secure backend.",
                    "success"
                );

                showDashboardToast(
                    "Withdrawal request prepared."
                );

            }
        );

    }


    /* =====================================================
       DEPOSIT ACTIONS
       ===================================================== */

    document.querySelectorAll(
        ".dashboard-action-card"
    ).forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const action =
                    button.getAttribute(
                        "data-action"
                    );

                if (
                    action === "crypto-deposit"
                ) {

                    showDashboardToast(
                        "Crypto deposit setup will be connected to the secure deposit system."
                    );

                }

                if (
                    action === "card-deposit"
                ) {

                    showDashboardToast(
                        "Card deposits will use a PCI-compliant payment processor."
                    );

                }

            }
        );

    });


// ============================================
// LOGOUT
// ============================================

const logoutButtons = document.querySelectorAll(
    '[data-action="logout"], .logout-button, #logoutButton, .dashboard-logout, #settingsLogoutButton'
);

logoutButtons.forEach(function (button) {
    button.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            const { error } =
                await supabaseClient.auth.signOut({
                    scope: "local"
                });

            if (error) {
                console.error("Logout error:", error);
                alert("Unable to log out. Please try again.");
                return;
            }

            window.location.href = "signin.html";

        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});


    /* =====================================================
       PROFILE BUTTON
       ===================================================== */

    const profileButton =
        document.getElementById(
            "profileButton"
        );

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const profileSection =
                    document.getElementById(
                        "profile"
                    );

                if (profileSection) {

                    profileSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }

}


/* =========================================================
   DASHBOARD CURRENCY DISPLAY
   ========================================================= */

function updateDashboardCurrency(
    currency
) {

    const symbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        JPY: "¥"
    };

    const symbol =
        symbols[currency] || "$";

    const balance =
        document.getElementById(
            "portfolioBalance"
        );

    const invested =
        document.getElementById(
            "totalInvested"
        );

    const available =
        document.getElementById(
            "availableBalance"
        );

    const withdrawal =
        document.getElementById(
            "withdrawAvailable"
        );

    /*
     * These remain zero until the real backend
     * provides the user's actual account values.
     */

    if (balance) {
        balance.textContent =
            symbol + "0.00";
    }

    if (invested) {
        invested.textContent =
            symbol + "0.00";
    }

    if (available) {
        available.textContent =
            symbol + "0.00";
    }

    if (withdrawal) {
        withdrawal.textContent =
            symbol + "0.00";
    }

}


/* =========================================================
   DASHBOARD TOAST
   ========================================================= */

function showDashboardToast(
    message
) {

    const toast =
        document.getElementById(
            "dashboardToast"
        );

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    window.clearTimeout(
        window.crestmontToastTimer
    );

    window.crestmontToastTimer =
        window.setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            4000
        );

}


/* =========================================================
   CRESTMONT DEPOSIT PAGE
   ========================================================= */

function initializeDepositPage() {

    const cryptoPanel = document.getElementById("cryptoDepositPanel");
    const cardPanel = document.getElementById("cardDepositPanel");

    const methodButtons = document.querySelectorAll(".deposit-method-card");

    const cryptoForm = document.getElementById("cryptoDepositForm");
    const cardForm = document.getElementById("cardDepositForm");

    const cryptoAsset = document.getElementById("cryptoAsset");
    const cryptoNetwork = document.getElementById("cryptoNetwork");

    const cryptoAddress = document.getElementById("cryptoDepositAddress");
    const copyAddressButton = document.getElementById("copyDepositAddress");

    const cryptoMessage = document.getElementById("cryptoDepositMessage");
    const cardMessage = document.getElementById("cardDepositMessage");


    /* ---------------------------------------------------------
       SWITCH DEPOSIT METHOD
       --------------------------------------------------------- */

    methodButtons.forEach(button => {

        button.addEventListener("click", () => {

            const method = button.dataset.depositMethod;

            methodButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");


            if (method === "crypto") {

                cryptoPanel?.classList.remove("hidden");
                cardPanel?.classList.add("hidden");

            }


            if (method === "card") {

                cardPanel?.classList.remove("hidden");
                cryptoPanel?.classList.add("hidden");

            }

        });

    });


    /* ---------------------------------------------------------
       CRYPTO ASSET / NETWORK
       --------------------------------------------------------- */

    function updateDepositAddress() {

        if (!cryptoAddress || !cryptoAsset || !cryptoNetwork) {
            return;
        }

        const asset = cryptoAsset.value;
        const network = cryptoNetwork.value;


        if (!asset || !network) {

            cryptoAddress.textContent =
                "Select an asset and network";

            return;

        }


        /*
         * No real wallet address is displayed here.
         *
         * A production wallet address must come from a
         * secure backend / wallet provider.
         */

        cryptoAddress.textContent =
            "Deposit address will be provided securely after wallet setup.";

    }


    cryptoAsset?.addEventListener(
        "change",
        updateDepositAddress
    );

    cryptoNetwork?.addEventListener(
        "change",
        updateDepositAddress
    );


    /* ---------------------------------------------------------
       COPY ADDRESS
       --------------------------------------------------------- */

    copyAddressButton?.addEventListener("click", async () => {

        const address = cryptoAddress?.textContent?.trim();


        if (!address) {
            return;
        }


        if (
            address.includes("Select an asset") ||
            address.includes("will be provided")
        ) {

            showDashboardToast(
                "A verified deposit address is not available yet."
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(address);

            showDashboardToast(
                "Deposit address copied."
            );

        } catch (error) {

            showDashboardToast(
                "Unable to copy the address."
            );

        }

    });


    /* ---------------------------------------------------------
       CRYPTO DEPOSIT FORM
       --------------------------------------------------------- */

    cryptoForm?.addEventListener("submit", event => {

        event.preventDefault();


        const asset = cryptoAsset?.value;
        const network = cryptoNetwork?.value;
        const amount = document.getElementById(
            "cryptoAmount"
        )?.value;


        if (!asset || !network || !amount) {

            if (cryptoMessage) {

                cryptoMessage.textContent =
                    "Please complete all required fields.";

            }

            return;

        }


        if (Number(amount) <= 0) {

            if (cryptoMessage) {

                cryptoMessage.textContent =
                    "Please enter a valid deposit amount.";

            }

            return;

        }


        if (cryptoMessage) {

            cryptoMessage.textContent =
                "Your deposit information is ready to be submitted. A secure backend and blockchain verification service are required to confirm the deposit.";

        }

    });


    /* ---------------------------------------------------------
       CARD DEPOSIT FORM
       --------------------------------------------------------- */

    cardForm?.addEventListener("submit", event => {

        event.preventDefault();


        const cardholderName =
            document.getElementById("cardholderName")?.value.trim();

        const cardNumber =
            document.getElementById("cardNumber")?.value.trim();

        const expiryMonth =
            document.getElementById("cardExpiryMonth")?.value;

        const expiryYear =
            document.getElementById("cardExpiryYear")?.value;

        const cvv =
            document.getElementById("cardCvv")?.value.trim();

        const amount =
            document.getElementById("cardDepositAmount")?.value;


        if (
            !cardholderName ||
            !cardNumber ||
            !expiryMonth ||
            !expiryYear ||
            !cvv ||
            !amount
        ) {

            if (cardMessage) {

                cardMessage.textContent =
                    "Please complete all required card fields.";

            }

            return;

        }


        if (Number(amount) <= 0) {

            if (cardMessage) {

                cardMessage.textContent =
                    "Please enter a valid deposit amount.";

            }

            return;

        }


        if (cardMessage) {

            cardMessage.textContent =
                "Secure card processing will be connected through a PCI-compliant payment provider. No card or CVV information is stored by this page.";

        }

    });


    /* ---------------------------------------------------------
       LOGOUT
       --------------------------------------------------------- */

    const logoutButton =
        document.getElementById("logoutButton");

    logoutButton?.addEventListener("click", () => {

        window.location.href = "signin.html";

    });

}


/* Run Deposit Page */

if (document.querySelector(".deposit-panel")) {

    initializeDepositPage();

}

/* =========================================================
   CRESTMONT WITHDRAWAL PAGE
   ========================================================= */

function initializeWithdrawPage() {

    const withdrawForm =
        document.getElementById("withdrawForm");

    const withdrawMessage =
        document.getElementById("withdrawMessage");

    const withdrawAsset =
        document.getElementById("withdrawAsset");

    const withdrawNetwork =
        document.getElementById("withdrawNetwork");

    const withdrawAmount =
        document.getElementById("withdrawAmount");

    const withdrawWallet =
        document.getElementById("withdrawWallet");

    const withdrawConfirmation =
        document.getElementById("withdrawConfirmation");


    /* ---------------------------------------------------------
       WITHDRAWAL FORM
       --------------------------------------------------------- */

    withdrawForm?.addEventListener("submit", event => {

        event.preventDefault();


        const asset =
            withdrawAsset?.value;

        const network =
            withdrawNetwork?.value;

        const wallet =
            withdrawWallet?.value.trim();

        const amount =
            withdrawAmount?.value;

        const confirmed =
            withdrawConfirmation?.checked;


        /* Required fields */

        if (
            !asset ||
            !network ||
            !wallet ||
            !amount ||
            !confirmed
        ) {

            if (withdrawMessage) {

                withdrawMessage.textContent =
                    "Please complete all required fields and confirm your withdrawal details.";

            }

            return;

        }


        /* Amount validation */

        if (Number(amount) <= 0) {

            if (withdrawMessage) {

                withdrawMessage.textContent =
                    "Please enter a valid withdrawal amount.";

            }

            return;

        }


        /*
         * No withdrawal is actually processed here.
         *
         * A secure backend must verify:
         * - authenticated user
         * - available balance
         * - wallet ownership
         * - network
         * - withdrawal limits
         * - security checks / 2FA
         * - transaction approval
         */

        if (withdrawMessage) {

            withdrawMessage.textContent =
                "Your withdrawal request is ready to be submitted. A secure backend is required to verify your balance, wallet and security requirements before processing.";

        }

    });


    /* ---------------------------------------------------------
       LOGOUT
       --------------------------------------------------------- */

    const logoutButton =
        document.getElementById("logoutButton");


    logoutButton?.addEventListener("click", () => {

        window.location.href =
            "signin.html";

    });

}


/* Run Withdrawal Page */

if (document.getElementById("withdrawForm")) {

    initializeWithdrawPage();

}

// Dashboard logout
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("dashboardLogoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            window.location.href = "signin.html";
        });
    }
});

// ============================================
// SUPABASE CONNECTION
// ============================================

const SUPABASE_URL = "https://cseifieuxbtzkdagmmra.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZWlmaWV1eGJ0emtkYWdtbXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MTE2MTksImV4cCI6MjEwNTE4NzYxOX0.zYgIoLgo1d4osbLrBctuwGnYxKtKqoxxDepQw0B4Dio";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ============================================
// PROTECT PRIVATE PAGES
// ============================================

(async function () {
    const privatePages = [
        "dashboard.html",
        "deposit.html",
        "withdraw.html",
        "transactions.html",
        "investments.html",
        "profile.html",
        "settings.html",
        "support.html"
    ];

    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase();

    if (privatePages.includes(currentPage)) {
        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error || !data.user) {
            window.location.href = "signin.html";
        }
    }
})();