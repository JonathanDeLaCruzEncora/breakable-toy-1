# Breakable Toy I - by Jonathan Eduardo De La Cruz Soto

This is a to-do app ✅, where you can add tasks that can have names, due dates, and priorities; the app displays tasks on a table where you can manipulate the sorting method, but also filters can be applied during a search , as well as calculating the average time it takes to complete this tasks based on the time of creation of each one.

The app was made with React and Next.js in the frontend 🖥️, Tailwind to help with the styling process 🎨 and also Java and Spring Boot for the backend 🛠️.

> [!TIP]
> There exist both light mode ☀️ and dark mode 🌙, so give it a look! (it changes with system's theme).

> [!NOTE]
> If you want to use sample data... uncomment the line 28 in the next file and restart the backend: `backend/src/main/java/com/example/backend/controller/TaskController.java`

## Requirements

> The commands to fulfill the requirements are done using **_Homebrew_**, you can still install all the requirements by other methods, but if you want to follow the instructions and don't have Homebrew (MacOS or Linux), go to 👉 [brew.sh](https://brew.sh)

In order to run this app, you will need the following tools (if they are already installed, there is no need to run their commands):

- **Node.js** : _Required to run Next.js in the frontend<br>_
  `brew install node`

- **Java (JDK)** : _Required for the backend<br>_
  `brew install openjdk`

- **Maven**
  _Required for Spring Boot <br>_
  `brew install maven`

- **Git** : _For cloning the repository<br>_
  `brew install git`

## Running the app

First clone the git repository <br>
`git clone https://github.com/JonathanDeLaCruzEncora/breakable-toy-1`

### Backend

1. To run the backend go to its directory:
   `cd backend`

2. The next command will install the necessary dependencies:
   `mvn clean install`

3. Once the last command has finished, run the next line to start the backend:
   `mvn spring-boot:run`

### Frontend

1. To run the frontend go to its directory:
   `cd frontend`

2. The next command will install the necessary dependencies:
   `npm install`

3. Once the last command has finished, run the next lines to build and start the frontend:
   `npm run build`
   `npm run start`

After this the app should be running 🙏.
