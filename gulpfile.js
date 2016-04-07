/*
 * Created by abreits on 2016-04-06
 */

var gulp = require("gulp");
var del = require("del");
//var rename = require("gulp-rename");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var mocha = require("gulp-mocha");
var istanbul = require("gulp-istanbul");
//var mocha = require("gulp-spawn-mocha");

//define typescript project
var tsFrontendProject = ts.createProject({
    module: "commonjs",
    target: "ES6",
    declaration: true
});

//define typescript project types
var tsBackendProject = ts.createProject({
    module: "commonjs",
    target: "ES6",
    declaration: true,
    removeComments: true
});
var tsTestProject = tsBackendProject;

gulp.task("default", ["build"]);

gulp.task("clean", (done) => {
    del.sync([
        "coverage",
        "debug"
    ]);
    done();
});

gulp.task("build", ["clean", "build:backend", "build:copy"]);

gulp.task("build:backend", () => {
    return gulp.src("src/backend/**/*.ts")
        .pipe(tslint({configuration: "tools/settings/tslint-rules.json"}))
        .pipe(tslint.report("prose", {emitError: false}))
        .pipe(sourcemaps.init())
        .pipe(ts(tsBackendProject))
        .pipe(sourcemaps.write(".", {
            includeContent: false,
            sourceRoot: "../../src/backend/"
        }))
        .pipe(gulp.dest("debug/backend"))
});

gulp.task("build:copy", () => {
    return gulp.src(["src/frontend/**/**.html", "src/frontend/external/**"])
    .pipe(gulp.dest("debug/frontend"));
});

gulp.task("build:test", () => {
    return gulp.src("test/**/*.ts")
        .pipe(tsc(tsTestProject))
        .js.pipe(gulp.dest("debug/"));
});

gulp.task("lint:backend", () => {
    return gulp.src("src/backend/**/**.ts")
        .pipe(tslint({}))
        .pipe(tslint.report("verbose"));
});

gulp.task("istanbul:hook", () => {
    return gulp.src(["debug/backend/**/*.js", "!debug/backend/**/*.spec.js"])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["istanbul:hook"], () => {
    return gulp.src('debug/backend/**/*.spec.js')
        .pipe(mocha({ui: 'bdd'}))
        .pipe(istanbul.writeReports());
});