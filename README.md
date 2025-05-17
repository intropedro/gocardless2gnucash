# GoCardless2GnuCash

A tool to fetch transactions from GoCardless and generate OFX files compatible with GnuCash.

## Prerequisites

- Node.js (v16 or higher recommended)
- Yarn package manager

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gocardless2gnucash.git
   cd gocardless2gnucash
   ```

2. Create a `.env` file in the root directory with the following content. Replace the placeholders with your GoCardless credentials:
   ```plaintext
   GOCARDLESS_CLIENT_ID=your_client_id
   GOCARDLESS_CLIENT_SECRET=your_client_secret

   GOCARDLESS_ACCESS_TOKEN=
   GOCARDLESS_ACCESS_TOKEN_EXPIRES_AT=
   GOCARDLESS_REFRESH_TOKEN=
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

## Usage

Run the interactive menu:
```bash
yarn run menu
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
