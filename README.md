# Gutenberg Blocks Plugin

A lightweight WordPress plugin that adds a collection of custom Gutenberg blocks to the editor.

## Pre-requisites

**To use this plugin, you’ll need:**

- WordPress 5.8 or higher (with Gutenberg enabled)
- PHP 7.3.5 or higher
- A theme that supports the block editor

**If you're developing or building the plugin from source, you'll also need:**

- Node.js (version 20.10.0 or higher recommended)
- npm (comes with Node.js)
- Git (if cloning from a repository)

## Installation

Open your terminal or command line

- For macOS:

  - cd into the plugins directory relative to where you are in the terminal (If you are using Local, it would be in: Local Sites/aspectusroi/app/public/wp-content/plugins)
  - Clone the repository into the plugins folder: `git clone https://github.com/mmellows1/aspectus-blocks.git`
  - Run:
    - `cd aspectus-blocks`
    - `npm install`
    - `npm run build`
  - This will build out everything for you. For ongoing development, run:
    - `npm run start`

- For Windows:
  - Open Command Prompt or PowerShell
  - Navigate to your plugins directory. For example: `cd "C:\Users\YourName\Local Sites\aspectusroi\app\public\wp-content\plugins"`
  - Clone the repository: `git clone https://github.com/mmellows1/aspectus-blocks.git`
  - Move into the plugin directory: `cd aspectus-blocks`
  - Install dependencies and build:
    - `npm install`
    - `npm run build`
    - For ongoing development with live reloading: `npm run start`
