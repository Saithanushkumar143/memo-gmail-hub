import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";

interface NotesHeaderProps {
  onCreateNote: () => void;
  onSignOut: () => void;
  userEmail?: string;
}

export const NotesHeader = ({ onCreateNote, onSignOut, userEmail }: NotesHeaderProps) => {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Notes</h1>
              {userEmail && (
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="fixed bottom-6 right-6 z-20">
        <Button onClick={onCreateNote} className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
    </>
  );
};
