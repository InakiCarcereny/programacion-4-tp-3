module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],

    "body-max-line-length": [2, "always", 100],

    "footer-leading-blank": [2, "always"],

    "header-max-length": [2, "always", 85],

    "scope-case": [2, "always", "lower-case"],

    "subject-case": [2, "never", ["upper-case"]],

    "subject-empty": [2, "never"],

    "subject-full-stop": [2, "never", "."],

    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "build",
        "chore",
        "revert",
      ],
    ],
  },
};
