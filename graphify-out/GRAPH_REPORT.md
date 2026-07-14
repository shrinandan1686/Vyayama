# Graph Report - .  (2026-07-14)

## Corpus Check
- 33 files · ~99,999 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 371 nodes · 426 edges · 87 communities detected
- Extraction: 77% EXTRACTED · 19% INFERRED · 4% AMBIGUOUS · INFERRED: 82 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Auth & Backend Core|Auth & Backend Core]]
- [[_COMMUNITY_API Service Client Methods|API Service Client Methods]]
- [[_COMMUNITY_FastAPI AI Service Internals|FastAPI AI Service Internals]]
- [[_COMMUNITY_AI Chat Pipeline & Agno Debugging|AI Chat Pipeline & Agno Debugging]]
- [[_COMMUNITY_App Screens & Navigation Flow|App Screens & Navigation Flow]]
- [[_COMMUNITY_Model Policy & Brand Assets|Model Policy & Brand Assets]]
- [[_COMMUNITY_App Sitemap Diagram|App Sitemap Diagram]]
- [[_COMMUNITY_Dashboard Mockup (Dark Neon)|Dashboard Mockup (Dark Neon)]]
- [[_COMMUNITY_AI Coach Chat Mockup|AI Coach Chat Mockup]]
- [[_COMMUNITY_Lifestyle Gym Mockup|Lifestyle Gym Mockup]]
- [[_COMMUNITY_Backend AI Proxy Functions|Backend AI Proxy Functions]]
- [[_COMMUNITY_Premium Design System|Premium Design System]]
- [[_COMMUNITY_Error Boundary Component|Error Boundary Component]]
- [[_COMMUNITY_Hero Abstract Branding|Hero Abstract Branding]]
- [[_COMMUNITY_Fitness Personas Visual|Fitness Personas Visual]]
- [[_COMMUNITY_Favicon Cube Mark (superseded)|Favicon Cube Mark (superseded)]]
- [[_COMMUNITY_Adaptive Icon Placeholder (superseded)|Adaptive Icon Placeholder (superseded)]]
- [[_COMMUNITY_Splash Icon Placeholder (superseded)|Splash Icon Placeholder (superseded)]]
- [[_COMMUNITY_App Icon Placeholder (superseded)|App Icon Placeholder (superseded)]]
- [[_COMMUNITY_Workout Complete Screen|Workout Complete Screen]]
- [[_COMMUNITY_Workout Schedule Logic|Workout Schedule Logic]]
- [[_COMMUNITY_Onboarding Wizard Internals|Onboarding Wizard Internals]]
- [[_COMMUNITY_Tabs Navigator|Tabs Navigator]]
- [[_COMMUNITY_Rest Timer Component|Rest Timer Component]]
- [[_COMMUNITY_App Root|App Root]]
- [[_COMMUNITY_App Navigator|App Navigator]]
- [[_COMMUNITY_Register Screen|Register Screen]]
- [[_COMMUNITY_Profile Screen|Profile Screen]]
- [[_COMMUNITY_Onboarding Screen|Onboarding Screen]]
- [[_COMMUNITY_Home Screen|Home Screen]]
- [[_COMMUNITY_Chat Screen|Chat Screen]]
- [[_COMMUNITY_Login Screen|Login Screen]]
- [[_COMMUNITY_Exercise Detail Screen|Exercise Detail Screen]]
- [[_COMMUNITY_Workout Plan Skeleton|Workout Plan Skeleton]]
- [[_COMMUNITY_Skeleton Loader|Skeleton Loader]]
- [[_COMMUNITY_Screen Wrapper|Screen Wrapper]]
- [[_COMMUNITY_Chart Component|Chart Component]]
- [[_COMMUNITY_AuthContext Test|AuthContext Test]]
- [[_COMMUNITY_useApi Hook|useApi Hook]]
- [[_COMMUNITY_useWorkoutPlan Hook|useWorkoutPlan Hook]]
- [[_COMMUNITY_useActivity Hook|useActivity Hook]]
- [[_COMMUNITY_Server Bootstrap & Atlas Connection|Server Bootstrap & Atlas Connection]]
- [[_COMMUNITY_Workout Plans Route|Workout Plans Route]]
- [[_COMMUNITY_Jest Test Setup|Jest Test Setup]]
- [[_COMMUNITY_Workout Session Screen|Workout Session Screen]]
- [[_COMMUNITY_Exercise Tracker Component|Exercise Tracker Component]]
- [[_COMMUNITY_Todays Workout Card|Todays Workout Card]]
- [[_COMMUNITY_useWorkoutSession Hook|useWorkoutSession Hook]]
- [[_COMMUNITY_useRestTimer Hook|useRestTimer Hook]]
- [[_COMMUNITY_Workout Template Seeder|Workout Template Seeder]]
- [[_COMMUNITY_Sessions Inspector Script|Sessions Inspector Script]]
- [[_COMMUNITY_Agent Inspector Script|Agent Inspector Script]]
- [[_COMMUNITY_Model Checker Script|Model Checker Script]]
- [[_COMMUNITY_Property Check Script|Property Check Script]]
- [[_COMMUNITY_Jest Config|Jest Config]]
- [[_COMMUNITY_Jest Setup (AsyncStorage Mock)|Jest Setup (AsyncStorage Mock)]]
- [[_COMMUNITY_App Entry Index|App Entry Index]]
- [[_COMMUNITY_App Config (LAN IP Fix)|App Config (LAN IP Fix)]]
- [[_COMMUNITY_Babel Config|Babel Config]]
- [[_COMMUNITY_Theme Constants (New Palette)|Theme Constants (New Palette)]]
- [[_COMMUNITY_AppInput Component|AppInput Component]]
- [[_COMMUNITY_AppButton Component|AppButton Component]]
- [[_COMMUNITY_Tag Component|Tag Component]]
- [[_COMMUNITY_GlassCard Component|GlassCard Component]]
- [[_COMMUNITY_API Test|API Test]]
- [[_COMMUNITY_Auth Middleware|Auth Middleware]]
- [[_COMMUNITY_WorkoutPlans Test|WorkoutPlans Test]]
- [[_COMMUNITY_Auth Test|Auth Test]]
- [[_COMMUNITY_Users Test|Users Test]]
- [[_COMMUNITY_Activity Model|Activity Model]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_WorkoutPlan Model|WorkoutPlan Model]]
- [[_COMMUNITY_Exercise Model|Exercise Model]]
- [[_COMMUNITY_Activity Route|Activity Route]]
- [[_COMMUNITY_Auth Route|Auth Route]]
- [[_COMMUNITY_Users Route|Users Route]]
- [[_COMMUNITY_Exercises Route|Exercises Route]]
- [[_COMMUNITY_Chat Route|Chat Route]]
- [[_COMMUNITY_Babel Config Node|Babel Config Node]]
- [[_COMMUNITY_Skeleton Primitive|Skeleton Primitive]]
- [[_COMMUNITY_App Input Node|App Input Node]]
- [[_COMMUNITY_App Button Node|App Button Node]]
- [[_COMMUNITY_Screen Wrapper Node|Screen Wrapper Node]]
- [[_COMMUNITY_Glass Card Node|Glass Card Node]]
- [[_COMMUNITY_Workout Template Model|Workout Template Model]]
- [[_COMMUNITY_Workout Session Model|Workout Session Model]]
- [[_COMMUNITY_Workout Sessions Route|Workout Sessions Route]]

