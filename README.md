# Matchmaker

This project uses a React frontend, powered by a Flask backend, featuring a database using MongoDB. We chose this tech stack because we had already used React and MongoDB in 308 assignments so it made sense for us to build on our existing experience. We chose to use Flask for our backend because we all have intermediate experience with Python from previous courses.

## Getting Started for Developers

### Clone the repository

git clone https://github.com/dnguyen3031/Matchmaker.git

#### Run the frontend

1. npm start
   (if its your first time, you might need to run
   npm install
   )

#### Acceptance Tests

The acceptance test code is fount at Matchmaker\cypress\integration\testing.spec.js

There is no need for prior setup to run the cypress test, simply select the file in cypress and it
will run fully

1. In another terminal, run the following commands:
```
coverage run backend_tests.py
coverage report backend.py
```

#### For Future Collaborators:

Style Guide for JavaScript: https://google.github.io/styleguide/jsguide.html

React/JSX: https://airbnb.io/javascript/react
Python: https://www.python.org/dev/peps/pep-0008/

Code linter/style checkers:

ESLint for JavaScript (frontend)

PyLint for Python (backend)

These checkers will use used via the command line interface.

To use PyLint, install it first here https://www.pylint.org/ and after simple just run "pylint FILENAME.py" to style check your python file!

To use ESLint, follow the directions to install here: https://eslint.org/docs/user-guide/command-line-interface

Now, you can type "eslint file1.js file2.js" to check styles

Figma Storyboard:
https://www.figma.com/file/4y3sCg0TQH2MPipsPJ9vks/308-Matchmaker-Journey?node-id=0%3A1

## Automated Acceptance Tests
![309_cypress_test_1](https://user-images.githubusercontent.com/26192953/120852651-554a4e80-c52f-11eb-984b-56211bfd9afa.png)
![309_cypress_test_2](https://user-images.githubusercontent.com/26192953/120852725-727f1d00-c52f-11eb-9c40-51eb0e9eb481.png)
![309_cypress_test_3](https://user-images.githubusercontent.com/26192953/120852735-757a0d80-c52f-11eb-8120-d9b1f2a54de1.png)

## Backend Code Coverage Report (50% coverage met)
![final_cc](https://user-images.githubusercontent.com/55599092/120875191-74f96b00-c55f-11eb-8e62-0ab3603a7949.jpg)
obtained after running backend_tests.py, suitable_lobby_tests.py, and team_assignment_tests.py
