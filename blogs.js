(() => {
    const STORAGE_KEY = "digital-vision-blogs";
    const DEFAULT_BLOGS = [
        {
            id: "seo-strategy-intent",
            category: "SEO Strategy",
            title: "How to turn search intent into higher quality inquiries",
            excerpt: "Clarify your pages around user intent so traffic quality improves alongside visibility.",
            image: "img/blogs/SEO-Stra.jpeg",
            alt: "Google search strategy illustration",
            ctaLabel: "Request this strategy",
            ctaUrl: "contact-us.html",
            createdAt: "2026-06-01T09:00:00.000Z",
            updatedAt: "2026-06-01T09:00:00.000Z"
        },
        {
            id: "paid-social-message-consistency",
            category: "Paid Social",
            title: "Why message consistency matters more than campaign complexity",
            excerpt: "Strong campaigns usually come from sharper offers and cleaner landing experiences, not more noise.",
            image: "img/blogs/meta-ads.jpeg",
            alt: "Social media campaign illustration",
            ctaLabel: "Discuss your campaigns",
            ctaUrl: "contact-us.html",
            createdAt: "2026-05-26T09:00:00.000Z",
            updatedAt: "2026-05-26T09:00:00.000Z"
        },
        {
            id: "website-first-impression",
            category: "Web Experience",
            title: "What a client-ready website should communicate in the first few seconds",
            excerpt: "Credibility, clarity, and a direct next step are what move visitors from interest to action.",
            image: "img/blogs/web-exp.jpg",
            alt: "Website conversion planning illustration",
            ctaLabel: "Upgrade your website",
            ctaUrl: "contact-us.html",
            createdAt: "2026-05-15T09:00:00.000Z",
            updatedAt: "2026-05-15T09:00:00.000Z"
        }
    ];

    function cloneDefaults() {
        return DEFAULT_BLOGS.map((blog) => ({ ...blog }));
    }

    function readStorage() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw === null) {
                return undefined;
            }

            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error("Unable to read saved blogs:", error);
            return undefined;
        }
    }

    function writeStorage(blogs) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
        } catch (error) {
            console.error("Unable to save blogs:", error);
        }
    }

    function toText(value, fallback = "") {
        return typeof value === "string" ? value.trim() : fallback;
    }

    function slugify(value) {
        return toText(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function normalizeBlog(blog, index = 0) {
        const now = new Date().toISOString();
        const title = toText(blog?.title, `Untitled blog ${index + 1}`);
        const fallbackId = `${slugify(title) || "blog"}-${index + 1}`;

        return {
            id: toText(blog?.id, fallbackId),
            category: toText(blog?.category, "Marketing Insight"),
            title,
            excerpt: toText(blog?.excerpt, "Add a short summary to help visitors understand what this blog covers."),
            image: toText(blog?.image),
            alt: toText(blog?.alt, `${title} illustration`),
            ctaLabel: toText(blog?.ctaLabel, "Read more"),
            ctaUrl: toText(blog?.ctaUrl, "contact-us.html"),
            createdAt: toText(blog?.createdAt, now),
            updatedAt: toText(blog?.updatedAt, toText(blog?.createdAt, now))
        };
    }

    function sortBlogs(blogs) {
        return [...blogs].sort((left, right) => {
            const leftTime = Date.parse(left.updatedAt || left.createdAt || "") || 0;
            const rightTime = Date.parse(right.updatedAt || right.createdAt || "") || 0;
            return rightTime - leftTime;
        });
    }

    function normalizeBlogCollection(blogs) {
        return sortBlogs(
            (Array.isArray(blogs) ? blogs : [])
                .map((blog, index) => normalizeBlog(blog, index))
                .filter((blog) => blog.title)
        );
    }

    function getDefaultBlogs() {
        return normalizeBlogCollection(cloneDefaults());
    }

    function getBlogs() {
        const storedBlogs = readStorage();
        if (storedBlogs === undefined) {
            return getDefaultBlogs();
        }

        return normalizeBlogCollection(storedBlogs);
    }

    function saveBlogs(blogs) {
        const normalized = normalizeBlogCollection(blogs);
        writeStorage(normalized);
        return normalized;
    }

    function seedDefaults() {
        const storedBlogs = readStorage();
        if (storedBlogs === undefined) {
            return saveBlogs(getDefaultBlogs());
        }

        return normalizeBlogCollection(storedBlogs);
    }

    function upsertBlog(nextBlog) {
        const blogs = getBlogs();
        const now = new Date().toISOString();
        const index = blogs.findIndex((blog) => blog.id === toText(nextBlog?.id));

        if (index >= 0) {
            const existing = blogs[index];
            blogs[index] = normalizeBlog(
                {
                    ...existing,
                    ...nextBlog,
                    createdAt: existing.createdAt || now,
                    updatedAt: now
                },
                index
            );
        } else {
            blogs.unshift(
                normalizeBlog(
                    {
                        ...nextBlog,
                        createdAt: toText(nextBlog?.createdAt, now),
                        updatedAt: now
                    },
                    blogs.length
                )
            );
        }

        return saveBlogs(blogs);
    }

    function deleteBlog(id) {
        return saveBlogs(getBlogs().filter((blog) => blog.id !== id));
    }

    function resetBlogs() {
        return saveBlogs(getDefaultBlogs());
    }

    function createBlogCard(blog) {
        const card = document.createElement("article");
        card.className = "insight-card";

        const imageWrap = document.createElement("div");
        imageWrap.className = "insight-card__image";

        if (blog.image) {
            const image = document.createElement("img");
            image.src = blog.image;
            image.alt = blog.alt;
            image.loading = "lazy";
            imageWrap.appendChild(image);
        } else {
            imageWrap.classList.add("insight-card__image--placeholder");
            const placeholder = document.createElement("span");
            placeholder.textContent = blog.category;
            imageWrap.appendChild(placeholder);
        }

        const body = document.createElement("div");
        body.className = "insight-card__body";

        const meta = document.createElement("p");
        meta.className = "insight-meta";
        meta.textContent = blog.category;

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const excerpt = document.createElement("p");
        excerpt.textContent = blog.excerpt;

        const link = document.createElement("a");
        link.href = blog.ctaUrl || "contact-us.html";
        link.textContent = blog.ctaLabel || "Read more";

        body.append(meta, title, excerpt, link);
        card.append(imageWrap, body);

        return card;
    }

    function renderBlogList(container, blogs = getBlogs()) {
        if (!(container instanceof HTMLElement)) {
            return;
        }

        container.replaceChildren();
        const normalized = sortBlogs(normalizeBlogCollection(blogs));

        if (!normalized.length) {
            const emptyState = document.createElement("div");
            emptyState.className = "insights-empty";
            emptyState.textContent = "No blogs have been published yet. Create one from the admin panel.";
            container.appendChild(emptyState);
            return;
        }

        normalized.forEach((blog) => {
            container.appendChild(createBlogCard(blog));
        });
    }

    window.digitalVisionBlogs = {
        STORAGE_KEY,
        getBlogs,
        getDefaultBlogs,
        saveBlogs,
        seedDefaults,
        upsertBlog,
        deleteBlog,
        resetBlogs,
        renderBlogList,
        sortBlogs
    };
})();
