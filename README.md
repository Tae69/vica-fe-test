## Background

The purpose of this project is to create an web application for user to borrow books, it will also have pages to manage users and books. To know available users for login please check `src/mocks/usersData.ts`.

## Assumption
Because this is front-end focused, all the data provided will be hardcoded and API will be mocked inside `src/mocks`. Some implementation inside that folder isn't built for perfomance/security like filtering/storing/token generation. Those all backend stuff and should be ignored for now. Also because the data is stored as JS files and provided each time user load the page, the data will be resetted each time user do the refresh because there is no backend services.

## Getting started
 - Run `npm install`
 - For development run `npm run start`.
 - For production build run `npm run build`.

## Project file structure

    .
    ├── public                   # React public folder
    ├── src                      # Source files
        ├── components           # React components
        ├── enums                # Enums files.
        ├── hooks                # Custom hooks.
        ├── mocks                # Storing hardcoded API and its datas.
        ├── pages                # Pages component, contains ogin page, listing page, edit page, etc.
        ├── reducers             # Redux reducers
        ├── store                # Redux store
        ├── theme                # Material UI theme file, can store multiple themes.
        ├── utils                # Helper scripts.

## Redux store setup
In Redux setup, we will have 3 slices:
  - `userSlice`: That stores logged in user detail (token and user information), it will have actions to `login` and `logout` user.
  - `borrowSlice`: Stores borrowed books and its borrower, ideally on real implementation this should be stored at backend and provide service to front end to get those data. But we do that here just for demonstration. It will have actions to `borrow` and `return` books.
  - `notificationSlice`: Store notification/alert to be shown to user. It will have actions to `open` and `close` notification.

All those slices will be stored in `src/reducers` folder. Lastly, we will create the index store at `src/store/index.ts` and configure the store there. Additionally, we also create custom `dispatch` and `select` hooks in `src/hooks/redux.ts` for better TS support.

## Code Implementation
Based on the requirements, we need several pages for login, managing users, managing books, and analytics. We use those libraries:
 - For navigating between those pages, we use `react-router`
 - For client side routing.
 - For UI we use Material UI.
 - ChartJS for analytics page.
 - ESLint with Airbnb style for linting, some rules are customized in `.eslintrc.json`.
 - Prettier for code formatting, some rules are customized in `.prettierrc`.

#### - Mock data implementation
All the data and API mocks are stored in `src/mocks`. Mocks data naming will be `__Data.ts` e.g `usersData.ts` for storing user hardcoded data and API will be named with `__Api.ts` format. Each API will have endpoint for CRUD its respective data.

Each API endpoint also always return `Promise` to simulate front-end network request as close as possible.

#### Login implementation
Login feature is implemented simply by providing text inputs for username and password. It will trigger error when the inputs are empty or users not found. For each error from API, it will be instantiated through `ApiError` class so we know if the error is syntax error or API error. For the latter we will show the API error message, else we show general unexpected error.

If the API login succeeded, we will navigate to `/` root path aka `/books` book listing page.

### Book management implementation
For any routes that requires logged in user, we will wrap the element using `RequireAuth` component, `RequireAuth` will then check if the user is logged using `user` redux state. If not logged in then we will redirect to login page.

When book listing page is rendered, it will make network requests to book listing API. Ideally the data fetching in listing pages such as filtering, pagination and sorting should be implemented in backend. But because we are demonstrating only front end, the API will return complete set of data and pagination and sorting will be implemented on client side. Sorting logic is stored in `src/utils/helper.ts`.

We will use Material UI Table for displaying table, it also supports sorting and pagination. When users do actions such as `borrow`, `return`, `edit`, or `delete` books, the implementation will be provided by `src/pages/Books.tsx` component. The parent component will then do the appropriate actions (validating -> API request -> navigating). If it got errors, it will dispatch the message to notification store.

For create/edit books (both are using same component `NewOrEditBook.tsx`), the same flow applied with addtional validation added before submitting data. Here is the validation for books data:
  - Title, authors, and genre must be more than 4 characters.
  - Description is optional and must not exceed 400 characters.
  - Number of copies must not be zero or negative values.
  - Year published must be more than year 100 and not future year.

Removing books will not be allowed when books are being borrowed by users. Books can't be borrowed when number of copies remaining (after substracting borrowed books) is zero or availability is off. Each user can only borrow unique books, can't borrow same book.

When book is borrowed we will update redux store and API, and update remaining copies available. When book is returned we will add it back. User with `Member` role can only borrow/return books, whileas user with `Admin` or `Editor` role will have additional access to create/update/delete books.

For user listing page, same flow is applied (like book listing page) except the actions to create/update/delete will only available to `Admin` role. Create/Edit user also have validation rules:
  - Name and password must be more than 4 characters.
  - Date joined must not be future date.

For analytics, it just displays two horizontal bar charts; one is books by genre and the other is books by year published. The data will be presented by showing the largest count first. Data is sorted by API and returned to the component to display.

# Scalability
Following separation of concern, I separate to folder so each folder can have its own responsibility. Like `pages` folder will store only page component, and reusable/small componnents will be stored in `components`. When project became more complex it might be better to split the files into more detailed folder/responsibility, like providing `routes`, `errors`, etc folders.
