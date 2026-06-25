(() => {
    const blogApi = window.digitalVisionBlogs;
    const form = document.querySelector("[data-blog-form]");
    const list = document.querySelector("[data-admin-blog-list]");
    const status = document.querySelector("[data-admin-status]");
    const count = document.querySelector("[data-blog-count]");
    const formTitle = document.querySelector("[data-form-title]");
    const submitButton = document.querySelector("[data-submit-button]");
    const resetFormButton = document.querySelector("[data-reset-form]");
    const resetDefaultsButton = document.querySelector("[data-reset-defaults]");
    const logoutButton = document.querySelector("[data-admin-logout]");

    if (!blogApi || !(form instanceof HTMLFormElement) || !(list instanceof HTMLElement)) {
        return;
    }

    blogApi.seedDefaults();

    function field(name) {
        return form.elements.namedItem(name);
    }

    function setStatus(message = "", state = "info") {
        if (!(status instanceof HTMLElement)) {
            return;
        }

        if (!message) {
            status.hidden = true;
            status.textContent = "";
            delete status.dataset.state;
            return;
        }

        status.hidden = false;
        status.dataset.state = state;
        status.textContent = message;
    }

    function setFormMode(isEditing) {
        if (formTitle instanceof HTMLElement) {
            formTitle.textContent = isEditing ? "Edit blog" : "Create a new blog";
        }

        if (submitButton instanceof HTMLElement) {
            submitButton.textContent = isEditing ? "Update blog" : "Publish blog";
        }
    }

    function resetForm() {
        form.reset();
        field("id").value = "";
        field("ctaLabel").value = "Read more";
        field("ctaUrl").value = "contact-us.html";
        const fileInput = document.getElementById("admin-image-file");
        if (fileInput instanceof HTMLInputElement) {
            fileInput.value = "";
        }
        setFormMode(false);
    }

    function populateForm(blog) {
        field("id").value = blog.id;
        field("category").value = blog.category;
        field("title").value = blog.title;
        field("excerpt").value = blog.excerpt;
        field("image").value = blog.image;
        field("alt").value = blog.alt;
        field("ctaLabel").value = blog.ctaLabel;
        field("ctaUrl").value = blog.ctaUrl;
        setFormMode(true);
        setStatus(`Editing "${blog.title}".`, "info");
        form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function buildBlogItem(blog) {
        const item = document.createElement("article");
        item.className = "admin-blog-item";

        const thumb = document.createElement("div");
        thumb.className = "admin-blog-item__thumb";

        if (blog.image) {
            const image = document.createElement("img");
            image.src = blog.image;
            image.alt = blog.alt;
            image.loading = "lazy";
            thumb.appendChild(image);
        } else {
            thumb.textContent = blog.category;
        }

        const content = document.createElement("div");
        content.className = "admin-blog-item__content";

        const meta = document.createElement("p");
        meta.className = "admin-blog-item__meta";
        meta.textContent = blog.category;

        const title = document.createElement("h3");
        title.className = "admin-blog-item__title";
        title.textContent = blog.title;

        const excerpt = document.createElement("p");
        excerpt.className = "admin-blog-item__excerpt";
        excerpt.textContent = blog.excerpt;

        const link = document.createElement("p");
        link.className = "admin-blog-item__link";
        link.textContent = `CTA: ${blog.ctaLabel} -> ${blog.ctaUrl}`;

        content.append(meta, title, excerpt, link);

        const actions = document.createElement("div");
        actions.className = "admin-blog-item__actions";

        const editButton = document.createElement("button");
        editButton.className = "admin-button admin-button--secondary";
        editButton.type = "button";
        editButton.dataset.action = "edit";
        editButton.dataset.blogId = blog.id;
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.className = "admin-button admin-button--danger";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.blogId = blog.id;
        deleteButton.textContent = "Delete";

        actions.append(editButton, deleteButton);
        item.append(thumb, content, actions);

        return item;
    }

    function renderBlogs() {
        const blogs = blogApi.getBlogs();
        list.replaceChildren();

        if (count instanceof HTMLElement) {
            count.textContent = String(blogs.length);
        }

        if (!blogs.length) {
            const empty = document.createElement("div");
            empty.className = "admin-empty";
            empty.textContent = "No blogs have been created yet. Publish your first card from the editor.";
            list.appendChild(empty);
            return;
        }

        blogApi.sortBlogs(blogs).forEach((blog) => {
            list.appendChild(buildBlogItem(blog));
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const existing = blogApi.getBlogs().find((blog) => blog.id === field("id").value);

        blogApi.upsertBlog({
            id: field("id").value,
            category: field("category").value,
            title: field("title").value,
            excerpt: field("excerpt").value,
            image: field("image").value,
            alt: field("alt").value,
            ctaLabel: field("ctaLabel").value,
            ctaUrl: field("ctaUrl").value,
            createdAt: existing?.createdAt
        });

        renderBlogs();
        resetForm();
        setStatus(existing ? "Blog updated on the homepage feed." : "Blog published to the homepage feed.", "success");
    });

    list.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const button = target.closest("button[data-action]");

        if (!(button instanceof HTMLButtonElement)) {
            return;
        }

        const blogId = button.dataset.blogId;
        const action = button.dataset.action;
        const blog = blogApi.getBlogs().find((entry) => entry.id === blogId);

        if (!blog) {
            return;
        }

        if (action === "edit") {
            populateForm(blog);
            return;
        }

        if (action === "delete" && window.confirm(`Delete "${blog.title}" from the homepage blog section?`)) {
            blogApi.deleteBlog(blog.id);
            renderBlogs();
            resetForm();
            setStatus("Blog removed from the homepage feed.", "success");
        }
    });

    if (resetFormButton instanceof HTMLButtonElement) {
        resetFormButton.addEventListener("click", () => {
            resetForm();
            setStatus("", "info");
        });
    }

    if (resetDefaultsButton instanceof HTMLButtonElement) {
        resetDefaultsButton.addEventListener("click", () => {
            if (!window.confirm("Restore the original homepage blogs? This will replace the current saved list in this browser.")) {
                return;
            }

            blogApi.resetBlogs();
            renderBlogs();
            resetForm();
            setStatus("Default blog cards restored.", "success");
        });
    }

    if (logoutButton instanceof HTMLButtonElement) {
        logoutButton.addEventListener("click", async () => {
            try {
                // The backend clears the HTTP-only cookie; frontend code never handles the JWT directly.
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Accept: "application/json"
                    },
                    credentials: "same-origin"
                });
            } finally {
                window.location.replace("/admin.html");
            }
        });
    }

    const fileInput = document.getElementById("admin-image-file");
    if (fileInput instanceof HTMLInputElement) {
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files?.[0];
            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {
                setStatus("Selected file is not an image.", "error");
                return;
            }

            // Limit image size to 1.5MB to stay within LocalStorage limits safely
            const MAX_SIZE_MB = 1.5;
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setStatus(`Image is too large. Please select an image under ${MAX_SIZE_MB}MB.`, "error");
                return;
            }

            setStatus("Processing image...", "info");

            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = e.target?.result;
                if (typeof base64Data === "string") {
                    field("image").value = base64Data;
                    setStatus("Image uploaded and converted successfully!", "success");
                    field("image").dispatchEvent(new Event("input", { bubbles: true }));
                }
            };
            reader.onerror = () => {
                setStatus("Failed to read image file.", "error");
            };
            reader.readAsDataURL(file);
        });
    }

    resetForm();
    renderBlogs();
})();
