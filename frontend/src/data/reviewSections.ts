export interface ReviewSection {
  id: string;
  title: string;
  group: string;
  route: string;
  files: string[];
  current: string;
  suggestion: string;
  questions: string[];
}

export const reviewSections: ReviewSection[] = [
  {
    id: 'structure', title: 'Page structure', group: 'Start here', route: '/',
    files: ['pages/Me.tsx', 'components/Navigation.tsx'],
    current: 'The Me page combines an introduction, experience, a large photo carousel, location map, click counter, quote, and music widget. Projects have their own page; /work also has a separate project listing.',
    suggestion: 'Lead with a short introduction and selected work. Group career details together, then put personal photos and extras in a quieter About section. Choose one project listing.',
    questions: ['Who should this portfolio speak to first: recruiters, collaborators, or friends?', 'Which three things should someone remember after a quick visit?']
  },
  {
    id: 'intro', title: 'Introduction & current info', group: 'Your story', route: '/',
    files: ['pages/Me.tsx', 'components/AnimatedHeading.tsx'],
    current: 'An animated greeting sits above a long list covering age, a 2A Waterloo term, a summer role at StackAdapt, engineering interests, trading, career goals, and hobbies.',
    suggestion: 'Use one clear headline and a two-sentence introduction. Keep education and current role together; move interests lower down. Confirm the term and employer before updating them.',
    questions: ['What is your current school term and role?', 'What headline and short bio would you like people to see?']
  },
  {
    id: 'experience', title: 'Experience', group: 'Your work', route: '/',
    files: ['components/Experience.tsx'],
    current: 'Experience lists StackAdapt (May 2025–Present), Micromart (Aug–Dec 2025), Turing (Jan–Apr 2025), and Gradiant / Synauta (Sep 2023–Jan 2024). These dates need your confirmation.',
    suggestion: 'Order roles by actual dates and give each one a clear title, dates, and one or two concrete outcomes. Avoid duplicating the full timeline in the introduction.',
    questions: ['Which roles and dates need correcting or adding?', 'What were your strongest contributions in each role?']
  },
  {
    id: 'projects', title: 'Project selection & cards', group: 'Your work', route: '/projects',
    files: ['data/projects.ts', 'pages/Projects.tsx', 'components/ProjectsSection.tsx'],
    current: 'The main Projects page reads shared project data with titles, descriptions, tags, metrics, and links. The separate Work page uses another project component.',
    suggestion: 'Choose a small set of strongest projects. Keep cards to a title, short problem statement, your contribution, and a few technologies; put detail in the case study.',
    questions: ['Which projects should be featured, removed, or added?', 'Which links, technologies, and results need updating?']
  },
  {
    id: 'details', title: 'Project case studies', group: 'Your work', route: '/projects/chatterbox',
    files: ['pages/ProjectDetail.tsx', 'data/projects.ts'],
    current: 'Project pages include concise overviews, architecture diagrams, and expandable technical sections. ChatterBox is one existing case study.',
    suggestion: 'Use a consistent sequence: problem, what you built, key decisions, results, and links. Trim repeated technology lists and explain your own contribution.',
    questions: ['Which project should we rewrite first?', 'What evidence or screenshots would make the project easier to understand?']
  },
  {
    id: 'personal', title: 'Photos & personal interests', group: 'Your personality', route: '/',
    files: ['pages/Me.tsx', 'components/StockTicker.tsx'],
    current: 'A ten-photo carousel appears beside experience. Trading tickers, gaming, fitness, basketball, and career aspirations appear in the introduction.',
    suggestion: 'Keep personality, but give it a dedicated space. Consider one portrait on the main page and a smaller optional gallery for travel and personal photos.',
    questions: ['Which photos and interests should stay public?', 'Would you prefer a dedicated About page or a compact section?']
  },
  {
    id: 'widgets', title: 'Map, music & extras', group: 'Your personality', route: '/',
    files: ['pages/Me.tsx', 'components/CurrentCityMap.tsx', 'components/SpotifyWidget.tsx', 'components/ClickButton.tsx', 'components/CodeQuote.tsx'],
    current: 'The homepage includes an interactive map, a click counter, daily quote, and full-width Spotify widget, adding several competing focal points.',
    suggestion: 'Choose one or two signature extras. Put them in a compact personal section or footer so your work stays easy to find.',
    questions: ['Which widgets do you actually want to keep?', 'Should they be collapsed, moved lower, or removed?']
  },
  {
    id: 'finish', title: 'Navigation, contact & polish', group: 'Finish up', route: '/',
    files: ['components/Navigation.tsx', 'components/Footer.tsx', 'components/SocialIcons.tsx', 'index.css'],
    current: 'Navigation includes Me, Resume, and Projects. The site supports light and dark themes and mobile layouts; much of the styling is defined inside components.',
    suggestion: 'Use clear navigation labels and one primary contact action. Check the resume, social links, spacing, text hierarchy, and mobile layout after the content decisions.',
    questions: ['What should the primary action be: email, resume, or LinkedIn?', 'What visual direction do you want: minimal, editorial, or playful?']
  }
];
