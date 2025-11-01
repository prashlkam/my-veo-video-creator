export type AspectRatio = '16:9' | '9:16';

// FIX: Added global declaration for window.aistudio to centralize type definitions
// and resolve TypeScript errors.
// This is a global declaration for the aistudio object, which is injected by the environment.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // FIX: Add readonly modifier to resolve conflict with another declaration.
    readonly aistudio: AIStudio;
  }
}
