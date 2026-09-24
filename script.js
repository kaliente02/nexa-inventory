/* =========================================================
   NECXSOFT INVENTORY MANAGEMENT SYSTEM
   Frontend Inventory System
   LocalStorage Database
========================================================= */

const STORAGE_KEYS = {
    inventory: "necxsoft_inventory",
    suppliers: "necxsoft_suppliers",
    categories: "necxsoft_categories",
    movements: "necxsoft_movements",
    activities: "necxsoft_activities",
    settings: "necxsoft_settings"
};

let inventory = [];
let suppliers = [];
let categories = [];
let movements = [];
let activities = [];

let settings = {
    companyName: "NecxSOFT",
    adminName: "Administrator",
    currency: "₱"
};

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadData();

    setupNavigation();
    setupForms();
    setupSearch();

    updateAll();

});

/* =========================================================
   LOAD / SAVE DATA
========================================================= */

function loadData() {

    inventory = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.inventory)
    ) || [];

    suppliers = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.suppliers)
    ) || [];

    categories = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.categories)
    ) || [];

    movements = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.movements)
    ) || [];

    activities = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.activities)
    ) || [];

    const savedSettings = localStorage.getItem(
        STORAGE_KEYS.settings
    );

    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }

    /* Create sample data on first launch */

    if (inventory.length === 0 && categories.length === 0) {
        createSampleData();
    }
}

function saveData() {

    localStorage.setItem(
        STORAGE_KEYS.inventory,
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        STORAGE_KEYS.suppliers,
        JSON.stringify(suppliers)
    );

    localStorage.setItem(
        STORAGE_KEYS.categories,
        JSON.stringify(categories)
    );

    localStorage.setItem(
        STORAGE_KEYS.movements,
        JSON.stringify(movements)
    );

    localStorage.setItem(
        STORAGE_KEYS.activities,
        JSON.stringify(activities)
    );

    localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(settings)
    );
}

/* =========================================================
   SAMPLE DATA
========================================================= */

function createSampleData() {

    categories = [
        "Computer Hardware",
        "Electronics",
        "Arduino Components",
        "Networking",
        "CCTV Equipment",
        "Security Equipment",
        "Office Supplies",
        "Tools",
        "Cables"
    ];

    suppliers = [
        {
            id: generateId("SUP"),
            name: "Tech Supply PH",
            contact: "Mark Santos",
            phone: "09171234567",
            email: "techsupply@example.com",
            address: "Davao City",
            createdAt: now()
        },
        {
            id: generateId("SUP"),
            name: "ElectroHub",
            contact: "John Cruz",
            phone: "09181234567",
            email: "electrohub@example.com",
            address: "Davao City",
            createdAt: now()
        }
    ];

    inventory = [

        createProduct(
            "Arduino Uno",
            "ARD-UNO-001",
            "Arduino Components",
            25,
            5,
            450,
            "Tech Supply PH",
            "Storage A"
        ),

        createProduct(
            "ESP32 Development Board",
            "ESP32-001",
            "Electronics",
            18,
            5,
            350,
            "Tech Supply PH",
            "Storage A"
        ),

        createProduct(
            "SIM800L Module",
            "SIM800L-001",
            "Electronics",
            8,
            5,
            280,
            "ElectroHub",
            "Storage A"
        ),

        createProduct(
            "CCTV Camera",
            "CCTV-001",
            "CCTV Equipment",
            4,
            5,
            1850,
            "Tech Supply PH",
            "Storage B"
        ),

        createProduct(
            "Cat6 Cable",
            "CAT6-001",
            "Cables",
            50,
            10,
            180,
            "Tech Supply PH",
            "Storage B"
        ),

        createProduct(
            "Smoke Detector",
            "SMK-001",
            "Security Equipment",
            0,
            5,
            750,
            "ElectroHub",
            "Storage C"
        ),

        createProduct(
            "Ethernet Switch",
            "SW-001",
            "Networking",
            12,
            5,
            1200,
            "Tech Supply PH",
            "Storage B"
        ),

        createProduct(
            "Digital Multimeter",
            "DMM-001",
            "Tools",
            7,
            3,
            650,
            "ElectroHub",
            "Storage C"
        )
    ];

    activities = [];

    addActivity(
        "System Initialized",
        "Sample inventory data created."
    );

    saveData();
}

