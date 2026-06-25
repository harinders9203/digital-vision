function renderAdminPage() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Digital Vision Group</title>
    <meta name="referrer" content="same-origin">
    <link rel="stylesheet" href="/admin.css">
</head>
<body>
    <main class="admin-page">
        <section class="admin-hero">
            <div class="admin-hero__copy">
                <a class="admin-back" href="/index.html#insights">Back to homepage</a>
                <p class="admin-eyebrow">Blog Admin</p>
                <h1>Create homepage blog cards without editing code.</h1>
                <p class="admin-intro">
                    This dashboard is served only after backend JWT verification. Use it to manage the homepage blog cards.
                </p>
            </div>

            <div class="admin-hero__panel">
                <div class="admin-stat">
                    <strong data-blog-count>0</strong>
                    <span>Published blogs</span>
                </div>
                <p class="admin-note">
                    Use image paths like <code>img/blogs/meta-ads.jpeg</code> or a full image URL for the card visual.
                </p>
                <a class="admin-preview" href="/index.html#insights">Preview homepage section</a>
                <button class="admin-button admin-button--ghost" type="button" data-admin-logout>Log out</button>
            </div>
        </section>

        <section class="admin-layout">
            <form class="admin-form" data-blog-form>
                <div class="admin-form__header">
                    <div>
                        <p class="admin-form__eyebrow">Editor</p>
                        <h2 data-form-title>Create a new blog</h2>
                    </div>
                    <button class="admin-button admin-button--ghost" type="button" data-reset-form>Clear form</button>
                </div>

                <input type="hidden" name="id">

                <div class="admin-form__grid">
                    <label class="admin-field">
                        <span>Category</span>
                        <input type="text" name="category" placeholder="SEO Strategy" required>
                    </label>

                    <label class="admin-field">
                        <span>CTA Label</span>
                        <input type="text" name="ctaLabel" placeholder="Read more" required>
                    </label>

                    <label class="admin-field admin-field--full">
                        <span>Title</span>
                        <input type="text" name="title" placeholder="How to sharpen landing page clarity for better leads" required>
                    </label>

                    <label class="admin-field admin-field--full">
                        <span>Excerpt</span>
                        <textarea name="excerpt" rows="4" placeholder="A short summary that appears on the homepage card." required></textarea>
                    </label>

                    <div class="admin-field admin-field--full">
                        <span>Image Path or URL</span>
                        <div class="admin-image-row">
                            <input type="text" name="image" placeholder="img/blogs/web-exp.jpg">
                            <label class="admin-upload-button">
                                <span>Upload</span>
                                <input type="file" id="admin-image-file" accept="image/*" style="display: none;">
                            </label>
                        </div>
                    </div>

                    <label class="admin-field admin-field--full">
                        <span>Image Alt Text</span>
                        <input type="text" name="alt" placeholder="Website planning illustration">
                    </label>

                    <label class="admin-field">
                        <span>CTA Link</span>
                        <input type="text" name="ctaUrl" placeholder="contact-us.html" required>
                    </label>
                </div>

                <div class="admin-form__actions">
                    <button class="admin-button admin-button--primary" type="submit" data-submit-button>Publish blog</button>
                    <button class="admin-button admin-button--secondary" type="button" data-reset-defaults>Restore default blogs</button>
                </div>

                <p class="admin-status" data-admin-status hidden aria-live="polite"></p>
            </form>

            <section class="admin-library">
                <div class="admin-library__header">
                    <div>
                        <p class="admin-form__eyebrow">Library</p>
                        <h2>Published blog cards</h2>
                    </div>
                    <p class="admin-library__copy">
                        Edit or remove cards here. Newer updates automatically move to the top of the homepage section.
                    </p>
                </div>

                <div class="admin-blog-list" data-admin-blog-list></div>
            </section>
        </section>
    </main>

    <script src="/blogs.js"></script>
    <script src="/admin-editor.js"></script>
</body>
</html>`;
}

module.exports = {
    renderAdminPage
};
