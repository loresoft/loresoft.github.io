# LoreSoft.com

A Hugo-powered website showcasing software development projects and technical articles.

## About

This is the source code for [loresoft.com](https://loresoft.com), a personal website featuring blog posts about software development, open source projects, and technical tutorials.

## Built With

- [Hugo](https://gohugo.io/) - Static site generator
- Custom theme and layouts
- Markdown content

## Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (extended version recommended)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/username/loresoft.com.git
   cd loresoft.com
   ```

2. Start the development server:

   ```bash
   hugo server -D
   ```

3. Open your browser and navigate to `http://localhost:1313`

## Development

### Project Structure

```text
├── archetypes/          # Content templates
├── content/             # Markdown content files
│   ├── post/           # Blog posts
│   └── *.md            # Static pages
├── data/               # Data files
├── layouts/            # HTML templates
│   ├── _partials/      # Partial templates
│   └── post/           # Post-specific layouts
├── static/             # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   └── images/         # Images and media
└── hugo.toml           # Hugo configuration
```

### Creating New Content

Create a new blog post:

```bash
hugo new post/my-new-post.md
```

Create a new page:

```bash
hugo new about.md
```

### Building for Production

Generate the static site:

```bash
hugo
```

The generated site will be in the `public/` directory.

## Content

The site features articles on:

- .NET development
- Open source projects
- Software architecture
- Development tools and frameworks
- Technical tutorials

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
