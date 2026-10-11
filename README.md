# Movie Jar

Movie Jar is a mobile app that helps users choose a movie to watch.
Users save movies in a personal jar and tap “Shake the jar”
to randomly pick a movie.

This app is an individual school project. The interface is in English.

## Features

- Browse and search for movies from TMDB.
- Filter movies by genre.
- View movie details, including the title, poster and description.
- Add and remove movies in My jar.
- Randomly pick a saved movie using the selected genre filter.
- Keep saved movies between app launches with AsyncStorage.
- View TMDB attribution on the About screen.

## Tech stack

- React Native with Expo SDK 57.
- JavaScript.
- Expo Router for navigation.
- TMDB API for movie data and posters.
- Redux Toolkit and React Redux for shared jar state.
- AsyncStorage for local data persistence.
- Expo Image for the TMDB SVG logo.

Type checking is used with JavaScript and JSDoc comments.

## Requirements

- Node.js and npm. Development was tested with Node.js 24.18.0
  and npm 11.16.0.
- Expo Go with support for Expo SDK 57 on a phone.
- A TMDB account and an API Read Access Token.

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/SoftLookingOtter/movie-jar.git
cd movie-jar
npm ci
```

## API setup

Get your API Read Access Token from your TMDB account settings.

Create a file named `.env.local` in the project root:

```env
EXPO_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token
```

Replace the placeholder with your own token.

`.env.local` is ignored by Git. Do not commit your token or paste it
into this README.

Expo includes EXPO_PUBLIC values in the app bundle, where they can
be read by users. Token protection needs further review before
public distribution.

## Running the app

Start the development server:

```bash
npx expo start
```

Connect your phone and computer to the same Wi-Fi network.
Scan the QR code shown in the terminal to open the project in Expo Go.

An internet connection is required to fetch movie data from TMDB.

## Development checks

Run lint and JavaScript type checking:

```bash
npx expo lint App.js index.js services src
npx tsc --noEmit
```

Check the Expo configuration and compatible package versions:

```bash
npx expo-doctor
CI=1 npx expo install --check
```

Review known dependency vulnerabilities:

```bash
npm audit
```

## Current limitations

- The catalogue loads one page of movies at a time. The genre filter
  applies to that page, rather than the entire TMDB catalogue.
- Saved movies are stored locally on the device.
- A random pick can return the same movie again.
- The interface is a basic version and visual improvements are planned.

## Dependency review

On 2026-10-11, npm audit reported 28 affected packages:
18 high and 10 moderate, originating from four underlying advisories.

The reports include development/build tools and a URL-decoding issue
in a dependency used by Expo Router.

Expo Doctor passed all 21 checks, and Expo's version check reported
that dependencies were up to date. Security warnings remain unresolved.

Automatic fixes propose incompatible Expo/Router versions.
Do not run npm audit fix --force without reviewing compatibility.

ESLint 9 is no longer officially supported. Dependency updates and
token protection need further review before public distribution.

## Attribution

Movie data and posters are provided by
[The Movie Database (TMDB)](https://www.themoviedb.org).

This product uses the TMDB API but is not endorsed or certified by TMDB.

The app's About screen displays an official TMDB logo and this notice.