function createProduct(
    name,
    sku,
    category,
    quantity,
    minimum,
    cost,
    supplier,
    location
) {

    return {
        id: generateId("ITM"),
        name,
        sku,
        category,
        quantity,
        minimum,
        cost,
        supplier,
        location,
        description: "",
        createdAt: now(),
        updatedAt: now()
    };
}

/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            showPage(page);

            navItems.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            document.getElementById("sidebar")
                .classList.remove("open");
        });
    });
}

function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(page);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    const titles = {
        dashboard: [
            "Dashboard",
            "Overview of your inventory"
        ],
        inventory: [
            "Inventory",
            "Manage all inventory items"
        ],
        stock: [
            "Stock Movement",
            "Track inventory changes"
        ],
        suppliers: [
            "Suppliers",
            "Manage your suppliers"
        ],
        categories: [
            "Categories",
            "Organize your inventory"
        ],
        reports: [
            "Reports",
            "Inventory reports and summaries"
        ],
        activity: [
            "Activity Log",
            "System activity history"
        ],
        settings: [
            "Settings",
            "Configure your inventory system"
        ]
    };

    if (titles[page]) {

        document.getElementById("pageTitle").textContent =
            titles[page][0];

        document.getElementById("pageSubtitle").textContent =
            titles[page][1];
    }

    updateAll();
}

/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateAll() {

    updateDashboard();
    renderInventory();
    renderStockMovements();
    renderSuppliers();
    renderCategories();
    renderReports();
    renderActivities();
    updateCategorySelects();
    updateStockItemSelect();
    loadSettingsForm();
}

/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const totalProducts = inventory.length;

    const totalStock = inventory.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    const low = inventory.filter(
        item => getStatus(item) === "Low Stock"
    ).length;

    const out = inventory.filter(
        item => getStatus(item) === "Out of Stock"
    ).length;

    const totalValue = inventory.reduce(
        (sum, item) =>
            sum + Number(item.quantity) * Number(item.cost),
        0
    );

    document.getElementById("totalProducts").textContent =
        totalProducts;

    document.getElementById("totalStock").textContent =
        totalStock;

    document.getElementById("lowStock").textContent =
        low;

    document.getElementById("outOfStock").textContent =
        out;

    document.getElementById("inventoryValue").textContent =
        formatCurrency(totalValue);

    /* Percentages */

    const total = totalProducts || 1;

    const inStock = inventory.filter(
        item => getStatus(item) === "In Stock"
    ).length;

    const inPercent = Math.round((inStock / total) * 100);
    const lowPercent = Math.round((low / total) * 100);
    const outPercent = Math.round((out / total) * 100);

    document.getElementById("inStockPercent").textContent =
        inPercent + "%";

    document.getElementById("lowStockPercent").textContent =
        lowPercent + "%";

    document.getElementById("outStockPercent").textContent =
        outPercent + "%";

    document.getElementById("inStockBar").style.width =
        inPercent + "%";

    document.getElementById("lowStockBar").style.width =
        lowPercent + "%";

    document.getElementById("outStockBar").style.width =
        outPercent + "%";

    renderDashboardActivity();
    renderRecentProducts();
}

/* =========================================================
   INVENTORY
========================================================= */