## God Nodes (most connected - your core abstractions)
1. `ApiService` - 40 edges
2. `get_chat_agent()` - 12 edges
3. `AuthProvider()` - 10 edges
4. `POST /generate-plan Endpoint` - 10 edges
5. `Workout Plans Routes (get, create via AI, exercise status, next-day)` - 10 edges
6. `POST /generate-next-day Endpoint` - 9 edges
7. `Express Backend Server (server.js)` - 9 edges
8. `Auth Routes (register / login / get user)` - 9 edges
9. `Agno SqliteDb Session Storage (agent_storage.db / agent_sessions)` - 8 edges
10. `Users Routes (profile GET/PUT, current-day)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AI Integration via Backend Proxy (design note)` --rationale_for--> `chatWithAI (backend HTTP proxy, user session namespacing)`  [INFERRED]
  project_context_summary.md → backend/services/aiService.js
- `AI Health Coach Feature` --conceptually_related_to--> `get_chat_agent()`  [INFERRED]
  README.md → ai-service/main.py
- `AI Health Coach Feature` --references--> `POST /chat Endpoint (chat_with_ai)`  [INFERRED]
  README.md → ai-service/main.py
- `App Icon: Neon 'V' Chevron Mark (icon.png)` --implements--> `Vyayama Premium Design System (community)`  [INFERRED]
  app/assets/icon.png → graphify-out/GRAPH_REPORT.md
