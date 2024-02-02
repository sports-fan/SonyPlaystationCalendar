# Sony Playstation Calendar
## Libraries
react, react-router-dom, axios, date-fns, jest

## Features
- The calendar renders events in the “Monthly” view (according to the desin).
- The events fetch via an AJAX call is implemented from http://amock.io/. I used data from events.json file.
- Used Flexbox and CSS Grid to render and style the calendar.
- Provided a ‘Previous’ and ‘Next’ button to allow navigation between months.
- Created a client-side algorithm for event placement within the calendar cells using the data in events.json and the images provided.
- Clicking on a calendar event opens a simple view (as per the design) showing details of the event if it has an event.
- The calendar is URL driven. Visiting an invalid date redirects to the current month(Febrary 2024)
- Wrote unit tests using Jest.

I am not sure if I impelemented everything as required. I placed each event content between 2nd and 3rd week so that user can see it in the middle of the page. I think it's more user-friendly than that of the content below its event. 
Looking forward to your feedback. Thank you
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
