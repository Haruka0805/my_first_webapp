import browserSync from 'browser-sync';

browserSync.create().init({
    port: 3001,
    proxy: "localhost:3000",
    files: ["public/**/*.*", "app.js", "data/flashcards.json", "server.js"],
    open: true,
    notify: true,
    ui: false,
    ghostMode: false,
});