- `Favicon: Neon 'V' Chevron Mark (favicon.png)` --implements--> `Vyayama Premium Design System (community)`  [INFERRED]
  app/assets/favicon.png → graphify-out/GRAPH_REPORT.md

## Hyperedges (group relationships)
- **Vyayama V-Mark Brand Identity (icon/adaptive-icon/splash/favicon)** — icon_png_v_mark, favicon_png_v_mark, adaptive_icon_png_v_mark, splash_icon_png_v_mark [INFERRED 0.85]
- **Cost-Gated Model Escalation Workflow (Sonnet default, Fable on approval)** — claudemd_sonnet_default, claudemd_fable_escalation, claudemd_workflow_order [EXTRACTED 1.00]
- **Icon Placeholder-to-Brand-Mark Supersession** — graphreport_favicon_cube_mark, graphreport_adaptive_icon_placeholder, graphreport_splash_icon_placeholder, graphreport_app_icon_placeholder, icon_png_v_mark [INFERRED 0.65]

## Communities

### Community 0 - "Auth & Backend Core"
Cohesion: 0.08
Nodes (41): Activity Mongoose Model (workout log, calories, streak source), Activity Routes (log-workout, stats, weekly), assessUser (proxy to /assess-user, no matching AI endpoint), generateWorkoutPlan (backend HTTP proxy), App Root Component, AppNavigator (auth/onboarding-gated stack), JWT Auth Middleware (x-auth-token verify), Auth Routes (register / login / get user) (+33 more)

### Community 1 - "API Service Client Methods"
Cohesion: 0.07
Nodes (6): ApiService, getApiService(), ApiService Unit Test Suite, useActivity Hook (activity stats + weekly data), useApi Hook (token-bound API service), useWorkoutPlan Hook (fetch/refresh workout plan)

### Community 2 - "FastAPI AI Service Internals"
Cohesion: 0.11
Nodes (29): generateNextDay (backend HTTP proxy), BaseModel, check_models.py (Gemini model availability lister), chat_with_ai(), ChatRequest, DailyWorkout Pydantic Model, DailyWorkout, Exercise (+21 more)

### Community 3 - "AI Chat Pipeline & Agno Debugging"
Cohesion: 0.13
Nodes (24): chatWithAI (backend HTTP proxy, user session namespacing), getChatHistory (backend HTTP proxy), getChatSessions (backend HTTP proxy), resetChatSession (backend HTTP proxy), Chat Routes (proxy to AI coach), inspect_agent.py (Agent run + storage upsert probe), inspect_sessions.py (Agno DB session-listing probe), Inspection Output: Agent attribute dump ('Agent HAS NO storage attribute') (+16 more)

### Community 4 - "App Screens & Navigation Flow"
Cohesion: 0.15
Nodes (19): Chat API Endpoints (/chat, /chat/history, /chat/sessions), PUT /users/profile Endpoint, POST /workout-plans Endpoint, Auth Context, Weekly Activity Bar Chart, AI Coach Chat Screen, Error Boundary, Exercise Detail Screen (+11 more)

### Community 5 - "Model Policy & Brand Assets"
Cohesion: 0.2
Nodes (15): Android Adaptive Icon: Neon 'V' Chevron Foreground (adaptive-icon.png), Cost Optimization Principle, Fable Escalation Rule (approval-gated), Model Usage Policy (CLAUDE.md), Sonnet Default Model Policy, Graphify -> Sonnet -> Fable Workflow Order, Favicon: Neon 'V' Chevron Mark (favicon.png), Adaptive Icon Placeholder (prior description) (+7 more)

### Community 6 - "App Sitemap Diagram"
Cohesion: 0.27
Nodes (10): Vyayama App (Root / App Icon), Home Screen, Home Sub-pages (Unlabeled Nodes), Profile Screen, Profile Sub-pages (Unlabeled Nodes), Search Screen, Search Sub-pages (Unlabeled Nodes), Settings Screen (+2 more)

