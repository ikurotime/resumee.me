# Resumee.me

Resumee.me is a modern, interactive platform for creating and sharing professional profiles. It allows users to showcase their skills, projects, and career journey through a customizable, single-page resume website.

## Features

- **Unique Profile Links**: Users can claim a personalized URL (e.g., resumee.me/your-name).
- **Interactive CV Builder**: Drag-and-drop interface for creating and customizing resume sections.
- **Dynamic Blocks**: Various block types including projects, technologies, social integrations, and custom text.
- **Social Media Integration (URLs)**: Connect and display content from various social platforms.
- **Real-time Updates**: Changes are saved and reflected instantly.
- **User Authentication**: Secure sign-up and login process, including Google OAuth.
- **Profile Sharing**: Easy sharing options, including direct Twitter integration.

## Technologies Used

- **Frontend**:
  - Next.js 14 (React framework)
  - TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Radix UI for accessible component primitives

- **Backend**:
  - Supabase for database and authentication
  - Next.js API routes for serverless functions

- **State Management**:
  - React Context API

- **Other Libraries**:
  - react-grid-layout for drag-and-drop functionality
  - react-color for color picking
  - Lucide React for icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/`: Next.js app directory containing pages and layouts
- `components/`: Reusable React components
- `contexts/`: React context providers
- `actions/`: Server-side actions and API routes
- `utils/`: Utility functions and helpers
- `types.ts`: TypeScript type definitions

## Roadmap

1. **Enhanced Customization**
   - [ ] More block types (e.g., skills chart, timeline)
   - [ ] Custom themes and color schemes
   - [ ] Font customization

2. **Improved Social Integration**
   - [ ] Automatic content import from linked platforms
   - [ ] Analytics for profile views and interactions

3. **SEO Optimization**
   - [ ] Custom meta tags for each profile
   - [ ] Sitemap generation

4. **Advanced Features**
   - [ ] Multiple page support
   - [ ] PDF export of resume
   - [ ] Custom domain mapping

5. **Performance Enhancements**
   - [ ] Image optimization
   - [ ] Lazy loading of components

6. **Collaboration Features**
   - [ ] Sharing profiles with specific permissions
   - [ ] Team/company profiles

7. **Monetization**
   - [ ] Premium features for paid users
   - [ ] Custom branding options for businesses

8. **Localization**
   - [ ] Multi-language support
   - [ ] Region-specific resume formats

9. **Mobile App**
   - [ ] Develop companion mobile app for on-the-go editing

10. **AI Integration**
    - [ ] AI-powered resume suggestions
    - [ ] Automated content generation based on user input

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.
