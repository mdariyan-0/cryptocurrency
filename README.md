# Cryptocurrency Dashboard & Tracker

A modern, interactive React web application designed to track cryptocurrency prices, market volumes, and percentage changes. It features a fully functional watchlist, dynamic sorting, and real-time price animation indicators.

## Features

- **Real-time Price Indicators:** Table cells flash green or red to instantly indicate when a coin's price has increased or decreased.
- **Interactive Watchlist:** Easily add or remove your favorite cryptocurrencies to a dedicated watchlist using global state.
- **Advanced Data Tables:** Built with TanStack Table to support robust pagination and multi-column sorting.
- **Global Notifications:** Integrated toast notifications to alert users when a coin is added or removed from the watchlist.
- **Responsive UI:** Styled entirely with Tailwind CSS for a sleek, dark-mode financial dashboard aesthetic.

## Tech Stack

- **Framework:** React
- **State Management:** Redux Toolkit (Slices for Data, Watchlist, and Toasts)
- **Data Grid:** @tanstack/react-table (v8)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Installation and Setup

1. Clone the repository to your local machine:

```bash
git clone <your-repository-url>
cd cryptocurrency
```

2. Install the required dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `src/components/` - Contains all reusable UI components (Coin, Toast, etc.).
- `src/components/home/` - Contains the main dashboard views (Dashboard, Watchlist, Leaderboard).
- `src/redux/` - Contains Redux store configuration and state slices.

## License

This project is licensed under the MIT License.