### Community 7 - "Dashboard Mockup (Dark Neon)"
Cohesion: 0.27
Nodes (10): AI-Generated Mockup Artifacts (Garbled Text: PROFIFILE, HIIT BURN:), Bottom Navigation (Profile, Home, Workouts, Progress, Settings), Dark Theme with Neon Cyan/Purple Visual Style, Vyayama Fitness Dashboard Mockup (Dark Neon Concept), Home Screen (Phone Mockup), Circular Progress Ring Widget, Start Now CTA Button, Steps and Calories Widget Card (520 kcal) (+2 more)

### Community 8 - "AI Coach Chat Mockup"
Cohesion: 0.27
Nodes (10): AI Coach - FitBot, Conversational Chat Interface, Vyayama AI Coach Chat Mockup, Dark Theme Mobile UI with Gradient Bubbles, AI Equipment Analysis Response, Cable Crossover Gym Machine Photo, Leg Day Workout Plan, Photo-Based Equipment Query (+2 more)

### Community 9 - "Lifestyle Gym Mockup"
Cohesion: 0.31
Nodes (9): Bottom Tab Navigation (Home, Fitness, Stats, Settings), Dark Theme with Neon Cyan Accent Styling, Fitness App Home Screen UI, Gym Environment Context (Equipment, Neon Signage, Fitness Tracker Wristband), Vyayama Lifestyle Mockup (Phone in Gym), Start Workout Call-to-Action (Ring + Button), Daily Stats Metrics (Percentage and Step Count), Vyayama Fitness App (+1 more)

### Community 10 - "Backend AI Proxy Functions"
Cohesion: 0.25
Nodes (0): 