function renderInventory() {

    const table = document.getElementById("inventoryTable");

    const search =
        document.getElementById("inventorySearch")?.value
        .toLowerCase() || "";

    const category =
        document.getElementById("categoryFilter")?.value || "";

    const status =
        document.getElementById("statusFilter")?.value || "";

    let filtered = inventory.filter(item => {

        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.sku.toLowerCase().includes(search) ||
            item.id.toLowerCase().includes(search) ||
            (item.supplier || "").toLowerCase().includes(search);

        const matchesCategory =
            !category || item.category === category;

        const matchesStatus =
            !status || getStatus(item) === status;

        return matchesSearch &&
               matchesCategory &&
               matchesStatus;
    });

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    No inventory items found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = filtered.map(item => {

        const status = getStatus(item);

        return `
            <tr>

                <td>${escapeHTML(item.id)}</td>

                <td>
                    <strong>${escapeHTML(item.name)}</strong>
                </td>

                <td>${escapeHTML(item.sku)}</td>

                <td>${escapeHTML(item.category)}</td>

                <td>${item.quantity}</td>

                <td>${formatCurrency(item.cost)}</td>

                <td>
                    ${formatCurrency(item.quantity * item.cost)}
                </td>

                <td>
                    ${statusBadge(status)}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="action-btn"
                            onclick="viewItem('${item.id}')">
                            View
                        </button>

                        <button
                            class="action-btn"
                            onclick="editItem('${item.id}')">
                            Edit
                        </button>

                        <button
                            class="action-btn delete"
                            onclick="deleteItem('${item.id}')">
                            Delete
                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");
}

/* =========================================================
   ITEM MODAL
========================================================= */

function openItemModal() {

    document.getElementById("itemForm").reset();

    document.getElementById("editItemId").value = "";

    document.getElementById("itemModalTitle").textContent =
        "Add Inventory Item";

    updateCategorySelects();

    document.getElementById("itemModal")
        .classList.add("show");
}

function editItem(id) {

    const item = inventory.find(
        item => item.id === id
    );

    if (!item) return;

    updateCategorySelects();

    document.getElementById("editItemId").value =
        item.id;

    document.getElementById("itemName").value =
        item.name;

    document.getElementById("itemSKU").value =
        item.sku;

    document.getElementById("itemCategory").value =
        item.category;

    document.getElementById("itemQuantity").value =
        item.quantity;

    document.getElementById("itemMinimum").value =
        item.minimum;

    document.getElementById("itemCost").value =
        item.cost;

    document.getElementById("itemSupplier").value =
        item.supplier || "";

    document.getElementById("itemLocation").value =
        item.location || "";

    document.getElementById("itemDescription").value =
        item.description || "";

    document.getElementById("itemModalTitle").textContent =
        "Edit Inventory Item";

    document.getElementById("itemModal")
        .classList.add("show");
}

function setupForms() {

    document.getElementById("itemForm")
        .addEventListener("submit", saveItem);

    document.getElementById("stockForm")
        .addEventListener("submit", saveStockMovement);

    document.getElementById("supplierForm")
        .addEventListener("submit", saveSupplier);

    document.getElementById("categoryForm")
        .addEventListener("submit", saveCategory);
}

function saveItem(event) {

    event.preventDefault();

    const id =
        document.getElementById("editItemId").value;

    const name =
        document.getElementById("itemName").value.trim();

    const sku =
        document.getElementById("itemSKU").value.trim();

    const category =
        document.getElementById("itemCategory").value;

    const quantity =
        Number(document.getElementById("itemQuantity").value);

    const minimum =
        Number(document.getElementById("itemMinimum").value);

    const cost =
        Number(document.getElementById("itemCost").value);

    const supplier =
        document.getElementById("itemSupplier").value.trim();

    const location =
        document.getElementById("itemLocation").value.trim();

    const description =
        document.getElementById("itemDescription").value.trim();

    if (!name || !sku || !category) {
        showToast("Please complete all required fields.");
        return;
    }

    const duplicateSKU = inventory.some(item =>
        item.sku.toLowerCase() === sku.toLowerCase() &&
        item.id !== id
    );

    if (duplicateSKU) {
        showToast("SKU already exists.");
        return;
    }

    if (id) {

        const item = inventory.find(
            item => item.id === id
        );

        if (!item) return;

        item.name = name;
        item.sku = sku;
        item.category = category;
        item.quantity = quantity;
        item.minimum = minimum;
        item.cost = cost;
        item.supplier = supplier;
        item.location = location;
        item.description = description;
        item.updatedAt = now();

        addActivity(
            "Item Edited",
            `${name} was updated.`
        );

        showToast("Inventory item updated.");

    } else {

        const newItem = {
            id: generateId("ITM"),
            name,
            sku,
            category,
            quantity,
            minimum,
            cost,
            supplier,
            location,
            description,
            createdAt: now(),
            updatedAt: now()
        };

        inventory.unshift(newItem);

        addActivity(
            "Item Added",
            `${name} was added to inventory.`
        );

        showToast("Inventory item added.");
    }

    saveData();

    closeModal("itemModal");

    updateAll();
}

/* =========================================================
   DELETE ITEM
========================================================= */

function deleteItem(id) {

    const item = inventory.find(
        item => item.id === id
    );

    if (!item) return;

    const confirmed = confirm(
        `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    inventory = inventory.filter(
        item => item.id !== id
    );

    addActivity(
        "Item Deleted",
        `${item.name} was deleted.`
    );

    saveData();

    updateAll();

    showToast("Inventory item deleted.");
}

/* =========================================================
   VIEW ITEM
========================================================= */

function viewItem(id) {

    const item = inventory.find(
        item => item.id === id
    );

    if (!item) return;

    const html = `

        <div class="details-grid">

            <div class="detail-box">
                <span>Product Name</span>
                <strong>${escapeHTML(item.name)}</strong>
            </div>

            <div class="detail-box">
                <span>Item ID</span>
                <strong>${escapeHTML(item.id)}</strong>
            </div>

            <div class="detail-box">
                <span>SKU</span>
                <strong>${escapeHTML(item.sku)}</strong>
            </div>

            <div class="detail-box">
                <span>Category</span>
                <strong>${escapeHTML(item.category)}</strong>
            </div>

            <div class="detail-box">
                <span>Current Stock</span>
                <strong>${item.quantity}</strong>
            </div>

            <div class="detail-box">
                <span>Minimum Stock</span>
                <strong>${item.minimum}</strong>
            </div>

            <div class="detail-box">
                <span>Unit Cost</span>
                <strong>${formatCurrency(item.cost)}</strong>
            </div>

            <div class="detail-box">
                <span>Total Value</span>
                <strong>
                    ${formatCurrency(item.quantity * item.cost)}
                </strong>
            </div>

            <div class="detail-box">
                <span>Supplier</span>
                <strong>${escapeHTML(item.supplier || "N/A")}</strong>
            </div>

            <div class="detail-box">
                <span>Location</span>
                <strong>${escapeHTML(item.location || "N/A")}</strong>
            </div>

            <div class="detail-box">
                <span>Status</span>
                <strong>${statusBadge(getStatus(item))}</strong>
            </div>

            <div class="detail-box">
                <span>Last Updated</span>
                <strong>${item.updatedAt}</strong>
            </div>

        </div>

        <div style="padding:0 22px 22px;">
            <strong>Description</strong>
            <p style="margin-top:8px;color:#6b7280;">
                ${escapeHTML(item.description || "No description.")}
            </p>
        </div>
    `;

    document.getElementById("itemDetails").innerHTML =
        html;

    document.getElementById("detailsModal")
        .classList.add("show");
}

/* =========================================================
   STOCK MOVEMENT
========================================================= */

function openStockModal() {

    updateStockItemSelect();

    document.getElementById("stockForm").reset();

    document.getElementById("stockModal")
        .classList.add("show");
}

function saveStockMovement(event) {

    event.preventDefault();

    const itemId =
        document.getElementById("stockItem").value;

    const type =
        document.getElementById("stockType").value;

    const quantity =
        Number(document.getElementById("stockQuantity").value);

    const reason =
        document.getElementById("stockReason").value.trim();

    const item = inventory.find(
        item => item.id === itemId
    );

    if (!item) return;

    if (quantity < 0) {
        showToast("Quantity cannot be negative.");
        return;
    }

    const previous = Number(item.quantity);

    let newStock = previous;

    if (type === "IN") {
        newStock = previous + quantity;
    }

    if (type === "OUT") {

        if (quantity > previous) {
            showToast("Not enough stock available.");
            return;
        }

        newStock = previous - quantity;
    }

    if (type === "ADJUST") {
        newStock = quantity;
    }

    item.quantity = newStock;
    item.updatedAt = now();

    movements.unshift({
        id: generateId("MOV"),
        itemId: item.id,
        itemName: item.name,
        type,
        quantity,
        previous,
        newStock,
        reason: reason || "No reason provided",
        date: now()
    });

    const movementName =
        type === "IN"
            ? "Stock Added"
            : type === "OUT"
                ? "Stock Removed"
                : "Stock Adjusted";

    addActivity(
        movementName,
        `${item.name}: ${previous} → ${newStock}`
    );

    saveData();

    closeModal("stockModal");

    updateAll();

    showToast("Stock updated successfully.");
}

/* =========================================================
   STOCK TABLE
========================================================= */

function renderStockMovements() {

    const table =
        document.getElementById("stockTable");

    if (movements.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No stock movements recorded.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = movements.map(movement => {

        const typeName =
            movement.type === "IN"
                ? "Stock Added"
                : movement.type === "OUT"
                    ? "Stock Removed"
                    : "Stock Adjusted";

        return `
            <tr>

                <td>${movement.date}</td>

                <td>
                    <strong>
                        ${escapeHTML(movement.itemName)}
                    </strong>
                </td>

                <td>${typeName}</td>

                <td>${movement.quantity}</td>

                <td>${movement.previous}</td>

                <td>${movement.newStock}</td>

                <td>${escapeHTML(movement.reason)}</td>

            </tr>
        `;

    }).join("");
}

/* =========================================================
   SUPPLIERS
========================================================= */

function openSupplierModal() {

    document.getElementById("supplierForm").reset();

    document.getElementById("supplierModal")
        .classList.add("show");
}

function saveSupplier(event) {

    event.preventDefault();

    const name =
        document.getElementById("supplierName")
            .value.trim();

    if (!name) return;

    suppliers.push({
        id: generateId("SUP"),
        name,
        contact:
            document.getElementById("supplierContact")
                .value.trim(),
        phone:
            document.getElementById("supplierPhone")
                .value.trim(),
        email:
            document.getElementById("supplierEmail")
                .value.trim(),
        address:
            document.getElementById("supplierAddress")
                .value.trim(),
        createdAt: now()
    });

    addActivity(
        "Supplier Added",
        `${name} was added.`
    );

    saveData();

    closeModal("supplierModal");

    updateAll();

    showToast("Supplier added successfully.");
}

function renderSuppliers() {

    const table =
        document.getElementById("supplierTable");

    if (suppliers.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No suppliers found.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = suppliers.map(supplier => {

        const productCount =
            inventory.filter(
                item => item.supplier === supplier.name
            ).length;

        return `
            <tr>

                <td>
                    <strong>
                        ${escapeHTML(supplier.name)}
                    </strong>
                </td>

                <td>${escapeHTML(supplier.contact || "-")}</td>

                <td>${escapeHTML(supplier.phone || "-")}</td>

                <td>${escapeHTML(supplier.email || "-")}</td>

                <td>${productCount}</td>

                <td>
                    <span class="status in-stock">
                        Active
                    </span>
                </td>

                <td>

                    <button
                        class="action-btn delete"
                        onclick="deleteSupplier('${supplier.id}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}

function deleteSupplier(id) {

    const supplier = suppliers.find(
        supplier => supplier.id === id
    );

    if (!supplier) return;

    if (!confirm(
        `Delete supplier "${supplier.name}"?`
    )) return;

    suppliers = suppliers.filter(
        supplier => supplier.id !== id
    );

    addActivity(
        "Supplier Deleted",
        `${supplier.name} was deleted.`
    );

    saveData();

    updateAll();

    showToast("Supplier deleted.");
}

/* =========================================================
   CATEGORIES
========================================================= */

function openCategoryModal() {

    document.getElementById("categoryForm").reset();

    document.getElementById("categoryModal")
        .classList.add("show");
}

function saveCategory(event) {

    event.preventDefault();

    const name =
        document.getElementById("categoryName")
            .value.trim();

    if (!name) return;

    const exists = categories.some(
        category =>
            category.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
        showToast("Category already exists.");
        return;
    }

    categories.push(name);

    addActivity(
        "Category Added",
        `${name} category was created.`
    );

    saveData();

    closeModal("categoryModal");

    updateAll();

    showToast("Category added successfully.");
}

function renderCategories() {

    const grid =
        document.getElementById("categoryGrid");

    if (categories.length === 0) {

        grid.innerHTML =
            "<p>No categories available.</p>";

        return;
    }

    grid.innerHTML = categories.map(category => {

        const count =
            inventory.filter(
                item => item.category === category
            ).length;

        return `
            <div class="category-card">

                <h3>
                    ${escapeHTML(category)}
                </h3>

                <p>
                    ${count} inventory item${count === 1 ? "" : "s"}
                </p>

                <div class="category-actions">

                    <button
                        class="action-btn delete"
                        onclick="deleteCategory('${escapeHTML(category)}')">
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");
}

function deleteCategory(category) {

    const used =
        inventory.some(
            item => item.category === category
        );

    if (used) {
        showToast(
            "Cannot delete a category currently in use."
        );
        return;
    }

    if (!confirm(
        `Delete category "${category}"?`
    )) return;

    categories =
        categories.filter(
            item => item !== category
        );

    addActivity(
        "Category Deleted",
        `${category} category was deleted.`
    );

    saveData();

    updateAll();

    showToast("Category deleted.");
}

/* =========================================================
   REPORTS
========================================================= */

function renderReports() {

    const totalValue =
        inventory.reduce(
            (sum, item) =>
                sum + item.quantity * item.cost,
            0
        );

    const low =
        inventory.filter(
            item => getStatus(item) === "Low Stock"
        );

    const out =
        inventory.filter(
            item => getStatus(item) === "Out of Stock"
        );

    document.getElementById("reportValue").textContent =
        formatCurrency(totalValue);

    document.getElementById("reportProducts").textContent =
        inventory.length;

    document.getElementById("reportLowStock").textContent =
        low.length;

    document.getElementById("reportOutStock").textContent =
        out.length;

    const table =
        document.getElementById("lowStockTable");

    const attention =
        inventory.filter(
            item =>
                getStatus(item) === "Low Stock" ||
                getStatus(item) === "Out of Stock"
        );

    if (attention.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No low-stock items.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = attention.map(item => {

        return `
            <tr>

                <td>
                    <strong>${escapeHTML(item.name)}</strong>
                </td>

                <td>${escapeHTML(item.sku)}</td>

                <td>${item.quantity}</td>

                <td>${item.minimum}</td>

                <td>
                    ${statusBadge(getStatus(item))}
                </td>

            </tr>
        `;

    }).join("");
}

/* =========================================================
   ACTIVITY LOG
========================================================= */

function addActivity(action, details) {

    activities.unshift({
        id: generateId("ACT"),
        action,
        details,
        user: settings.adminName,
        date: now()
    });

    activities =
        activities.slice(0, 100);
}

function renderActivities() {

    const container =
        document.getElementById("activityList");

    if (activities.length === 0) {

        container.innerHTML =
            "<p style='padding:20px;'>No activities yet.</p>";

        return;
    }

    container.innerHTML =
        activities.map(activity => {

            return `
                <div class="activity-item">

                    <strong>
                        ${escapeHTML(activity.action)}
                    </strong>

                    <div>
                        ${escapeHTML(activity.details)}
                    </div>

                    <small>
                        ${escapeHTML(activity.user)}
                        •
                        ${activity.date}
                    </small>

                </div>
            `;

        }).join("");
}

function renderDashboardActivity() {

    const container =
        document.getElementById("dashboardActivity");

    const recent =
        activities.slice(0, 5);

    if (recent.length === 0) {

        container.innerHTML =
            "<p>No recent activity.</p>";

        return;
    }

    container.innerHTML =
        recent.map(activity => {

            return `
                <div class="activity-item">

                    <strong>
                        ${escapeHTML(activity.action)}
                    </strong>

                    <small>
                        ${escapeHTML(activity.details)}
                    </small>

                </div>
            `;

        }).join("");
}

/* =========================================================
   RECENT PRODUCTS
========================================================= */

function renderRecentProducts() {

    const table =
        document.getElementById("recentProducts");

    const recent =
        inventory.slice(0, 5);

    if (recent.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No products.
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML =
        recent.map(item => {

            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>
                    </td>

                    <td>${escapeHTML(item.sku)}</td>

                    <td>${escapeHTML(item.category)}</td>

                    <td>${item.quantity}</td>

                    <td>
                        ${statusBadge(getStatus(item))}
                    </td>

                </tr>
            `;

        }).join("");
}

/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById("inventorySearch");

    const category =
        document.getElementById("categoryFilter");

    const status =
        document.getElementById("statusFilter");

    if (search) {
        search.addEventListener(
            "input",
            renderInventory
        );
    }

    if (category) {
        category.addEventListener(
            "change",
            renderInventory
        );
    }

    if (status) {
        status.addEventListener(
            "change",
            renderInventory
        );
    }
}

function clearFilters() {

    document.getElementById("inventorySearch").value = "";

    document.getElementById("categoryFilter").value = "";

    document.getElementById("statusFilter").value = "";

    renderInventory();
}

/* =========================================================
   SELECTS
========================================================= */

function updateCategorySelects() {

    const filter =
        document.getElementById("categoryFilter");

    const itemCategory =
        document.getElementById("itemCategory");

    if (filter) {

        const current =
            filter.value;

        filter.innerHTML =
            `<option value="">All Categories</option>` +
            categories.map(category =>
                `<option value="${escapeHTML(category)}">
                    ${escapeHTML(category)}
                </option>`
            ).join("");

        filter.value = current;
    }

    if (itemCategory) {

        const current =
            itemCategory.value;

        itemCategory.innerHTML =
            `<option value="">Select Category</option>` +
            categories.map(category =>
                `<option value="${escapeHTML(category)}">
                    ${escapeHTML(category)}
                </option>`
            ).join("");

        itemCategory.value = current;
    }
}

function updateStockItemSelect() {

    const select =
        document.getElementById("stockItem");

    if (!select) return;

    select.innerHTML =
        inventory.map(item =>
            `<option value="${item.id}">
                ${escapeHTML(item.name)}
                — ${item.quantity} units
            </option>`
        ).join("");
}

/* =========================================================
   SETTINGS
========================================================= */

function loadSettingsForm() {

    const company =
        document.getElementById("companyName");

    const admin =
        document.getElementById("adminName");

    const currency =
        document.getElementById("currency");

    if (company) {
        company.value =
            settings.companyName;
    }

    if (admin) {
        admin.value =
            settings.adminName;
    }

    if (currency) {
        currency.value =
            settings.currency;
    }
}

function saveSettings() {

    settings.companyName =
        document.getElementById("companyName")
            .value.trim() || "NecxSOFT";

    settings.adminName =
        document.getElementById("adminName")
            .value.trim() || "Administrator";

    settings.currency =
        document.getElementById("currency").value;

    saveData();

    addActivity(
        "Settings Updated",
        "System settings were updated."
    );

    saveData();

    updateAll();

    showToast("Settings saved.");
}

function clearAllData() {

    if (!confirm(
        "WARNING: This will permanently delete all inventory data. Continue?"
    )) {
        return;
    }

    localStorage.clear();

    inventory = [];
    suppliers = [];
    categories = [];
    movements = [];
    activities = [];

    showToast("All data has been cleared.");

    updateAll();
}

/* =========================================================
   EXPORT CSV
========================================================= */

function exportCSV() {

    if (inventory.length === 0) {
        showToast("There is no inventory to export.");
        return;
    }

    const headers = [
        "Item ID",
        "Product Name",
        "SKU",
        "Category",
        "Quantity",
        "Minimum Stock",
        "Unit Cost",
        "Total Value",
        "Supplier",
        "Location",
        "Status"
    ];

    const rows = inventory.map(item => [
        item.id,
        item.name,
        item.sku,
        item.category,
        item.quantity,
        item.minimum,
        item.cost,
        item.quantity * item.cost,
        item.supplier,
        item.location,
        getStatus(item)
    ]);

    const csv = [
        headers,
        ...rows
    ].map(row =>
        row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
    ).join("\n");

    const blob =
        new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download =
        "necxsoft-inventory.csv";

    link.click();

    URL.revokeObjectURL(url);

    showToast("CSV exported successfully.");
}

/* =========================================================
   PRINT REPORT
========================================================= */

function printReport() {

    window.print();
}

/* =========================================================
   STATUS
========================================================= */

function getStatus(item) {

    const quantity =
        Number(item.quantity);

    const minimum =
        Number(item.minimum);

    if (quantity <= 0) {
        return "Out of Stock";
    }

    if (quantity <= minimum) {
        return "Low Stock";
    }

    return "In Stock";
}

function statusBadge(status) {

    let className = "in-stock";

    if (status === "Low Stock") {
        className = "low-stock";
    }

    if (status === "Out of Stock") {
        className = "out-stock";
    }

    return `
        <span class="status ${className}">
            ${status}
        </span>
    `;
}

/* =========================================================
   MODALS
========================================================= */

function closeModal(id) {

    document.getElementById(id)
        .classList.remove("show");
}

window.addEventListener("click", event => {

    if (event.target.classList.contains("modal")) {
        event.target.classList.remove("show");
    }
});

/* =========================================================
   MOBILE MENU
========================================================= */

document.getElementById("menuBtn")
    ?.addEventListener("click", () => {

        document.getElementById("sidebar")
            .classList.toggle("open");
    });

/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}

/* =========================================================
   UTILITIES
========================================================= */

function generateId(prefix) {

    return prefix +
        "-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
}

function now() {

    return new Date().toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function formatCurrency(value) {

    return settings.currency +
        Number(value).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}