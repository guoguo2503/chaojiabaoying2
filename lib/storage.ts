const MAX_RECENT_ARGUMENTS = 5;
const STORAGE_KEY = "recentArguments";

export function saveArgument(argument: string): void {
  if (typeof window === "undefined") return;
  
  try {
    // Get existing arguments
    const existingArgsJSON = localStorage.getItem(STORAGE_KEY);
    const existingArgs: string[] = existingArgsJSON 
      ? JSON.parse(existingArgsJSON) 
      : [];
    
    // Remove this argument if it already exists (to move it to the top)
    const filteredArgs = existingArgs.filter(arg => arg !== argument);
    
    // Add current argument to the beginning
    const updatedArgs = [argument, ...filteredArgs].slice(0, MAX_RECENT_ARGUMENTS);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArgs));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function getRecentArguments(): string[] {
  if (typeof window === "undefined") return [];
  
  try {
    const argsJSON = localStorage.getItem(STORAGE_KEY);
    return argsJSON ? JSON.parse(argsJSON) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

export function clearRecentArguments(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}