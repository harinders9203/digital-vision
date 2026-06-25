(() => {
    const blogApi = window.digitalVisionBlogs;
    const blogList = document.querySelector("[data-blog-list]");

    if (!blogApi || !(blogList instanceof HTMLElement)) {
        return;
    }

    blogApi.seedDefaults();
    blogApi.renderBlogList(blogList, blogApi.getBlogs());

    window.addEventListener("storage", (event) => {
        if (event.key === blogApi.STORAGE_KEY) {
            blogApi.renderBlogList(blogList, blogApi.getBlogs());
        }
    });
})();
