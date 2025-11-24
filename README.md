# 🍽️ YumYum Frontend

YumYum Frontend is a modern Next.js application for browsing, searching, and filtering recipes.  
It integrates with the [YumYum Backend API](https://nodejs-hw-zdyd.onrender.com/api-docs/), uses React Query for data fetching, Zustand for state management, and Radix for custom dropdowns and popovers. More information regarding Backend in [this repository](https://github.com/AlejandroMotyl/yumyum-backend).

---

## ✨ Features

- Home page with hero section and pre-fetched recipes (SSR + hydration)
- Search recipes by keyword
- Filter by:
  - Category
  - Ingredient
- Combined global filters (Zustand) + search box
- Custom dropdowns built on **Radix Popover** (scroll-friendly, no scroll lock)
- Responsive filter behavior:
  - Desktop: inline dropdown filters
  - Mobile: toggled filters panel
- Paginated recipe list with smooth scroll reset
- Recipe cards grid with truncated titles/descriptions
- “No results” state with a dedicated component
- Toast notifications (iziToast)
- Form handling and validation with Formik + Yup
- SEO-friendly metadata via `generateMetadata` (Next.js App Router)

---

## 📸 Screenshots

| Main Page                                                                                                 | Search & Filters                                                                                                  | Recipes Grid                                                                                                  |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [<img src="./public/screenshots/main-page-min.png" width="300"/>](./public/screenshots/main-page-min.png) | [<img src="./public/screenshots/search-filter-min.png" width="300"/>](./public/screenshots/search-filter-min.png) | [<img src="./public/screenshots/recipe-grid-min.png" width="300"/>](./public/screenshots/recipe-grid-min.png) |

| Recipe Details                                                                                                      | Register                                                                                                | Login                                                                                             |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [<img src="./public/screenshots/recipe-details-min.png" width="300"/>](./public/screenshots/recipe-details-min.png) | [<img src="./public/screenshots/register-min.png" width="300"/>](./public/screenshots/register-min.png) | [<img src="./public/screenshots/login-min.png" width="300"/>](./public/screenshots/login-min.png) |

| Add Recipe                                                                                                  | User Profile                                                                                                | Logout                                                                                              |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [<img src="./public/screenshots/add-recipe-min.png" width="300"/>](./public/screenshots/add-recipe-min.png) | [<img src="./public/screenshots/my-profile-min.png" width="300"/>](./public/screenshots/my-profile-min.png) | [<img src="./public/screenshots/logout-min.png" width="300"/>](./public/screenshots/logout-min.png) |

## 🛠 Installation

- Copy repo locally
- npm install
- customize your .env with proper values

## 🧱 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, CSS Modules, modern-normalize
- **State management:** Zustand
- **Data fetching & caching:** @tanstack/react-query
- **UI primitives:** Radix UI (Popover + Select, later migrated)
- **Forms & validation:** Formik + Yup
- **Notifications:** iziToast
- **Pagination:** react-paginate

---

## 📦 Key Dependencies

These are the main packages that will be installed via `npm install`:

### Runtime dependencies

| Package                   | Version | Purpose                                                         |
| ------------------------- | ------- | --------------------------------------------------------------- |
| `@radix-ui/react-popover` | ^1.1.15 | Accessible popover primitive used for custom select dropdowns   |
| `@radix-ui/react-select`  | ^2.2.6  | Radix Select (initially used, parts may be replaced by Popover) |
| `@tanstack/react-query`   | ^5.90.7 | Data fetching, caching, and server-state management             |
| `axios`                   | ^1.13.2 | HTTP client for calling the YumYum backend API                  |
| `cookie`                  | ^1.0.2  | Parsing and serializing cookies on the client                   |
| `cookies`                 | ^0.9.1  | Additional cookie utilities (SSR and server-side use)           |
| `formik`                  | ^2.4.9  | Form state management (e.g., auth forms, inputs)                |
| `izitoast`                | ^1.4.0  | Toast notifications (success, errors, info)                     |
| `modern-normalize`        | ^3.0.1  | Opinionated CSS reset for consistent styling                    |
| `next`                    | 16.0.1  | React framework (App Router, routing, SSR, etc.)                |
| `react`                   | 19.2.0  | UI library                                                      |
| `react-dom`               | 19.2.0  | React DOM renderer                                              |
| `react-paginate`          | ^8.3.0  | Pagination UI component for recipes list                        |
| `yup`                     | ^1.7.1  | Schema-based validation (used with Formik)                      |
| `zustand`                 | ^5.0.8  | Lightweight global state (filters store, search store, etc.)    |

### Dev dependencies

| Package                          | Version | Purpose                                              |
| -------------------------------- | ------- | ---------------------------------------------------- |
| `@tanstack/react-query-devtools` | ^5.90.2 | Devtools overlay for React Query debugging           |
| `@types/node`                    | ^20     | TypeScript types for Node.js                         |
| `@types/react`                   | ^19     | TypeScript types for React                           |
| `@types/react-dom`               | ^19     | TypeScript types for ReactDOM                        |
| `babel-plugin-react-compiler`    | 1.0.0   | React Compiler plugin (performance / DX)             |
| `eslint`                         | ^9      | Linting                                              |
| `eslint-config-next`             | 16.0.1  | Next.js ESLint rules                                 |
| `eslint-config-prettier`         | ^10.1.8 | Disable formatting rules that conflict with Prettier |
| `prettier`                       | ^3.6.2  | Code formatter                                       |
| `typescript`                     | ^5      | TypeScript compiler and typings                      |

---

## 📄 License

This project is licensed under the MIT License.  
You are free to use, modify, and distribute this code for learning or personal projects.

See the `LICENSE` file for details.

## 👥 Contributors [![Contributors](https://img.shields.io/github/contributors/AlejandroMotyl/yumyum-backend.svg)](https://github.com/AlejandroMotyl/yumyum-backend/graphs/contributors)

Thanks to all amazing members of the YumYum team!

<table>
  <tr>
    <td align="center"><a href="https://github.com/mad-jules"><img src="https://avatars.githubusercontent.com/mad-jules" width="70px;" alt=""/><br /><sub><b>mad-jules</b></sub></a></td>
    <td align="center"><a href="https://github.com/JustSanya1"><img src="https://avatars.githubusercontent.com/JustSanya1" width="70px;" alt=""/><br /><sub><b>JustSanya1</b></sub></a></td>
    <td align="center"><a href="https://github.com/Sasha-Velikorod"><img src="https://avatars.githubusercontent.com/Sasha-Velikorod" width="70px;" alt=""/><br /><sub><b>Sasha-Velikorod</b></sub></a></td>
    <td align="center"><a href="https://github.com/yehor-lytovchenko"><img src="https://avatars.githubusercontent.com/yehor-lytovchenko" width="70px;" alt=""/><br /><sub><b>yehor-lytovchenko</b></sub></a></td>
    <td align="center"><a href="https://github.com/RocketReact"><img src="https://avatars.githubusercontent.com/RocketReact" width="70px;" alt=""/><br /><sub><b>RocketReact</b></sub></a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/artem-v20"><img src="https://avatars.githubusercontent.com/artem-v20" width="70px;" alt=""/><br /><sub><b>artem-v20</b></sub></a></td>
    <td align="center"><a href="https://github.com/Djakyz"><img src="https://avatars.githubusercontent.com/Djakyz" width="70px;" alt=""/><br /><sub><b>Djakyz</b></sub></a></td>
    <td align="center"><a href="https://github.com/usernameRuslant"><img src="https://avatars.githubusercontent.com/usernameRuslant" width="70px;" alt=""/><br /><sub><b>usernameRuslant</b></sub></a></td>
    <td align="center"><a href="https://github.com/vitalii-cherukha"><img src="https://avatars.githubusercontent.com/vitalii-cherukha" width="70px;" alt=""/><br /><sub><b>vitalii-cherukha</b></sub></a></td>
    <td align="center"><a href="https://github.com/alex-dmytriev"><img src="https://avatars.githubusercontent.com/alex-dmytriev" width="70px;" alt=""/><br /><sub><b>alex-dmytriev</b></sub></a></td>
  </tr>
</table>