### Community 11 - "Premium Design System"
Cohesion: 0.29
Nodes (8): Deep Purple (#4D008C), Glassmorphism Dark Aesthetic, Inter Regular (Body Typeface), Pitch Black (#000000), Vyayama Premium Design System, Syne Bold (Display Typeface), Vibrant Neon Blue (#00F0FF), Vyayama App

### Community 12 - "Error Boundary Component"
Cohesion: 0.33
Nodes (1): ErrorBoundary

### Community 13 - "Hero Abstract Branding"
Cohesion: 0.47
Nodes (6): Blue-Purple Neon Color Palette, Dark Near-Black Background Aesthetic, Flowing Energy Wave Motif, Vyayama Hero Abstract Background Image, Movement and Energy Concept, Vyayama App

### Community 14 - "Fitness Personas Visual"
Cohesion: 0.73
Nodes (6): Advanced Persona (Gymnast Handstand Figure), Beginner Persona (Standing Figure), Fitness Level Progression Concept, Fitness Levels: An Editorial (Personas Visual), Intermediate Persona (Running Figure), Vyayama User Personas

### Community 15 - "Favicon Cube Mark (superseded)"
Cohesion: 0.47
Nodes (6): Isometric Cube Stack Motif, Monochrome Black-and-White Geometric Style, Circular/Sphere Accent Element, Building-Blocks / Strength-Stacking Symbolism, Vyayama Fitness App, Vyayama Favicon (Isometric Cube Mark)

### Community 16 - "Adaptive Icon Placeholder (superseded)"
Cohesion: 0.4
Nodes (6): Adaptive Icon Asset, Android Adaptive Icon Format, Concentric Circles Motif, Expo Default Placeholder Icon, Grid Background Pattern, Vyayama App Branding

### Community 17 - "Splash Icon Placeholder (superseded)"
Cohesion: 0.4
Nodes (6): Concentric Circles / Target Motif, Expo Default Placeholder Asset Style, Goal / Focus / Precision Symbolism, Graph-Paper Grid Background, Vyayama Splash Screen Icon, Vyayama Fitness App

### Community 18 - "App Icon Placeholder (superseded)"
Cohesion: 0.5
Nodes (5): Vyayama App Icon, Concentric Circles Motif, Grid Background Pattern, Minimal Placeholder Aesthetic, Vyayama Fitness App Branding

### Community 19 - "Workout Complete Screen"
Cohesion: 0.5
Nodes (2): formatDuration(), WorkoutCompleteScreen()

### Community 20 - "Workout Schedule Logic"
Cohesion: 0.9
Nodes (4): getScheduledWorkout(), getUpcomingWorkout(), mondayOnOrBefore(), startOfDay()

### Community 21 - "Onboarding Wizard Internals"
Cohesion: 0.5
Nodes (0): 

### Community 22 - "Tabs Navigator"
Cohesion: 0.67
Nodes (0): 

### Community 23 - "Rest Timer Component"
Cohesion: 1.0
Nodes (2): formatTime(), RestTimer()

### Community 24 - "App Root"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "App Navigator"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Register Screen"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Profile Screen"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Onboarding Screen"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Home Screen"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Chat Screen"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Login Screen"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Exercise Detail Screen"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Workout Plan Skeleton"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Skeleton Loader"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Screen Wrapper"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Chart Component"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "AuthContext Test"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "useApi Hook"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "useWorkoutPlan Hook"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "useActivity Hook"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Server Bootstrap & Atlas Connection"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Workout Plans Route"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Jest Test Setup"
Cohesion: 1.0
Nodes (2): App Jest Configuration (jest-expo preset), Jest Setup: React Native / Expo Mocks

### Community 44 - "Workout Session Screen"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Exercise Tracker Component"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Todays Workout Card"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "useWorkoutSession Hook"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "useRestTimer Hook"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Workout Template Seeder"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Sessions Inspector Script"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Agent Inspector Script"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Model Checker Script"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Property Check Script"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Jest Config"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Jest Setup (AsyncStorage Mock)"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "App Entry Index"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "App Config (LAN IP Fix)"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Babel Config"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Theme Constants (New Palette)"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "AppInput Component"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "AppButton Component"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Tag Component"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "GlassCard Component"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "API Test"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "Auth Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 66 - "WorkoutPlans Test"
Cohesion: 1.0
Nodes (0): 

### Community 67 - "Auth Test"
Cohesion: 1.0
Nodes (0): 

### Community 68 - "Users Test"
Cohesion: 1.0
Nodes (0): 

### Community 69 - "Activity Model"
Cohesion: 1.0
Nodes (0): 

### Community 70 - "User Model"
Cohesion: 1.0
Nodes (0): 

### Community 71 - "WorkoutPlan Model"
Cohesion: 1.0
Nodes (0): 

### Community 72 - "Exercise Model"
Cohesion: 1.0
Nodes (0): 

### Community 73 - "Activity Route"
Cohesion: 1.0
Nodes (0): 

### Community 74 - "Auth Route"
Cohesion: 1.0
Nodes (0): 

### Community 75 - "Users Route"
Cohesion: 1.0
Nodes (0): 

### Community 76 - "Exercises Route"
Cohesion: 1.0
Nodes (0): 

### Community 77 - "Chat Route"
Cohesion: 1.0
Nodes (0): 

### Community 78 - "Babel Config Node"
Cohesion: 1.0
Nodes (1): App Babel Config (expo preset, strip console in prod)

### Community 79 - "Skeleton Primitive"
Cohesion: 1.0
Nodes (1): Skeleton Loader Primitive

### Community 80 - "App Input Node"
Cohesion: 1.0
Nodes (1): App Input (themed text field)

### Community 81 - "App Button Node"
Cohesion: 1.0
Nodes (1): App Button (primary/secondary/text)

### Community 82 - "Screen Wrapper Node"
Cohesion: 1.0
Nodes (1): Screen Wrapper Layout

### Community 83 - "Glass Card Node"
Cohesion: 1.0
Nodes (1): Glass Card (glassmorphism container)

### Community 84 - "Workout Template Model"
Cohesion: 1.0
Nodes (0): 

### Community 85 - "Workout Session Model"
Cohesion: 1.0
Nodes (0): 

### Community 86 - "Workout Sessions Route"
Cohesion: 1.0
Nodes (0): 

## Ambiguous Edges - Review These
- `FastAPI AI Service App` → `assessUser (proxy to /assess-user, no matching AI endpoint)`  [AMBIGUOUS]
  backend/services/aiService.js · relation: calls
- `property_check.py (Agent db/storage attribute check)` → `Inspection Output: Agent attribute dump ('Agent HAS NO storage attribute')`  [AMBIGUOUS]
  ai-service/inspection_output.txt · relation: references
- `Profile Screen` → `Onboarding Wizard (5-step)`  [AMBIGUOUS]
  app/screens/ProfileScreen.js · relation: references
- `Onboarding Wizard (5-step)` → `Home Screen (workout dashboard)`  [AMBIGUOUS]
  app/screens/HomeScreen.js · relation: references
- `Vyayama App Sitemap Diagram` → `Vyayama App (Root / App Icon)`  [AMBIGUOUS]
  vyayama_sitemap_visual_1770041100856.png · relation: rationale_for
- `Weekly Activity Chart (Steps, Mon-Sun)` → `Circular Progress Ring Widget`  [AMBIGUOUS]
  vyayama_dashboard_mockup_1769952825757.png · relation: conceptually_related_to
- `Gym Environment Context (Equipment, Neon Signage, Fitness Tracker Wristband)` → `Vyayama Fitness App`  [AMBIGUOUS]
  vyayama_lifestyle_mockup_1770040967252.png · relation: rationale_for
- `Fitness Level Progression Concept` → `Vyayama User Personas`  [AMBIGUOUS]
  vyayama_personas_visual_1770038917140.png · relation: conceptually_related_to
- `Concentric Circles Motif` → `Vyayama Fitness App Branding`  [AMBIGUOUS]
  app/assets/icon.png · relation: conceptually_related_to
- `Circular/Sphere Accent Element` → `Building-Blocks / Strength-Stacking Symbolism`  [AMBIGUOUS]
  app/assets/favicon.png · relation: conceptually_related_to
- `Adaptive Icon Asset` → `Vyayama App Branding`  [AMBIGUOUS]
  app/assets/adaptive-icon.png · relation: conceptually_related_to
- `Vyayama Splash Screen Icon` → `Expo Default Placeholder Asset Style`  [AMBIGUOUS]
  app/assets/splash-icon.png · relation: semantically_similar_to
- `Favicon Cube Mark (prior description)` → `Favicon: Neon 'V' Chevron Mark (favicon.png)`  [AMBIGUOUS]
  app/assets/favicon.png · relation: conceptually_related_to
- `Adaptive Icon Placeholder (prior description)` → `Android Adaptive Icon: Neon 'V' Chevron Foreground (adaptive-icon.png)`  [AMBIGUOUS]
  app/assets/adaptive-icon.png · relation: conceptually_related_to
- `Splash Icon Placeholder (prior description)` → `Splash Screen Icon: Neon 'V' Chevron Mark (splash-icon.png)`  [AMBIGUOUS]
  app/assets/splash-icon.png · relation: conceptually_related_to
- `App Icon Placeholder (prior description)` → `App Icon: Neon 'V' Chevron Mark (icon.png)`  [AMBIGUOUS]
  app/assets/icon.png · relation: conceptually_related_to

## Knowledge Gaps
- **54 isolated node(s):** `Returns the fallback mock data.`, `Generate a single next day's workout dynamically.     This allows for progressiv`, `Glassmorphism Dark Mode Design System`, `Progressive PPL Split Rotation and Rest-Day Rule (day % 4 == 0)`, `inspect_sessions.py (Agno DB session-listing probe)` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Root`** (2 nodes): `App()`, `App.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Navigator`** (2 nodes): `AppNavigator.js`, `AppNavigator()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register Screen`** (2 nodes): `RegisterScreen.js`, `RegisterScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Screen`** (2 nodes): `ProfileScreen.js`, `ProfileScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Onboarding Screen`** (2 nodes): `OnboardingScreen.js`, `OnboardingScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Screen`** (2 nodes): `HomeScreen.js`, `HomeScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Screen`** (2 nodes): `ChatScreen.js`, `ChatScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Screen`** (2 nodes): `LoginScreen.js`, `LoginScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Exercise Detail Screen`** (2 nodes): `ExerciseDetailScreen.js`, `ExerciseDetailScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Plan Skeleton`** (2 nodes): `WorkoutPlanSkeleton.js`, `WorkoutPlanSkeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Loader`** (2 nodes): `SkeletonLoader.js`, `SkeletonLoader()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Screen Wrapper`** (2 nodes): `ScreenWrapper.js`, `ScreenWrapper()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chart Component`** (2 nodes): `ChartComponent.js`, `ChartComponent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AuthContext Test`** (2 nodes): `AuthContext.test.js`, `wrapper()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useApi Hook`** (2 nodes): `useApi.js`, `useApi()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useWorkoutPlan Hook`** (2 nodes): `useWorkoutPlan.js`, `useWorkoutPlan()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useActivity Hook`** (2 nodes): `useActivity.js`, `useActivity()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Server Bootstrap & Atlas Connection`** (2 nodes): `server.js`, `connectDB()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Plans Route`** (2 nodes): `workoutPlans.js`, `syncExercise()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jest Test Setup`** (2 nodes): `App Jest Configuration (jest-expo preset)`, `Jest Setup: React Native / Expo Mocks`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Session Screen`** (2 nodes): `WorkoutSessionScreen.js`, `WorkoutSessionScreen()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Exercise Tracker Component`** (2 nodes): `ExerciseTracker.js`, `ExerciseTracker()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Todays Workout Card`** (2 nodes): `TodaysWorkoutCard.js`, `TodaysWorkoutCard()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useWorkoutSession Hook`** (2 nodes): `useWorkoutSession.js`, `useWorkoutSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useRestTimer Hook`** (2 nodes): `useRestTimer.js`, `useRestTimer()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Template Seeder`** (2 nodes): `seedWorkoutTemplates.js`, `seedWorkoutTemplates()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sessions Inspector Script`** (1 nodes): `inspect_sessions.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Agent Inspector Script`** (1 nodes): `inspect_agent.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Model Checker Script`** (1 nodes): `check_models.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Property Check Script`** (1 nodes): `property_check.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jest Config`** (1 nodes): `jest.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Jest Setup (AsyncStorage Mock)`** (1 nodes): `jest-setup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Entry Index`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Config (LAN IP Fix)`** (1 nodes): `config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Babel Config`** (1 nodes): `babel.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Theme Constants (New Palette)`** (1 nodes): `theme.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppInput Component`** (1 nodes): `AppInput.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AppButton Component`** (1 nodes): `AppButton.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tag Component`** (1 nodes): `Tag.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `GlassCard Component`** (1 nodes): `GlassCard.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `API Test`** (1 nodes): `api.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Middleware`** (1 nodes): `authMiddleware.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `WorkoutPlans Test`** (1 nodes): `workoutPlans.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Test`** (1 nodes): `auth.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Test`** (1 nodes): `users.test.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Activity Model`** (1 nodes): `Activity.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (1 nodes): `User.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `WorkoutPlan Model`** (1 nodes): `WorkoutPlan.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Exercise Model`** (1 nodes): `Exercise.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Activity Route`** (1 nodes): `activity.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Route`** (1 nodes): `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Route`** (1 nodes): `users.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Exercises Route`** (1 nodes): `exercises.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Route`** (1 nodes): `chat.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Babel Config Node`** (1 nodes): `App Babel Config (expo preset, strip console in prod)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Primitive`** (1 nodes): `Skeleton Loader Primitive`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Input Node`** (1 nodes): `App Input (themed text field)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Button Node`** (1 nodes): `App Button (primary/secondary/text)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Screen Wrapper Node`** (1 nodes): `Screen Wrapper Layout`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Glass Card Node`** (1 nodes): `Glass Card (glassmorphism container)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Template Model`** (1 nodes): `WorkoutTemplate.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Session Model`** (1 nodes): `WorkoutSession.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workout Sessions Route`** (1 nodes): `workoutSessions.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `FastAPI AI Service App` and `assessUser (proxy to /assess-user, no matching AI endpoint)`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **What is the exact relationship between `property_check.py (Agent db/storage attribute check)` and `Inspection Output: Agent attribute dump ('Agent HAS NO storage attribute')`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Profile Screen` and `Onboarding Wizard (5-step)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Onboarding Wizard (5-step)` and `Home Screen (workout dashboard)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Vyayama App Sitemap Diagram` and `Vyayama App (Root / App Icon)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `Weekly Activity Chart (Steps, Mon-Sun)` and `Circular Progress Ring Widget`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Gym Environment Context (Equipment, Neon Signage, Fitness Tracker Wristband)` and `Vyayama Fitness App`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._